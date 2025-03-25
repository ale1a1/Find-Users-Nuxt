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
      <div class="w-auto p-8 flex flex-col items-center justify-center rounded-lg backdrop-blur-[6px]">    
        <h1 class="text-4xl md:text-5xl lg:text-7xl font-bold text-center 
          mb-[5vh] lg:mb-16 mt-[3vh] lg:mt-10
          text-white tracking-widest uppercase relative 
          animate-pulse before:absolute before:-inset-1 before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:blur-sm before:opacity-40 before:-z-10">
          FIND USERS APP
        </h1>
        <p class="text-2xl lg:text-5xl font-semibold text-center text-gray-200/90 mb-[5vh] lg:mb-20 mt-[5vh] px-6 lg:px-0">A handy app to find users and get in touch with them</p>  
        <ul class="grid grid-cols-2 list-none mt-10 lg:space-x-24 gap-8 lg:gap-0">
          <li class="flex flex-col sm:flex-row items-center gap-4 mb-[3vh] lg:mb-20">
            <NuxtLink to="/profile" class="text-amber-400 transition-transform duration-300 hover:scale-150 hover:opacity-70">
              <User class="size-8" />
            </NuxtLink>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <p v-if="!profile" class="text-lg md:text-xl lg:text-2xl">manage your</p>
              <p v-else class="text-lg md:text-xl lg:text-2xl">update your</p>
              <NuxtLink to="/profile" class="text-amber-400 font-bold hover:opacity-70 text-xl md:text-2xl lg:text-3xl">
               PROFILE
              </NuxtLink>
            </div>
          </li> 
          <li class="flex flex-col sm:flex-row items-center gap-4 mb-[3vh] lg:mb-20">
            <NuxtLink to="/users-list" class="text-amber-400 transition-transform duration-300 hover:scale-150 hover:opacity-70">
              <Search class="size-8" />
            </NuxtLink>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <p class="text-lg md:text-xl lg:text-2xl">check the</p>
              <NuxtLink to="/users-list" class="text-amber-400 font-bold hover:opacity-70 text-xl md:text-2xl lg:text-3xl">
                USERS LIST
              </NuxtLink>
            </div>
          </li>
          <li class="flex flex-col sm:flex-row items-center gap-4 mb-[3vh] lg:mb-20">
            <NuxtLink to="/users-list" class="text-amber-400 transition-transform duration-300 hover:scale-150 hover:opacity-70">
              <FileText class="size-8" />
            </NuxtLink>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <p class="text-lg md:text-xl lg:text-2xl">retrieve</p>
              <NuxtLink to="/users-list" class="text-amber-400 font-bold hover:opacity-70 text-xl md:text-2xl lg:text-3xl">
                INFORMATION
              </NuxtLink>
            </div>
          </li>      
          <li class="flex flex-col sm:flex-row items-center gap-4 mb-[3vh] lg:mb-20">
            <NuxtLink to="/favourites" class="text-amber-400 transition-transform duration-300 hover:scale-150 hover:opacity-70">
              <Save class="size-8" />
            </NuxtLink>
            <div class="flex flex-col sm:flex-row items-center gap-3">
              <p class="text-lg md:text-xl lg:text-2xl">save your</p>
              <NuxtLink to="/favourites" class="text-amber-400 font-bold hover:opacity-70 text-xl md:text-2xl lg:text-3xl">
                FAVORITES 
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





