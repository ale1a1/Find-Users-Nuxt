<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useUserStore } from '../stores/userStore';
import { ChevronDown } from 'lucide-vue-next';
import { useRuntimeConfig } from '#app';
import { useNuxtApp } from "#app";
import { getAuth } from "firebase/auth";
import { Firestore, doc, getDoc, setDoc } from "firebase/firestore";

const { $db } = useNuxtApp();
const auth = getAuth(); 
const user = auth.currentUser; 

const config = useRuntimeConfig();
const imgurKey = config.public.imgurKey; 

interface UserDetails {
  name: string;
  profession: string;
  country: string;
  email: string;
  openedToWork: boolean;
  profilePicture: File | null;
  profilePictureUrl: string | null
}

interface Country {
  name: string;
  alpha3Code: string;
  flag: string;
}

const formInitialState: UserDetails = {
  name: '',
  profession: '',
  country: '',
  email: '',
  openedToWork: false,
  profilePicture: null,
  profilePictureUrl: null
};

const isLoading = ref(false);
const form = reactive({ ...formInitialState });
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const isFormEmpty = ref(false);
const formTouched = ref(false);
const userStore = useUserStore();
const fileName = ref('');
const fileInput = ref<HTMLInputElement | null>(null); 
const { currentUser } = userStore;
const countries = ref<Country[]>([]);
const isOpen = ref(false);
const selectedCountryName = ref('');
const selectedCountryFlag = ref('');
const isLoadingCountries = ref(false);
const countryFetchError = ref<string | null>(null);
const defaultCountrySelection = ref(true);

const isProfilePicChanged = ref(false);

const isDropdownOpen = ref(false);

const error = ref(false);

const isFormValid = computed(() => {  
  isSubmitted.value = false;
  return (
    form.name &&
    form.profession &&
    form.country &&
    form.email &&
    Object.keys(inputError.value).length === 0     
  );
});

const resetForm = () => {
  Object.assign(form, formInitialState);
  selectedCountryName.value = ''
  selectedCountryFlag.value = ''
  fileName.value = ''
  formTouched.value = false;
  isSubmitted.value = false;
  isFormEmpty.value = true;
  form.openedToWork = false;
};

const fetchFormData = async () => {
  if (!user) {
    console.error("User not logged in!");
    return;
  }
  isLoading.value = true;
  try {
    const db = $db as Firestore;
    const docRef = doc(db, "UsersProfileDetails", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      form.country = userData.country
      form.name = userData.name
      form.email = userData.email
      form.profession = userData.profession
      form.profilePictureUrl = userData.profilePictureUrl
      form.openedToWork = userData.openedToWork
      formInitialState.email = userData.email
      fileName.value = userData.profilePictureName
      selectedCountryName.value = userData.country
      setTimeout(() => {
        isLoading.value = false;
        formTouched.value = false
      }, 500)
      // Fetch countries first, then select user's country
      await fetchCountries();
      const selectedCountry = countries.value.find(
        (country) => country.name === userData.country
      );
      if (selectedCountry) {
        selectCountry(selectedCountry);
      }
      return userData;
    } else {
      isLoading.value = false;
      isFormEmpty.value = true
      if (user.email) {
        form.email = user.email
      }
      const toastErrorMessage = "No user data found for the logged-in user."
      console.error(toastErrorMessage);
    }
  } catch (error) {
    isLoading.value = false;
    isFormEmpty.value = true
    const toastErrorMessage = "Error fetching user profile data"
    toast.error(toastErrorMessage, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
    console.error("Error fetching user data: " + error)
  }
};

const submitForm = async () => { 
  isSubmitting.value = true;
  formTouched.value = false
  if (!fileName.value || !isProfilePicChanged.value) {
    saveFormData(form)
  } else {
    uploadToImgur()   
  }    
};

const saveFormData = async (userProfileDetails: any) => {
  if (!user) {
    console.error("User not logged in!");
    // isSubmitting.value = false;
    // formTouched.value = true
    return;
  }
  try {
    const db = $db as Firestore;
    await setDoc(doc(db, "UsersProfileDetails", user.uid), {
      uid: user.uid,
      name: userProfileDetails.name,
      profession: userProfileDetails.profession,
      country: userProfileDetails.country,
      email: userProfileDetails.email,
      openedToWork: userProfileDetails.openedToWork,
      profilePictureUrl: userProfileDetails.profilePictureUrl,
      profilePictureName: fileName.value,
      createdAt: new Date(),
    });
    toast.success('Profile updated successfully!', {
      position: 'top-right',
      autoClose: 2000,       
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true
    })
    userStore.setVisibleDetails(userProfileDetails)   
    isSubmitting.value = false;
    isSubmitted.value = true
    form.openedToWork = userProfileDetails.openedToWork;
  } catch (error) {
    toast.error('Error updating profile.', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
    console.error('Error updating profile.')
    isSubmitting.value = false;
    isFormEmpty.value = false;
  }
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;
  isProfilePicChanged.value = true;
  if (file && !file.type.startsWith("image/")) {
    toast.error("Only image files are allowed!", { position: "top-right" });
    return;
  }
  form.profilePicture = file;
  fileName.value = file ? file.name : "No file chosen";
  formTouched.value = true;
  isSubmitted.value = false;
};

const clearProfilePicture = () => {
  form.profilePicture = null;
  form.profilePictureUrl = null;
  fileName.value = '';
  formTouched.value = true;
  isSubmitted.value = false;
  if (fileInput.value) {
    fileInput.value.value = '';  
  }
};

const uploadToImgur = async () => {  
    if (!form.profilePicture || !(form.profilePicture instanceof File)) {
      toast.error('Please select a valid image file.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false
      });
      console.error("Invalid profile picture file.");
      isSubmitting.value = false;
      formTouched.value = true
      return;
    }
    const formData = new FormData();
    formData.append("image", form.profilePicture);
    const clientId = "56f415c0bdf60ec"; 
    try {
      const response = await fetch("https://api.imgur.com/3/image", {
          method: "POST",
          headers: {
              "Authorization": `Client-ID ${clientId}`
          },
          body: formData
      });
      const data = await response.json();
      if (data.success) {    
        form.profilePictureUrl = data.data.link; 
        saveFormData(form)
      } else {
        toast.error('Error uploading profile picture.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false
        })
        isSubmitting.value = false;
        setTimeout(() => {
          formTouched.value = true
          isFormEmpty.value = false;
        }, 5000)       
        console.error("Error uploading profile picture.");
      }
    } catch (error) {
        toast.error('Error uploading profile picture.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false
      })
      isSubmitting.value = false;
      setTimeout(() => {
          formTouched.value = true
          isFormEmpty.value = false;
        }, 5000)  
      console.error("Error uploading profile picture:", error);
    }
};

const inputError = computed(() => {
  const errors: Record<string, string> = {};
  if (form.name.length > 20) {
    errors.username = `Username must be at most 20 characters.`;  }
  if (form.profession.length > 20) {
    errors.job = `Job title must be at most 20 characters.`;
  }
  if (form.email.length > 20) {
    errors.email = `Email must be at most 20 characters.`;
  }
  return errors;
});

const fetchCountries = async () => {
  isLoadingCountries.value = true;
  countryFetchError.value = null;
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }   
    const data = await response.json();
    countries.value = data.map(country => ({
      name: country.name.common,
      alpha3Code: country.alpha3Code,
      flag: country.flags.svg
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching countries:', error);
    countryFetchError.value = 'Something went wrong while retrieving the country list.';
  } finally {
    isLoadingCountries.value = false;
  }
};

const toggleCountriesDropdown = () => {
  isOpen.value = !isOpen.value;
  searchQuery.value = ""
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectCountry = (country: any) => {
  if (!defaultCountrySelection.value) isDropdownOpen.value = !isDropdownOpen.value;
  selectedCountryName.value = country.name;
  selectedCountryFlag.value = country.flag;
  form.country = country.name
  formTouched.value = true
  isOpen.value = false;
  searchQuery.value = '';
  defaultCountrySelection.value = false
};

watch(isLoadingCountries, (newValue) => {
  console.log('Loading state changed:', newValue);
});

const searchQuery = ref(''); 

const filteredCountries = computed(() => {
  return countries.value.filter(country =>
    country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(() => {
  fetchCountries();
  fetchFormData()
});
</script>

<template>
  <div v-if="!isLoading" class="flex flex-col items-center justify-center px-6 py-12 lg:px-8 mb-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-2xl shadow-lg border-2 border-amber-400/50 rounded-lg p-8 bg-neutral-900 text-gray-100">
      <form @submit.prevent="submitForm" class="space-y-8">
        <!--------------------- Form Fields ---------------------->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-10">
          <!-- Username, job and email -->
          <div v-for="(label, key) in { name: 'Name', profession: 'Profession', email: 'Email' }" :key="key" class="relative">
            <label :for="key" class="block font-medium">{{ label }}</label>
            <input
              v-model="form[key]"
              :type="key === 'email' ? 'email' : 'text'"
              :id="key"
              required
              :disabled="key === 'email' || isSubmitting"
              :class="{'focus:outline-red-500/80': error}"
              class="disabled:cursor-not-allowed block w-full mt-2 rounded-md bg-gray-400/10 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-amber-400/50 placeholder:text-gray-400 focus:outline-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
              @input="formTouched = true"
            />
            <p v-if="inputError[key]" class="absolute text-red-500 text-sm mt-1 left-0">{{ inputError[key] }}</p>
          </div>
          <!-- Country  -->
          <div class="relative inline-block w-full">
            <label class="block font-medium">Country</label>
            <button
              @click.prevent="toggleCountriesDropdown"
              :disabled="isSubmitting"
              class="disabled:cursor-not-allowed w-full mt-2 rounded-md bg-gray-400/10 px-3 py-1.5 text-base text-gray-300 outline  placeholder:text-gray-400 flex justify-between items-center cursor-pointer"
              :class="isDropdownOpen ? 'outline-gray-400 outline-2' : 'outline-amber-400/50'"
              >
              <span class="flex items-center">
                <img v-if="selectedCountryFlag" :src="selectedCountryFlag" alt="" class="inline-block w-5 h-5 mr-2" />
                <span class="truncate w-full" :title="selectedCountryName">{{ selectedCountryName || 'select a country' }}</span>
              </span>
              <ChevronDown class="w-4 h-4 text-amber-400" />
            </button>
            <div v-if="isOpen" v-click-outside="toggleCountriesDropdown" class="absolute left-0 right-0 mt-1 bg-neutral-800 border border-gray-400 rounded-md shadow-lg z-10">
              <!-- Search Input for Filtering Countries -->
              <div class="px-3 py-2">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search country..."
                  class="w-full rounded-md bg-gray-400/10 px-3 py-1.5 text-base text-gray-300 focus:outline-2 focus:-outline-offset-2  focus:outline-gray-400"
                />
              </div>
              <ul class="max-h-60 overflow-auto">
                <li v-if="countryFetchError" class="flex items-center p-2 text-xs text-red-500 italic">{{ countryFetchError }}</li>
                <li v-if="isLoadingCountries" class="flex items-center p-2 italic">loading...</li>
                <li
                  v-for="country in filteredCountries"
                  :key="country.alpha3Code"
                  @click="selectCountry(country)"
                  class="flex items-center p-2 hover:bg-gray-500 cursor-pointer"
                >
                  <img :src="country.flag" alt="" class="w-5 h-5 mr-2" />
                  <span class="truncate w-full" :title="country.name">{{ country.name }}</span>
                </li>
              </ul>
            </div>
          </div>
          <!-- Profile Picture -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center space-x-2">
              <label class="font-medium">Profile Picture <span class="text-xs text-gray-400">(optional)</span> </label>
              <label class="font-medium">-</label>
              <label  class="text-amber-400 hover:text-amber-400/80 text-sm cursor-pointer italic">
                choose file
                <input
                  ref="fileInput"
                  type="file"
                  :disabled="isSubmitting"
                  accept="image/*"
                  @change="handleFileChange"
                  class="hidden"
                />
              </label>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-300 text-sm truncate cursor-default" :title="fileName || 'no file chosen'">{{ fileName || 'no file chosen' }}</span>
              <button
                type="button"
                @click="clearProfilePicture"
                :disabled="isSubmitting"
                class="text-red-500 disabled:hover:text-red-500 disabled:cursor-not-allowed hover:text-red-500/80 text-lg cursor-pointer"
                v-if="fileName"
              >
                &times;
              </button>
            </div>
          </div>
          <!-- Opened to work checkbox -->
          <div class="flex items-center space-x-2">
            <input
              v-model="form.openedToWork"
              type="checkbox"
              :disabled="isSubmitting"
              id="openedToWork"
              class="hidden"
              @input="formTouched = true, isSubmitted = false"
            />
            <label for="openedToWork" class="custom-checkbox">
              <span class="checkmark"></span>
            </label>
            <span>Opened to work</span>
          </div>
        </div>
        <!--------------------- Save and Cancek buttons ---------------------->
        <div class="flex space-x-8">
          <button
            type="submit"
            :disabled="!isFormValid || isSubmitting || isSubmitted || !formTouched"
            class="w-full bg-amber-400/90 px-3 py-1.5 text-sm font-bold text-neutral-900 rounded-md shadow hover:bg-amber-400/80 disabled:cursor-not-allowed disabled:bg-amber-400/40 cursor-pointer"
          >
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
          <button
            type="button"
            @click="resetForm"
            :disabled="isFormEmpty || isSubmitting"
            class="w-full bg-red-500/90 text-neutral-900 px-3 py-1.5 text-sm font-bold rounded-md shadow hover:bg-red-500/80 disabled:cursor-not-allowed disabled:bg-red-500/40  disabled:text-neutral-900 cursor-pointer"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  </div>
  <!-- Loading spinner -->
  <div v-else class="flex items-center justify-center absolute inset-0">
    <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
  </div>


</template>

<style scoped>
input:-webkit-autofill {
  background-color: rgba(16, 16, 16, 0.1) !important;
  color: #d1d5db !important;
  -webkit-text-fill-color: #d1d5db !important;
  -webkit-box-shadow: 0 0 0px 1000px rgba(16, 16, 16, 0.1) inset !important;
  transition: background-color 5000s ease-in-out 0s;
}
input.autofill {
  background-color: rgba(16, 16, 16, 0.1) !important;
  color: #d1d5db !important;
  -webkit-text-fill-color: #d1d5db !important;
}
/* Open to work check box */
.custom-checkbox {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid rgba(251, 191, 36, 0.5);
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  background-color: rgba(156, 163, 175, 0.1);
}
.custom-checkbox .checkmark {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  border-radius: 1x;
  transition: background-color 0.3s;
}
input[type="checkbox"]:checked + .custom-checkbox .checkmark {
  background-color:#16A34A;
}
input[type="checkbox"]:checked + .custom-checkbox .checkmark::after {
  content: "";
  position: absolute;
  left: 5.5px;
  width: 6px;
  height: 13px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}
/* Scrollbar styles for the dropdown */
::-webkit-scrollbar {
  width: 8px; 
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1); 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: rgba(251, 191, 36, 0.5); 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(251, 191, 36, 0.8); 
}
/* Ensure the dropdown is scrollable */
.max-h-60 {
  overflow-y: auto;
}
</style>
