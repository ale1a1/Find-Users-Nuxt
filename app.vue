<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watchEffect } from 'vue';
import Footer from './components/footer.vue';
import { useHead } from '#imports'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from 'vue3-toastify'
import { useLoginRedirectStore } from '@/stores/loginRedirect';
import backgroundImage from '~/assets/images/keyboard bg - 2.jpg';
import { useUserStore } from '#imports';

const auth = useNuxtApp().$auth;
const userStore = useUserStore();

const loginRedirectStore = useLoginRedirectStore();

const isAuthChecked = ref(false);

const currentUser = ref();

onMounted(() => {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('find-users-Token') : null;

  onAuthStateChanged(auth, (user) => {
    if (user?.emailVerified && token) {
      console.log("User is signed in");
      currentUser.value = user;
    } else {
      console.log("No user signed in");
    }
    isAuthChecked.value = true;
  });
});

const token = ref(userStore.token);

watch(() => userStore.token, (token) => {
  console.log("Token value changed:", token);
});

watch(() => userStore.currentUser, (user) => {
  currentUser.value = user
  console.log("User value changed:", user);
});

useHead({
  htmlAttrs: {
    class: 'h-full bg-gray-100'
  },
  bodyAttrs: {
    class: 'h-full'
  }
})

const router = useRouter();

const logout = async () => {
  try {
    await signOut(auth); 
    setTimeout(() => { 
      userStore.clearToken()
      userStore.clearCurrentUser()
      sessionStorage.removeItem("find-users-Token")   
      currentUser.value = null; 
    }, 2000);   
    loginRedirectStore.setRedirectFrom(null)
    toast.success('Logging out...', {
      position: 'bottom-right',
      autoClose: 1000,       
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true
    })
  } catch (error) {
    const toastErrorMessage = "Logout Error: " + error
    console.error(toastErrorMessage);
    toast.error(toastErrorMessage, {
      position: 'top-right',
      autoClose: 7000,       
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
  }
};

watchEffect(() => {
  const currentPath = router.currentRoute.value.path;
  if (isAuthChecked.value && !token.value && !currentUser.value && currentPath !== '/login' && !currentPath.startsWith('/action')) {
    router.push('/login');
  }
});
</script>

<template >

  <div  v-if="isAuthChecked" class="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
    <!-- Navbar renders only if user is authenticated  -->
    <template v-if="currentUser">
      <nav class="bg-red-500/90">
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
                <svg class="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="flex flex-1 gap-24 items-center justify-center sm:items-stretch sm:justify-start">
              <div class="flex shrink-0 items-center">
                <p class="text-white">Find Users App</p>
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4">
                  <NuxtLink to="/" class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Home</NuxtLink>
                  <NuxtLink to="/users-list" class="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700">Users list</NuxtLink>
                  <NuxtLink to="/favourites" class="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700">Favourites</NuxtLink>
                </div>
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button type="button" class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">View notifications</span>
                <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
              </button>
              <!-- Profile dropdown -->
              <div class="relative ml-3">
                <div>
                  <button type="button" class="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <span class="absolute -inset-1.5"></span>
                    <span class="sr-only">Open user menu</span>
                    <img class="size-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="">
                  </button>
                </div>        
                <div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                  <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</NuxtLink>
                  <NuxtLink to="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</NuxtLink>
                  <NuxtLink @click="logout" class="block px-4 py-2 text-sm text-gray-700 cursor-pointer" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Mobile menu, show/hide based on menu state. -->
        <div class="sm:hidden" id="mobile-menu">
          <div class="space-y-1 px-2 pt-2 pb-3">
            <NuxtLink to="/" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Home</NuxtLink>
            <NuxtLink to="/users-list" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Users list</NuxtLink>
            <NuxtLink to="/favourites" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Favourites</NuxtLink>
          </div>
        </div>
      </nav>  
    </template>
    <!-- Main page content -->
    <div class="flex flex-1 flex-col items-center">
      <div v-if="!currentUser" class="max-w-[90vw] max-h-[10vh] absolute inset-y-0 top-[5vh] flex flex-col items-center justify-center">
        <h1 class="p-2 text-amber-400 text-3xl sm:text-4xl lg:text-5xl font-bold bg-neutral-900/10 pointer-events-none text-center">Find Users App</h1>
      </div>
      <NuxtPage/>
    </div>
    <!-- Footer only if user is authenticated -->
    <template v-if="currentUser">
      <Footer />
    </template>  
  </div>

  <template v-else>
    <div class="flex flex-col items-center justify-center h-screen w-screen bg-gray-900">
      <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </template>  

</template>