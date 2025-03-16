<script setup lang="ts">
import { Search, FileText, Save, User } from "lucide-vue-next";

const showContent = ref(false);

// TODO: retrieve from somewhere (store? localStorage?cookies as it might get encripted there? whichever is saver)
const profile = null

onMounted(() => {
  setTimeout(() => {
    showContent.value = true;
  }, 300); 
});
</script>

<template>

  <div class="flex flex-col w-full text-white">  

    <div v-if="showContent" class="flex-grow flex items-center justify-center">
      <div class="w-auto min-h-[75vh] h-auto sm:h-[50vh] p-4 flex flex-col items-center justify-center rounded-lg backdrop-blur-[6px]">
        <h1 class="text-6xl font-bold text-white text-center mb-20">Welcome to the Find Users App!</h1>
        <p class="text-5xl font-semibold text-center text-white mb-12">Use our app for</p>  
        <ul class="text-3xl list-none mb-8 space-y-8">
        <li class="flex items-center gap-4">
          <NuxtLink to="/users" class="text-amber-400 transition-transform duration-300 hover:scale-150 hover:opacity-70">
            <User class="size-8" />
          </NuxtLink>
          <div class="flex items-center gap-3">
            <p v-if="!profile" class="text-base sm:text-lg md:text-xl lg:text-2xl">managing</p>
            <p v-else class="text-base sm:text-lg md:text-xl lg:text-2xl">update</p>
            <NuxtLink to="/users" class="text-amber-400 font-bold hover:opacity-70">
              YOUR PROFILE
            </NuxtLink>
          </div>
        </li> 
        <li class="flex items-center gap-4">
          <NuxtLink to="/users" class="text-amber-400 transition-transform duration-300 hover:scale-150 hover:opacity-70">
            <Search class="size-8" />
          </NuxtLink>
          <div class="flex items-center gap-3">
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl">searching users from the</p>
            <NuxtLink to="/users" class="text-amber-400 font-bold hover:opacity-70">
              USERS LIST
            </NuxtLink>
          </div>
        </li>
        <li class="flex items-center gap-4">
          <NuxtLink to="/users" class="text-amber-400 transition-transform duration-300 hover:scale-150 hover:opacity-70">
            <FileText class="size-8" />
          </NuxtLink>
          <div class="flex items-center gap-3">
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl">retrieving</p>
            <NuxtLink to="/users" class="text-amber-400 font-bold hover:opacity-70">
              USERS INFORMATION
            </NuxtLink>
          </div>
        </li>      
        <li class="flex items-center gap-4">
          <NuxtLink to="/users" class="text-amber-400 transition-transform duration-300 hover:scale-150 hover:opacity-70">
            <Save class="size-8" />
          </NuxtLink>
          <div class="flex items-center gap-3">
            <p class="text-base sm:text-lg md:text-xl lg:text-2xl">saving your</p>
            <NuxtLink to="/users" class="text-amber-400 font-bold hover:opacity-70">
              FAVOURITE USERS
            </NuxtLink>
          </div>
        </li>     
      </ul>  
      </div>
    </div>  
    <template v-else>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"> </div>
      </div>
    </template>

  </div>
</template>





