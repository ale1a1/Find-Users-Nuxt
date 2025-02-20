<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import RegistrationModal from '~/components/registration-modal.vue'; 
import ForgotPasswordModal from '~/components/forgot-password-modal.vue';
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'vue3-toastify'
import { Eye, EyeOff } from 'lucide-vue-next';

type ModalKeys = "registerModal" | "forgotPasswordModal";

const auth = useNuxtApp().$auth;

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const isLogging = ref(false);
const apiCall = ref(false);

const modals = reactive({
  registerModalOpen: false,
  forgotPasswordModalOpen: false
});

const openModal = (modalName: ModalKeys) => {
  modals[`${modalName}Open` as keyof typeof modals] = true;
  email.value = "";
  password.value = ""
};

const closeModal = (modalName: ModalKeys) => {
  modals[`${modalName}Open` as keyof typeof modals] = false;
};

const login = async () => {
  apiCall.value = true;
  isLogging.value = true;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;  
    if (user.emailVerified) {
      toast.success('Logging in...', {
      position: 'top-right',
      autoClose: 1000,       
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true
      })
      setTimeout(() => {
        authStore.setUser(user);
        router.push('/');
      }, 2000); 
    } else {
      apiCall.value = false;
      toast.error('Please verify your email before logging in.', {
      position: 'top-right',
      autoClose: 7000,       
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
      })
      setTimeout(() => {
        toast.info("Please check your inbox.", {
        position: "top-right",
        autoClose: 6500,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false
      });
      }, 2000); 
    }
  } catch (error: unknown) {
    apiCall.value = false;
    setTimeout(() => {
      isLogging.value = false;
    }, 7000);
    if (isFirebaseError(error)) {      
      const toastErrorMessage = error.code || 'Unknown error';
      console.error(toastErrorMessage);
      toast.error(toastErrorMessage, {
        position: 'top-right',
        autoClose: 5500,       
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false
      })
    } else {
      toast.error("An unexpected error occurred.", {
        position: 'top-right',
        autoClose: 5500,       
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false
      })
    }
  }
};

function isFirebaseError(error: unknown): error is { code: string; message: string } {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
}
</script>

<template>
  <div class="flex min-h-screen flex-col w-full items-center justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm shadow-lg rounded-lg p-8 bg-white">
      <!-- Title -->      
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 class="mt-0 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <!-- Form -->
        <form @submit.prevent="login" class="space-y-6" action="#" method="POST">
          <!-- Email address -->
          <div>
            <label for="email" class="block font-medium text-gray-900">Email address</label>
            <div class="mt-2">
              <input v-model="email" :disabled="isLogging" type="email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </div>
          </div>    
          <!-- Password -->
          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block font-medium text-gray-900">Password</label>
              <div class="text-sm">
                <a @click="openModal('forgotPasswordModal')" class="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Forgot password?</a>
              </div>
            </div>
            <div class="relative mt-2">
              <input :type="showPassword ? 'text' : 'password'" :disabled="isLogging" id="password" v-model="password" required class="block w-full rounded-md bg-white pl-3 pr-10 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
              <!-- Eye Icon Toggle -->
              <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700">
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button> 
            </div>
          </div>
          <!-- Submit Button -->
          <div>
            <button type="submit" :disabled="isLogging" class="flex w-full justify-center rounded-md mt-8 bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:hover:bg-indigo-400">
              {{ apiCall ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>
        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Not register yet?
          <a @click="openModal('registerModal')" class="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Click here to create your profile</a>
        </p>
      </div>
    </div>
  </div>

 <RegistrationModal :isOpen="modals.registerModalOpen" @close="closeModal('registerModal')"/>
 <ForgotPasswordModal :isOpen="modals.forgotPasswordModalOpen" @close="closeModal('forgotPasswordModal')"/>
 
</template>