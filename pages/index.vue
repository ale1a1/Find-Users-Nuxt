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
      <div class="w-auto px-5 py-6 sm:p-8 flex flex-col items-center justify-center rounded-lg backdrop-blur-[6px]">
        <h1 class="text-3xl sm:text-4xl 2xl:text-7xl font-bold text-center
          mb-[4vh] 2xl:mb-16 mt-[2vh] xl:mt-[1.5vh] 2xl:mt-16
          text-white tracking-widest uppercase relative
          animate-pulse before:absolute before:-inset-1 before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:blur-sm before:opacity-40 before:-z-10">
          FIND USERS APP
        </h1>
        <p class="text-lg sm:text-xl md:text-2xl 2xl:text-5xl font-semibold text-center text-gray-200/90 mb-[3vh] md:mb-[4vh] 2xl:mb-20 mt-[3vh] md:mt-[4vh] px-2 sm:px-12 md:px-50 lg:px-0 leading-snug sm:leading-normal">A handy app to find users and get in touch with them</p>
        <ul class="grid grid-cols-2 mt-6 sm:mt-10 gap-6 sm:gap-16 md:gap-20 lg:gap-0 lg:gap-x-14">
          <li class="flex flex-col lg:flex-row items-center gap-3 lg:gap-4 mb-[2vh] lg:mb-20 lg:justify-self-start">
            <NuxtLink to="/profile" class="text-amber-400 transition-transform duration-300 hover:scale-150 hover:opacity-70">
              <User class="size-7 sm:size-8" />
            </NuxtLink>
            <div class="flex flex-col lg:flex-row items-center gap-2 lg:gap-3">
              <p v-if="!profile" class="text-base sm:text-lg md:text-xl lg:text-2xl">manage your</p>
              <p v-else class="text-base sm:text-lg md:text-xl lg:text-2xl">update your</p>
              <NuxtLink to="/profile" class="text-amber-400/90 font-bold hover:opacity-70 text-lg sm:text-xl md:text-2xl lg:text-3xl">
                PROFILE
              </NuxtLink>
            </div>
          </li>
          <li class="flex flex-col lg:flex-row items-center gap-3 lg:gap-4 mb-[2vh] lg:mb-20 lg:justify-self-end">
            <NuxtLink to="/users-list" class="text-amber-400 transition-transform duration-300 hover:scale-150 hover:opacity-70">
              <Search class="size-7 sm:size-8" />
            </NuxtLink>
            <div class="flex flex-col lg:flex-row items-center gap-2 lg:gap-3">
              <p class="text-base sm:text-lg md:text-xl lg:text-2xl">check the</p>
              <NuxtLink to="/users-list" class="text-amber-400/90 font-bold hover:opacity-70 text-lg sm:text-xl md:text-2xl lg:text-3xl">
                USERS LIST
              </NuxtLink>
            </div>
          </li>
          <li class="flex flex-col lg:flex-row items-center gap-3 lg:gap-4 mb-[2vh] lg:mb-20 lg:justify-self-start">
            <NuxtLink to="/users-list" class="text-amber-400/90 transition-transform duration-300 hover:scale-150 hover:opacity-70">
              <FileText class="size-7 sm:size-8" />
            </NuxtLink>
            <div class="flex flex-col lg:flex-row items-center gap-2 lg:gap-3">
              <p class="text-base sm:text-lg md:text-xl lg:text-2xl">retrieve</p>
              <NuxtLink to="/users-list" class="text-amber-400 font-bold hover:opacity-70 text-lg sm:text-xl md:text-2xl lg:text-3xl">
                INFORMATION
              </NuxtLink>
            </div>
          </li>
          <li class="flex flex-col lg:flex-row items-center gap-3 lg:gap-4 mb-[2vh] lg:mb-20 lg:justify-self-end">
            <NuxtLink to="/favourites" class="text-amber-400/90 transition-transform duration-300 hover:scale-150 hover:opacity-70">
              <Save class="size-7 sm:size-8" />
            </NuxtLink>
            <div class="flex flex-col lg:flex-row items-center gap-2 lg:gap-3">
              <p class="text-base sm:text-lg md:text-xl lg:text-2xl">save your</p>
              <NuxtLink to="/favourites" class="text-amber-400 font-bold hover:opacity-70 text-lg sm:text-xl md:text-2xl lg:text-3xl">
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





