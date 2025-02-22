<script setup lang="ts">
import { createUserWithEmailAndPassword, sendEmailVerification, signOut} from "firebase/auth";
import { toast } from 'vue3-toastify'
import { Eye, EyeOff } from 'lucide-vue-next';

const auth = useNuxtApp().$auth;

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const passwordTouched = ref(false);
const formTouchedAfterError = ref(false);

const isRegistering = ref(false);
const registered = ref(false);
const apiCall = ref(false);

const modalVisible = computed(() => {
  return props.isOpen;
});

const submitForm = async () => { 
 isRegistering.value = true;
 apiCall.value = true     
 await createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
      apiCall.value = false
      registered.value = true
      toast.success('Registration completed!', {
      position: 'top-right',
      autoClose: 7000,       
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
    const user = userCredential.user;
    if (user) {
      sendEmailVerification(user).then(() => {
        setTimeout(() => {
          toast.info("Verification email sent! Please check your inbox.", {
          position: "top-right",
          autoClose: 6500,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false
        });
        }, 2000); 
      })
      .catch((error) => {
        apiCall.value = false     
        setTimeout(() => {
          isRegistering.value = false;
        }, 7000);
        const toastErrorMessage = error.code
        console.error(toastErrorMessage);
        toast.error(toastErrorMessage, {
          position: 'top-right',
          autoClose: 5500,       
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false
        })
      })
    }
  })
  .catch((error) => {
    apiCall.value = false     
    setTimeout(() => {
      isRegistering.value = false;
    }, 7000);
    const toastErrorMessage = error.code
    console.error(toastErrorMessage);
    toast.error(toastErrorMessage, {
      position: 'top-right',
      autoClose: 5500,       
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
  });
 }

const closeModal = () => {
  email.value = "";
  password.value = "";
  passwordTouched.value = false;
  isRegistering.value = false;
  registered.value = false;
  emit("close");
};

const passwordError = computed(() => {
  if (!passwordTouched.value) return ""; 
  
  if (password.value.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  if (password.value.length > 20) {
    return "Password cannot be more than 20 characters.";
  }
  if (!/[A-Z]/.test(password.value)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/\d/.test(password.value)) {
    return "Password must contain at least one number.";
  }
  return "";
});
</script >

<template>
  <!-- Modal Overlay -->
  <div v-if="modalVisible" class="min-h-screen flex-col w-full px-6 py-12 lg:px-8 fixed inset-0 flex justify-center items-center z-50">
    <div v-click-outside="closeModal" class="bg-white rounded-lg shadow-lg w-full sm:w-96 p-8 relative">
      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-0 right-3 text-gray-600 hover:text-gray-900 text-xl cursor-pointer">
        &times;
      </button>
      <!-- Title -->      
      <h2 class="text-center text-2xl font-bold text-gray-900 mb-4">Create Your Profile</h2>      
      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6 mt-10">
        <!-- Email address -->
        <div>
          <label for="username" class="block font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input type="email" @input="formTouchedAfterError = true" :disabled="isRegistering" id="username" v-model="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
          </div>
        </div>
        <!-- Password -->
        <div>
          <label for="password" class="block font-medium text-gray-900">Password</label>
          <div class="relative mt-2">
            <input :type="showPassword ? 'text' : 'password'"  @input="passwordTouched = true" :disabled="isRegistering" id="password" v-model="password" required class="block w-full rounded-md bg-white pl-3 pr-10 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
            <!-- Eye Icon Toggle -->
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer">
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button> 
          </div>
          <p v-if="passwordError" class="text-red-500 text-sm mt-2">{{ passwordError }}</p>
        </div>   
        <!-- Register Button -->
        <div>
          <button v-if="!registered"  type="submit" :disabled="isRegistering || !!passwordError" class="flex w-full justify-center rounded-md mt-8 bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:hover:bg-indigo-400">
            {{ apiCall ? 'Registering...' : 'Register' }}
          </button>
          <button v-else type="submit" :disabled="isRegistering || !!passwordError" class="flex w-full justify-center rounded-md mt-8 bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:hover:bg-indigo-400">
            Registered
          </button>
        </div>
      </form>
    </div>
  </div>
</template>