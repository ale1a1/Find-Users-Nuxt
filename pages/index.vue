<script setup lang="ts">
import { Search, FileText, Save, User } from "lucide-vue-next";

const showContent = ref(false);

const profile = null

onMounted(() => {
  setTimeout(() => {
    showContent.value = true;
  }, 300);
});

const features = [
  { icon: User,     label: 'manage your', highlight: 'PROFILE',     to: '/profile' },
  { icon: Search,   label: 'check the',   highlight: 'USERS LIST',  to: '/users-list' },
  { icon: FileText, label: 'retrieve',    highlight: 'INFORMATION', to: '/users-list' },
  { icon: Save,     label: 'save your',   highlight: 'FAVORITES',   to: '/favourites' },
]
</script>

<template>
  <div class="flex flex-col w-full text-white">

    <Transition name="fade">
      <div v-if="showContent" class="flex-grow flex items-center justify-center px-4 py-10">
        <div class="w-full max-w-3xl flex flex-col items-center">

          <!-- Title -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-bold text-center tracking-widest uppercase
                     text-white mb-4
                     relative before:absolute before:-inset-1 before:bg-gradient-to-r before:from-transparent before:via-white/40
                     before:to-transparent before:blur-sm before:opacity-30 before:-z-10">
            Find Users App
          </h1>

          <!-- Divider -->
          <div class="w-16 h-[2px] bg-amber-400/70 rounded-full mb-6"></div>

          <!-- Subtitle -->
          <p class="text-base sm:text-lg lg:text-xl 2xl:text-2xl text-gray-300 text-center leading-relaxed mb-12 max-w-xl px-2">
            A professional tool to discover users, explore their profiles, and build your network.
          </p>

          <!-- Feature cards -->
          <ul class="grid grid-cols-2 gap-4 sm:gap-6 w-full">
            <li v-for="f in features" :key="f.highlight">
              <NuxtLink
                :to="f.to"
                class="group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-xl border border-white/70 bg-neutral-900/80 backdrop-blur-md
                       hover:bg-neutral-800/90 hover:border-amber-400/70 transition-all duration-300 h-full"
              >
                <component
                  :is="f.icon"
                  class="size-6 sm:size-7 text-amber-400 group-hover:scale-110 transition-transform duration-300"
                />
                <div class="flex flex-col items-center gap-1 text-center">
                  <span class="text-xs sm:text-sm text-white font-medium uppercase tracking-wider">{{ f.label }}</span>
                  <span class="text-sm sm:text-base lg:text-lg font-bold text-amber-300 tracking-widest drop-shadow-lg">{{ f.highlight }}</span>
                </div>
              </NuxtLink>
            </li>
          </ul>

        </div>
      </div>
    </Transition>

    <template v-if="!showContent">
      <div class="absolute inset-0 flex flex-col items-center justify-center" role="status" aria-live="polite" aria-label="Loading">
        <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </template>

  </div>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
</style>
