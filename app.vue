<script setup lang="ts">
import { useRouter } from 'vue-router';
import { watchEffect } from 'vue';
import { useHead } from '#imports'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from 'vue3-toastify'
import { useLoginRedirectStore } from '@/stores/loginRedirect';
import backgroundImage from '~/assets/images/keyboard bg - 2.jpg';
import { useUserStore } from './stores/userStore';
import { doc, getDoc, type DocumentData, type Firestore } from 'firebase/firestore';
import Footer from './components/footer.vue';
import { User } from "lucide-vue-next";
import { useRoute } from 'vue-router';

interface ProfilePicture {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
  text: {};
}

interface UserVisibleDetails {
  name: string;
  profession: string;
  country: string;
  email: string;
  openedToWork: boolean;
  profilePicture: ProfilePicture | null;
  profilePictureUrl: string | null;
}

const router = useRouter();
const route = useRoute();
const auth = useNuxtApp().$auth;
const { $db } = useNuxtApp();
const userData = ref<DocumentData | null>(null); 
const userStore = useUserStore();
const loginRedirectStore = useLoginRedirectStore();
const isAuthChecked = ref(false);
const currentUser = ref();
const userVisibleDetails = ref<UserVisibleDetails | null>(null);
const token = ref(userStore.token);
const isProfileMenuOpen = ref(false);
const isMobileNavMenuOpen = ref(false);


onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    const token = sessionStorage.getItem('find-users-Token') ? sessionStorage.getItem('find-users-Token') : userStore.token;
    if (user?.emailVerified && token) {
      getProfileData(user)
      currentUser.value = user;
    } else {
      console.log("No user signed in");
    }
    isAuthChecked.value = true;
  });
});

useHead({
  htmlAttrs: {
    class: 'h-full bg-gray-100'
  },
  bodyAttrs: {
    class: 'h-full'
  }
})

const getProfileData = async (user: any) => {
  if (!user) {
    console.error("User not logged in!");
    return;
  }
  try {
    const db = $db as Firestore;
    const docRef = doc(db, "UsersProfileDetails", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      userData.value = docSnap.data();      
      userStore.setVisibleDetails({
        name: userData.value.name || '', 
        profession: userData.value.profession || '', 
        country: userData.value.country || '', 
        email: userData.value.email || '', 
        openedToWork: userData.value.openedToWork ?? false, 
        profilePicture: userData.value.profilePicture || null, 
        profilePictureUrl: userData.value.profilePictureUrl || null, 
      });
      return userData;
    } else {
      console.error("No user data found for the logged-in user.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

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

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

// const toggleMobileNavMenu = () => {
//   isMobileNavMenuOpen.value = !isMobileNavMenuOpen.value;
// };

watch(() => userStore.token, (token) => {
  console.log("Token value changed:", token);
  onAuthStateChanged(auth, (user) => {
    const token = sessionStorage.getItem('find-users-Token') ? sessionStorage.getItem('find-users-Token') : userStore.token;
    if (user?.emailVerified && token) {
      getProfileData(user)
      currentUser.value = user;
    } else {
      console.log("No user signed in");
    }
    isAuthChecked.value = true;
  });
});

watch(() => userStore.currentUser, (user) => {
  currentUser.value = user
});

watch(() => userStore.userVisibleDetails, (newDetails) => {
  userVisibleDetails.value = newDetails
}); 

watchEffect(() => {
  if (userStore.userVisibleDetails) {
    userVisibleDetails.value = userStore.userVisibleDetails;
  }
});

watchEffect(() => {
  const currentPath = router.currentRoute.value.path;
  if (isAuthChecked.value && !token.value && !currentUser.value && currentPath !== '/login' && !currentPath.startsWith('/action')) {
    router.push('/login');
  }
});

const isMenuRecentlyOpened = ref(false);

const toggleMobileNavMenu = (event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // If opening the menu, set a short delay before `v-click-outside` can close it
  if (!isMobileNavMenuOpen.value) {
    isMenuRecentlyOpened.value = true;
    setTimeout(() => {
      isMenuRecentlyOpened.value = false;
    }, 300); // Adjust timing if necessary
  }

  isMobileNavMenuOpen.value = !isMobileNavMenuOpen.value;
};
</script>

<template >

  <div  v-if="isAuthChecked" class="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
    <!-- Navbar renders only if user is authenticated  -->
    <template v-if="currentUser">
      <nav class="z-20 bg-amber-400/60 border-b-2 border-gray-400/80">
        <div class="px-2 sm:px-6 lg:px-8">
          <div class="relative flex h-12 items-center justify-between">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <!-- Mobile menu button-->
              <div @click="!isMobileNavMenuOpen ? isMobileNavMenuOpen = true : null" type="button" class="cursor-pointer relative inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset" aria-controls="mobile-menu" aria-expanded="false">
                <span class="absolute -inset-0.5"></span>
                <span class="sr-only">Open main menu</span>      
                <svg v-if="!isMobileNavMenuOpen" class="block size-7" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>         
                <svg v-else class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div class="flex flex-1 gap-24 items-center justify-center sm:items-stretch sm:justify-start">
              <div class="flex shrink-0 items-center cursor-default">
                <p class="text-white text-lg">Find Users App</p>
              </div>
              <div class="hidden sm:ml-6 sm:block">
                <div class="flex space-x-4">
                  <NuxtLink to="/" class="rounded-md px-3 py-2 text-sm font-medium" aria-current="page" :class="route.path === '/' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'">Home</NuxtLink>
                  <NuxtLink to="/users-list" class="rounded-md px-3 py-2 text-sm font-medium" :class="route.path === '/users-list' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'">Users list</NuxtLink>
                  <NuxtLink to="/favourites" class="rounded-md px-3 py-2 text-sm font-medium" :class="route.path === '/favourites' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'">Favorites</NuxtLink>
                </div>
              </div>
            </div>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <!--
              <button type="button" class="cursor-pointer relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">View notifications</span>
                <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
              </button>
              -->
              <!-- Profile dropdown -->
              <div class="relative ml-3">
                <div>
                  <button @click="toggleProfileMenu" type="button" class="relative flex rounded-full bg-gray-800 border border-neutral-800 text-sm focus:ring focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden cursor-pointer" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <span class="absolute -inset-1.5"></span>
                    <span class="sr-only">Open user menu</span>
                    <template v-if="!userData?.profilePictureUrl || !userVisibleDetails?.profilePictureUrl">
                      <User class="size-8 text-gray-400" />
                    </template>
                    <img v-else class="size-8 rounded-full" :src="userVisibleDetails?.profilePictureUrl || userData?.profilePictureUrl" alt="">
                  </button>
                </div>        
                <div v-if="isProfileMenuOpen" v-click-outside="toggleProfileMenu" class="bg-amber-400/60 border-2 border-gray-400/80  border-t-2  border-t-amber-500/10 absolute right-0 z-10 mt-2 w-30 origin-top-right rounded-md py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                  <NuxtLink @click="toggleProfileMenu" to="/profile" class="block px-4 py-2 text-sm text-gray-200 hover:underline hover:text-gray-800 hover:font-bold" role="menuitem" tabindex="-1" id="user-menu-item-0">Profile</NuxtLink>
                  <!-- <NuxtLink to="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">Settings</NuxtLink> -->
                  <NuxtLink  @click="() => { logout(); toggleProfileMenu(); }" class="block px-4 py-2 text-sm text-gray-200 cursor-pointer hover:underline hover:text-gray-800 hover:font-bold" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Mobile menu, show/hide based on menu state. -->
        <div   v-click-outside="() => { if (!isMenuRecentlyOpened) isMobileNavMenuOpen = false }"  v-if="isMobileNavMenuOpen" class="sm:hidden" id="mobile-menu">
          <div class="space-y-1 px-2 pt-2 pb-3">
            <NuxtLink @click="toggleMobileNavMenu" to="/" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300" aria-current="page">Home</NuxtLink>
            <NuxtLink @click="toggleMobileNavMenu" to="/users-list" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Users list</NuxtLink>
            <NuxtLink @click="toggleMobileNavMenu" to="/favourites" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Favourites</NuxtLink>
          </div>
        </div>
      </nav>  
    </template>
    <!-- Main page content -->
    <div class="flex flex-1 flex-col items-center">      
      <div v-if="!currentUser" class="max-w-[90vw] max-h-[10vh] absolute inset-y-0 top-[6.5vh] flex flex-col items-center justify-center">
        <h1 
          class="p-2 text-white tracking-widest uppercase relative text-4xl md:text-5xl lg:text-7xl font-bold text-center pointer-events-none
                animate-pulse before:absolute before:-inset-1 before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:blur-md before:opacity-30 before:-z-10">
          Find Users App
        </h1>
      </div>  
      <NuxtPage/>
    </div>
    <!-- Footer only if user is authenticated -->
    <template v-if="currentUser">
      <Footer class="z-20" />
    </template>  
  </div>

  <template v-else>
    <div class="flex flex-col items-center justify-center h-screen w-screen bg-neutral-950">
      <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </template>  

</template>