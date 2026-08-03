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
                       border border-white/20 bg-gradient-to-b from-neutral-900 to-neutral-950
                       shadow-[0_8px_30px_rgba(0,0,0,0.6)] ring-1 ring-black/50
                       transition-all duration-300 h-full
                       hover:-translate-y-1.5 hover:border-amber-400/70
                       hover:shadow-[0_0_40px_-8px_rgba(251,191,36,0.5)]"
              >
                <!-- Top accent line -->
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-amber-400 transition-all duration-500 group-hover:w-2/3"></div>

                <!-- Corner glow accent -->
                <div class="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-amber-400/0 blur-2xl transition-colors duration-500 group-hover:bg-amber-400/25"></div>

                <div class="relative flex items-center justify-center size-12 sm:size-14 rounded-xl bg-gradient-to-br from-amber-400/15 to-amber-400/5 ring-1 ring-amber-400/30
                            group-hover:ring-amber-400/70 group-hover:from-amber-400/25 transition-all duration-300 group-hover:rotate-3">
                  <component
                    :is="f.icon"
                    class="size-5 sm:size-6 text-amber-400 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div class="relative flex flex-col items-center gap-1 text-center">
                  <span class="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">{{ f.label }}</span>
                  <span class="font-condensed text-xl sm:text-2xl lg:text-3xl font-semibold text-amber-300 uppercase tracking-wide drop-shadow-lg">{{ f.highlight }}</span>
                </div>

                <div class="relative mt-1 flex items-center gap-1 text-[11px] uppercase tracking-widest text-white/0 group-hover:text-amber-400/80 transition-all duration-300">
                  <span>Explore</span>
                  <ArrowUpRight class="size-3.5 -translate-x-1 group-hover:translate-x-0 transition-transform duration-300" />
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
