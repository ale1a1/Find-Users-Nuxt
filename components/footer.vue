<script setup lang="ts">
import { ref } from "vue";
import { Instagram, Linkedin, Github, Youtube, Twitter, Twitch } from "lucide-vue-next";

const socialLinks = ref([
  { icon: Instagram, link: "https://instagram.com" },
  { icon: Linkedin, link: "https://linkedin.com" },
  { icon: Github, link: "https://github.com" },
  { icon: Youtube, link: "https://youtube.com" },
  { icon: Twitter, link: "https://twitter.com" },
  { icon: Twitch, link: "https://twitch.tv" },
]);
</script>

<template>
  <footer class="border-t border-gray-300/80 py-4 px-6 bg-black text-gray-400">
    <div class="container mx-auto flex flex-col md:flex-row items-center justify-between">
      
      <!-- Left Side: Copyright -->
      <p class="text-sm mb-2 md:mb-0">© {{ new Date().getFullYear() }} ALW Media</p>

      <!-- Right Side: Social Icons -->
      <div class="flex space-x-4">
        <a
          v-for="(item, index) in socialLinks"
          :key="index"
          :href="item.link"
          target="_blank"
          class="hover:text-white"
        >
          <component :is="item.icon" class="size-6" />
        </a>
      </div>

    </div>
  </footer>
</template>