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

const form = reactive({ ...formInitialState });
const apiCall = ref(false);
const isSubmitting = ref(false);
const formTouched = ref(false);
const userStore = useUserStore();
const fileName = ref('');
const { currentUser } = userStore;

const countries = ref<Country[]>([]);
const isOpen = ref(false);
const selectedCountryName = ref('');
const selectedCountryFlag = ref('');
const isLoadingCountries = ref(false);
const countryFetchError = ref<string | null>(null);


const isFormValid = computed(() => {
  return (
    form.name &&
    form.profession &&
    form.country &&
    form.email &&
    form.openedToWork &&
    Object.keys(inputError.value).length === 0
  );
});

const resetForm = () => {
  Object.assign(form, formInitialState);
  selectedCountryName.value = ''
  selectedCountryFlag.value = ''
  formTouched.value = false;
};

const fetchFormData = async () => {
  if (!user) {
    console.error("User not logged in!");
    return;
  }
  try {
    // Ensure TypeScript knows $db is of type Firestore
    const db = $db as Firestore;
    // Get the document for the logged-in user from the "UsersProfileDetails" collection
    const docRef = doc(db, "UsersProfileDetails", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // If the document exists, return the user data
      const userData = docSnap.data();
      form.country = userData.country
      form.name = userData.name
      form.email = userData.email
      form.profession = userData.profession
      form.profilePictureUrl = userData.profilePictureUrl
      form.openedToWork = userData.openedToWork
      console.log("User data:", userData);
      return userData;
    } else {
      console.error("No user data found for the logged-in user.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};


const saveFormData = async (userProfileDetails: any) => {
  if (!user) {
    console.error("User not logged in!");
    return;
  }
  try {
    // Ensure TypeScript knows $db is of type Firestore
    const db = $db as Firestore;
    await setDoc(doc(db, "UsersProfileDetails", user.uid), {
      uid: user.uid,
      name: form.name,
      profession: form.profession,
      country: form.country,
      email: form.email,
      openedToWork: form.openedToWork,
      profilePictureUrl: form.profilePictureUrl,
      createdAt: new Date(),
    });
    alert("Data saved successfully!");
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

const submitForm = async () => {
  apiCall.value = true;
  isSubmitting.value = true;
  try {
    // const profilePictureUrl = await uploadToImgur()
    // form.profilePictureUrl = profilePictureUrl   
    form.profilePictureUrl = 'https://i.imgur.com/4R1SQxz.png'
    userStore.setVisibleDetails(form)
    saveFormData(form)
    toast.success('Profile updated successfully!', { position: 'top-right' });
    formTouched.value = false;
  } catch (error) {
    toast.error('Error updating profile.', { position: 'top-right' });
  } finally {
    apiCall.value = false;
    isSubmitting.value = false;
  }
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;
  if (file && !file.type.startsWith("image/")) {
    toast.error("Only image files are allowed!", { position: "top-right" });
    return;
  }
  form.profilePicture = file;
  fileName.value = file ? file.name : "No file chosen";
  formTouched.value = true;
};

const clearProfilePicture = () => {

  form.profilePicture = null;
  fileName.value = '';
  formTouched.value = true;
};

const uploadToImgur = async (): Promise<string | null> => {
    if (!form.profilePicture) {
        toast.error("Please select an image!", { position: "top-right" });
        return null;
    }
    const imageFile = form.profilePicture; 
    const formData = new FormData();
    formData.append("image", imageFile);
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
            return data.data.link; 
        } else {
            toast.error("Profile picture upload failed!", { position: "top-right" });
            return null;
        }
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error("Something went wrong!", { position: "top-right" });
        return null;
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
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    countryFetchError.value = 'Something went wrong while retrieving the country list.';
  } finally {
    isLoadingCountries.value = false;
  }
};

const toggleCountriesDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectCountry = (country: any) => {
  selectedCountryName.value = country.name;
  selectedCountryFlag.value = country.flag;
  form.country = country.name
  formTouched.value = true
  isOpen.value = false;
};

watch(isLoadingCountries, (newValue) => {
  console.log('Loading state changed:', newValue);
});

// watch(form, (newValue, oldValue) => {
//   // Optionally track changes or synchronize data with some logic
//   console.log('Form updated:', newValue);
// });

onMounted(() => {
  fetchCountries();
  fetchFormData()
});
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-2xl shadow-lg border border-amber-400 rounded-lg p-8 bg-neutral-900 text-gray-100">
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
              class="block w-full mt-2 rounded-md bg-gray-400/10 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-amber-400/50 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/80 sm:text-sm/6"
              @input="formTouched = true"
            />
            <p v-if="inputError[key]" class="absolute text-red-500 text-sm mt-1 left-0">{{ inputError[key] }}</p>
          </div>
          <!-- Country -->
          <div class="relative inline-block w-full">
            <label class="block font-medium">Country</label>
            <button
              @click.prevent="toggleCountriesDropdown"
              class="w-full mt-2 rounded-md bg-gray-400/10 px-3 py-1.5 text-base text-gray-300 outline outline-amber-400/50 placeholder:text-gray-400 focus:outline-2 focus:outline-amber-400 focus:outline-offset-2 flex justify-between items-center cursor-pointer"
            >
              <span class="flex items-center">
                <img v-if="selectedCountryFlag" :src="selectedCountryFlag" alt="" class="inline-block w-5 h-5 mr-2" />
                {{ selectedCountryName || 'select a country' }}
              </span>
              <ChevronDown class="w-4 h-4 text-amber-400" />
            </button>
            <div v-if="isOpen" v-click-outside="toggleCountriesDropdown" class="absolute left-0 right-0 mt-1 bg-neutral-800 border border-amber-400 rounded-md shadow-lg z-10">
              <ul class="max-h-60 overflow-auto">
                <li v-if="countryFetchError" class="flex items-center p-2 text-xs text-red-500 italic">{{ countryFetchError }}</li>
                <li v-if="isLoadingCountries" class="flex items-center p-2 italic">loading...</li>
                <li
                  v-for="country in countries"
                  :key="country.alpha3Code"
                  @click="selectCountry(country)"
                  class="flex items-center p-2 hover:bg-gray-500 cursor-pointer"
                >
                  <img :src="country.flag" alt="" class="w-5 h-5 mr-2" />
                  {{ country.name }}
                </li>
              </ul>
            </div>
          </div>
          <!-- Profile Picture -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center space-x-2">
              <label class="font-medium">Profile Picture <span class="text-xs text-gray-400">(optional)</span> </label>
              <label class="font-medium">-</label>
              <label class="text-amber-400  hover:text-amber-400/80 text-sm cursor-pointer italic">
                choose file
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  class="hidden"
                />
              </label>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-300 text-sm">{{ fileName || 'no file chosen' }}</span>
              <button
                type="button"
                @click="clearProfilePicture"
                class="text-red-500 hover:text-red-500/80 text-lg cursor-pointer"
                v-if="form.profilePicture"
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
              id="openedToWork"
              class="hidden"
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
            :disabled="!isFormValid"
            class="w-full bg-amber-400 px-3 py-1.5 text-sm font-bold text-neutral-900 rounded-md shadow hover:bg-amber-400/80 disabled:cursor-not-allowed disabled:bg-amber-400/40 cursor-pointer"
          >
            <span v-if="apiCall" class="animate-spin h-5 w-5 mr-2">🔄</span>
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
          <button
            type="button"
            @click="resetForm"
            :disabled="!formTouched"
            class="w-full bg-red-500  text-neutral-900 px-3 py-1.5 text-sm font-bold rounded-md shadow hover:bg-red-500/80 disabled:cursor-not-allowed disabled:bg-red-500/40  disabled:text-neutral-900 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
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
