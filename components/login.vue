<script setup lang="ts">
import { useLoginRedirectStore } from '@/stores/loginRedirect';
import RegistrationModal from '~/components/registration-modal.vue';
import ForgotPasswordModal from '~/components/forgot-password-modal.vue';
import { signInWithEmailAndPassword, sendEmailVerification, signOut, type Auth } from "firebase/auth";
import { toast } from 'vue3-toastify'
import { Eye, EyeOff, Check  } from 'lucide-vue-next';

type ModalKeys = "registerModal" | "forgotPasswordModal";

onMounted(() => {
  signOut(auth)
})

const auth = useNuxtApp().$auth as Auth;

const router = useRouter();
const loginRedirectStore = useLoginRedirectStore();

const { redirectFrom } = storeToRefs(loginRedirectStore);

const verificationMessage = ref<string | null>(null);

watch(redirectFrom, (newValue) => {
  if (newValue === "email-verified") {
    verificationMessage.value = 'Your email has been verified. You can now login.';
  }
});

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
      router.push('/');
    } else {
      await signOut(auth); 
      apiCall.value = false;
      verificationMessage.value = null;
      sendEmailVerification(user).then(() => {
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
      })
      .catch((error) => {
        apiCall.value = false
        setTimeout(() => {
          apiCall.value = false;
        }, 3000);
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
  } catch (error: unknown) {
    apiCall.value = false;
    setTimeout(() => {
      isLogging.value = false;
    }, 3000);
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

function isFirebaseError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error;
}
</script>


<template>

  <div v-if="!modals.registerModalOpen && !modals.forgotPasswordModalOpen"class="flex min-h-screen flex-col w-full items-center justify-center px-6 py-12 lg:px-8">
    <!-- Verification message -->
    <div v-if="verificationMessage" class="sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="flex items-center mb-4 p-4 bg-green-50 border border-green-200 rounded-lg shadow-md">
        <div class="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
          <Check class="w-4 h-4 text-white" />
        </div>
        <p class="text-green-800 ml-2 text-sm font-semibold" v-html="verificationMessage"></p>
      </div>
    </div>
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
              <div v-if="redirectFrom != 'reset-password' " class="text-sm">
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
            <button type="submit" :disabled="isLogging" class="flex w-full justify-center items-center rounded-md mt-8 bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:hover:bg-indigo-400">
              <svg v-if="apiCall" class="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
              </svg>
              <span>{{ apiCall ? 'Signing in...' : 'Sign in' }}</span>
            </button>
          </div>
        </form>
        <p v-if="!redirectFrom" class="mt-10 text-center text-sm/6 text-gray-500">
          Not register yet?
          <a @click="openModal('registerModal')" class="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Click here to create your profile</a>
        </p>
      </div>
    </div>
  </div>

 <RegistrationModal :isOpen="modals.registerModalOpen" @close="closeModal('registerModal')"/>
 <ForgotPasswordModal :isOpen="modals.forgotPasswordModalOpen" @close="closeModal('forgotPasswordModal')"/>

</template>