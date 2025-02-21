<script setup lang="ts">
import { type Auth, confirmPasswordReset } from "firebase/auth";
import { toast } from 'vue3-toastify'
import { Eye, EyeOff } from 'lucide-vue-next';
import { useNuxtApp } from "nuxt/app";
import { computed, ref } from "vue";
import { useLoginRedirectStore } from '@/stores/loginRedirect';

const loginRedirectStore = useLoginRedirectStore();

const auth = useNuxtApp().$auth as Auth;

const route = useRoute();
const router = useRouter();
const oobCode = ref(route.query.oobCode as string || '');

const password = ref("");
const showPassword = ref(false);
const passwordTouched = ref(false);

const apiCall = ref(false);

const passwordSaved = ref(false);

const resetPassword = async () => { 
 apiCall.value = true     
 await confirmPasswordReset(auth, oobCode.value, password.value)
  .then(() => {
      apiCall.value = false
      passwordSaved.value = true
      loginRedirectStore.setRedirectFrom('reset-password')
      toast.success('Password successfully reset!', {
      position: 'top-right',
      autoClose: 3000,       
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
    setTimeout(() => {
      toast.info("You are getting redirected to the login page.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false
      });
    }, 1500); 
    setTimeout(() => {
      router.push('/login');
    }, 6000); 
  })
  .catch((error) => {
    apiCall.value = false     
    setTimeout(() => {
    }, 7000);
    const toastErrorMessage = error.code
    console.error(toastErrorMessage);
    toast.error(toastErrorMessage, {
      position: 'top-right',
      autoClose: 5500,       
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false
    })
  });
 }

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
   <div class="min-h-screen bg-gray-100 flex-col w-full px-6 py-12 lg:px-8 fixed inset-0 flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-lg w-full sm:w-96 p-8 relative">   
      <!-- Title -->      
      <h2 class="text-center text-2xl font-bold text-gray-900 mb-4">Set your new password</h2>
      <!-- Description -->
      <p class="text-gray-700 text-center mt-10 mb-4">
        Enter your new password below and click 'Save password' to continue.
      </p>      
      <!-- Form -->
      <form @submit.prevent="resetPassword" class="space-y-6 mt-10">
        <!-- Password -->
        <div>
          <label for="password" class="block font-medium text-gray-900">Password</label>
          <div class="relative mt-2">
            <input :type="showPassword ? 'text' : 'password'"  @input="passwordTouched = true" :disabled="apiCall || passwordSaved" id="password" v-model="password" required class="block w-full rounded-md bg-white pl-3 pr-10 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
            <!-- Eye Icon Toggle -->
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700">
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button> 
          </div>
          <p v-if="passwordError" class="text-red-500 text-sm mt-2">{{ passwordError }}</p>
        </div>   
        <!-- Register Button -->
        <div>
          <button v-if="!passwordSaved"  :disabled="apiCall" type="submit" class="flex w-full justify-center rounded-md mt-8 bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:hover:bg-indigo-400">
            {{ apiCall ? 'Saving password...' : 'Save password' }}
          </button>
          <button v-else type="submit" :disabled="passwordSaved" class="flex w-full justify-center rounded-md mt-8 bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:hover:bg-indigo-400">
            Password saved
          </button>
        </div>
      </form>
    </div>
  </div>
</template>