<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { watchEffect } from 'vue';
import Footer from './components/footer.vue';

const authStore = useAuthStore();
const router = useRouter();

// Redirect if user is not authenticated
watchEffect(() => {
  if (!authStore.user && router.currentRoute.value.path !== '/login') {
    router.push('/login');
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Check if user is authenticated -->
    <template v-if="authStore.user">
      <!-- Show navbar if user is authenticated -->
      <nav class="bg-red-500">
        <div class="px-2 sm:px-6 lg:px-8">
          <div class="relative flex h-16 items-center justify-between">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <!-- Mobile menu button-->
              <button type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset" aria-controls="mobile-menu" aria-expanded="false">
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>
                <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
            <div class="flex flex-1 gap-20 items-center justify-center sm:items-stretch sm:justify-start">
              <div class="flex shrink-0 items-center">
                <p>Find Users App</p>
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4">
                  <NuxtLink to="/home" class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Home</NuxtLink>
                  <NuxtLink to="/users-list" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Users list</NuxtLink>
                  <NuxtLink to="/favourites" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Favourites</NuxtLink>
                </div>
              </div>
            </div>         
          </div>
        </div>
      </nav>
    </template>
    <!-- Main page content -->
    <div class="flex-1">
      <NuxtPage />
    </div>
    <!-- Footer only if user is authenticated -->
    <template v-if="authStore.user">
      <Footer />
    </template>
  </div>
</template>