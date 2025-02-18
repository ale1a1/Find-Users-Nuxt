<script setup lang="ts">
import { defineEmits } from "vue";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const selectedCountry = ref("+1"); // Default country code
const username = ref("");
const password = ref("");
const phoneNumber = ref("");

const modalVisible = computed(() => {
  console.log("Modal visibility:", props.isOpen);
  return props.isOpen;
});


const closeModal = () => {
  emit("close");
};
</script >

<template>
  <!-- Modal Overlay -->
  <div v-if="modalVisible" class="min-h-screen flex-col w-full px-6 py-12 lg:px-8 fixed inset-0 flex justify-center items-center z-50">
    <div v-click-outside="closeModal" class="bg-white rounded-lg shadow-lg w-full sm:w-96 p-6 relative">
      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl cursor-pointer">
        &times;
      </button>
      <!-- Title -->      
      <h2 class="text-center text-2xl font-bold text-gray-900 mb-4">Create Your Profile</h2>      
      <!-- Form -->
      <form @submit.prevent="closeModal" class="space-y-6 mt-10">
        <!-- Username -->
        <div>
          <label for="username" class="block font-medium text-gray-900">Username</label>
          <div class="mt-2">
            <input type="text" id="username" v-model="username" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"/>
          </div>
        </div>
        <!-- Password -->
        <div>
          <label for="password" class="block font-medium text-gray-900">Password</label>
          <div class="mt-2">
            <input type="password" id="password" v-model="password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"/>
          </div>
        </div>
        <!-- Phone Number with Country Code -->
        <div>
          <label for="phone" class="block font-medium text-gray-900">Phone Number</label>
          <div class="flex mt-2">
            <select v-model="selectedCountry" id="country" class="px-3 py-2 border rounded-l-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600">
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+49">🇩🇪 +49</option>
              <option value="+33">🇫🇷 +33</option>
              <option value="+91">🇮🇳 +91</option>
            </select>
            <input type="tel" v-model="phoneNumber" id="phone" required class="w-full px-3 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-600" />
          </div>
        </div>
        <!-- Register Button -->
        <div>
          <button type="submit" class="flex w-full justify-center rounded-md mt-8 bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
            Register
          </button>
        </div>
      </form>
    </div>
  </div>
</template>