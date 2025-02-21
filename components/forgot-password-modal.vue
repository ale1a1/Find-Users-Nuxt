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
   <div v-if="modalVisible" class="min-h-screen bg-gray-100 flex-col w-full px-6 py-12 lg:px-8 fixed inset-0 flex justify-center items-center z-50">
    <div v-click-outside="closeModal" class="bg-white rounded-lg shadow-lg w-full sm:w-96 p-8 relative">
      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-0 right-2 text-gray-600 hover:text-gray-900 text-xl cursor-pointer">
        &times;
      </button>
      <!-- Title -->      
      <h2 class="text-center text-2xl font-bold text-gray-900 mb-4">Forgot password?</h2>
      <!-- Description -->
      <p class="text-gray-700 text-center mt-10 mb-4">
        Enter your email below and click 'Send Email' to receive a password reset <link rel="stylesheet" href="" class="">
      </p>      
      <!-- Form -->
      <form @submit.prevent="sendResetPasswordEmail" class="space-y-6 mt-10">
        <!-- Email address -->
        <div>
          <label for="username" class="block font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input type="email" :disabled="apiCall || emailSent" id="username" v-model="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
          </div>
        </div>     
        <!-- Register Button -->
        <div>
          <button v-if="!emailSent"  :disabled="apiCall" type="submit" class="flex w-full justify-center rounded-md mt-8 bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:hover:bg-indigo-400">
            {{ apiCall ? 'Sending email...' : 'Send email' }}
          </button>
          <button v-else type="submit" :disabled="emailSent" class="flex w-full justify-center rounded-md mt-8 bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:hover:bg-indigo-400">
            Email sent
          </button>
        </div>
      </form>
    </div>
  </div>
</template>