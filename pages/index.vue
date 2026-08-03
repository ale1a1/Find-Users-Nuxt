<script setup lang="ts">
import { Search, FileText, Save, User, ArrowUpRight } from "lucide-vue-next";

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
        <div class="w-full max-w-4xl flex flex-col items-center">

          <!-- Title -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-bold text-center tracking-widest uppercase mb-4
                     bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent
                     relative before:absolute before:-inset-1 before:bg-gradient-to-r before:from-transparent before:via-white/40
                     before:to-transparent before:blur-sm before:opacity-30 before:-z-10">
            Find Users App
          </h1>

          <!-- Divider -->
          <div class="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full mb-6"></div>

          <!-- Subtitle -->
          <p class="text-base sm:text-lg lg:text-xl 2xl:text-2xl text-gray-300 text-center leading-relaxed mb-14 max-w-xl px-2">
            A professional tool to discover users, explore their profiles, and build your network.
          </p>

          <!-- Feature cards -->
          <ul class="grid grid-cols-2 gap-4 sm:gap-6 w-full">
            <li
              v-for="(f, i) in features"
              :key="f.highlight"
              class="animate-rise"
              :style="{ animationDelay: `${i * 90}ms` }"
            >
              <NuxtLink
                :to="f.to"
                class="group relative flex flex-col items-center gap-3 p-5 sm:p-7 rounded-2xl overflow-hidden
                       border border-white/15 bg-neutral-950/80 backdrop-blur-md
                       transition-all duration-300 h-full
                       hover:-translate-y-1 hover:border-amber-400/60 hover:bg-neutral-950
                       hover:shadow-[0_0_35px_-8px_rgba(251,191,36,0.45)]"
              >
                <!-- Corner glow accent -->
                <div class="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full bg-amber-400/0 blur-2xl transition-colors duration-500 group-hover:bg-amber-400/20"></div>

                <div class="relative flex items-center justify-center size-11 sm:size-12 rounded-xl bg-amber-400/10 ring-1 ring-amber-400/30
                            group-hover:bg-amber-400/15 group-hover:ring-amber-400/60 transition-all duration-300">
                  <component
                    :is="f.icon"
                    class="size-5 sm:size-6 text-amber-400 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div class="relative flex flex-col items-center gap-1 text-center">
                  <span class="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wider">{{ f.label }}</span>
                  <span class="text-sm sm:text-base lg:text-lg font-bold text-amber-300 tracking-widest drop-shadow-lg">{{ f.highlight }}</span>
                </div>

                <ArrowUpRight class="relative size-4 text-white/0 group-hover:text-amber-400/80 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
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

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-rise {
  animation: rise 0.5s ease both;
}
</style>
