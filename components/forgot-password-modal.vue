<script setup lang="ts">
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from 'vue3-toastify'

const auth = useNuxtApp().$auth;

const props = defineProps<{
  isOpen: boolean;
}>();

const email = ref("");

const emit = defineEmits(["close"]);

const apiCall = ref(false);

const emailSent = ref(false);

const modalVisible = computed(() => {
  return props.isOpen;
});

const sendResetPasswordEmail = async () => { 
 apiCall.value = true     
 await sendPasswordResetEmail(auth, email.value)
  .then(() => {
      apiCall.value = false
      emailSent.value = true
      toast.success('Reset password email sent!', {
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
  emailSent.value = false;
  email.value = "";
  emit("close");
};
</script >

<template>
   <!-- Modal Overlay -->
   <div v-if="modalVisible" class="min-h-screen flex-col w-full px-6 py-12 lg:px-8 fixed inset-0 flex justify-center items-center z-50">
    <div v-click-outside="closeModal" class="border-2 border-amber-400/50 bg-neutral-900  text-gray-100 rounded-lg shadow-lg w-full sm:w-96 p-8 relative">
      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-0 right-3 text-red-500 hover:text-red-500/80 text-xl cursor-pointer">
        &times;
      </button>
      <!-- Title -->      
      <h2 class="text-center text-2xl font-bold text-gray-200 mb-4">Forgot password?</h2>
      <!-- Description -->
      <p class="text-center mt-10 mb-4">
        Enter your email below and click 'Send Email' to receive a password reset link.<link rel="stylesheet" href="" class="">
      </p>      
      <!-- Form -->
      <form @submit.prevent="sendResetPasswordEmail" class="space-y-6 mt-10">
        <!-- Email address -->
        <div>
          <label for="username" class="block font-medium">Email address</label>
          <div class="mt-2">
            <input type="email" :disabled="apiCall || emailSent" id="username" v-model="email" required class="block w-full rounded-md bg-gray-400/10 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-amber-400/50 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2   focus:outline-gray-400 sm:text-sm/6"/>
          </div>
        </div>     
        <!-- Register Button -->
        <div>
          <button v-if="!emailSent"  :disabled="apiCall" type="submit" class="flex w-full justify-center rounded-md mt-8 bg-amber-400/90 px-3 py-1.5 text-sm/6 font-bold  text-neutral-950 shadow-xs hover:bg-amber-400/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 cursor-pointer disabled:cursor-not-allowed disabled:bg-amber-400/40 disabled:hover:bg-amber-400/40">
            {{ apiCall ? 'Sending email...' : 'Send email' }}
          </button>
          <button v-else type="submit" :disabled="emailSent" class="flex w-full justify-center rounded-md mt-8 bg-amber-400/90 px-3 py-1.5 text-sm/6 font-bold text-white shadow-xs hover:bg-amber-400/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 cursor-pointer disabled:cursor-not-allowed disabled:bg-amber-400/40 disabled:hover:bg-amber-400/40">
            Email sent
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
</style>