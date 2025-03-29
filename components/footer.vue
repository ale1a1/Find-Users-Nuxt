<script setup lang="ts">
import { ref } from "vue";
import { Instagram, Linkedin, Github, Youtube, Twitch } from "lucide-vue-next";

const socialLinks = ref([
  { icon: Instagram, link: "https://instagram.com" },
  { icon: Linkedin, link: "https://linkedin.com/in/alessandro-ladu-69196a239" },
  { icon: Github, link: "https://github.com/ale1a1" },
  { icon: Youtube, link: "https://youtube.com" },
  { icon: Twitch, link: "https://twitch.tv" },
]);
</script>

<template>
  <footer class="border-t-2 border-amber-400/40 py-4 bg-neutral-950 text-gray-400 w-full">
    <div class="w-full flex flex-col sm:flex-row justify-between items-center px-2 sm:px-6 lg:ps-8 lg:pe-9 space-y-6 sm:space-y-0">
      
      <!-- Left Side: Copyright -->
      <p class="sm:text-sm cursor-default">© {{ new Date().getFullYear() }} ALW Media</p>

      <!-- Right Side: Social Icons -->
      <div class="flex space-x-8 sm:space-x-6">
        <a
          v-for="(item, index) in socialLinks"
          :key="index"
          :href="item.link"
          target="_blank"
          class="hover:text-white transition-colors"
        >
          <component :is="item.icon" class=" size-8 sm:size-6" />
        </a>
      </div>

    </div>
  </footer>
</template>



