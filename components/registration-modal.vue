<script setup lang="ts">
import { defineEmits } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "~/firebase";
import { toast } from 'vue3-toastify'
import { Eye, EyeOff } from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const isRegistering = ref(false);

const modalVisible = computed(() => {
  return props.isOpen;
});

const submitForm = async () => { 
 isRegistering.value = true;
 await createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    email.value = "";
    password.value = "";  
    toast.success('Registration completed!', {
      position: 'top-right',
      autoClose: 7000,       
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
  })
  .catch((error) => {
    setTimeout(() => {
      isRegistering.value = false;
    }, 7000);
    const toastErrorMessage = error.code
    console.error(toastErrorMessage);
    toast.error(toastErrorMessage, {
      position: 'top-right',
      autoClose: 7000,       
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
  });
 }

const closeModal = () => {
  email.value = "";
  password.value = "";
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
      <h2 class="text-center text-2xl font-bold text-gray-900 mb-4">Create Your Profile</h2>      
      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6 mt-10">
        <!-- Email address -->
        <div>
          <label for="username" class="block font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input type="email" :disabled="isRegistering" id="username" v-model="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
          </div>
        </div>
        <!-- Password -->
        <div>
          <label for="password" class="block font-medium text-gray-900">Password</label>
          <div class="relative mt-2">
            <input :type="showPassword ? 'text' : 'password'" :disabled="isRegistering" id="password" v-model="password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>
            <!-- Eye Icon Toggle -->
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700">
              <Eye v-if="!showPassword" class="w-5 h-5" />
              <EyeOff v-else class="w-5 h-5" />
            </button> 
          </div>
        </div>   
        <!-- Register Button -->
        <div>
          <button type="submit" :disabled="isRegistering" class="flex w-full justify-center rounded-md mt-8 bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:hover:bg-indigo-400">
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>