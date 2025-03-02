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
  <footer class="border-t border-gray-300/80 py-4 bg-black text-gray-400 w-full">
    <div class="w-full flex justify-between items-center px-2 sm:px-6 lg:px-8">
      
      <!-- Left Side: Copyright -->
      <p class="text-sm">© {{ new Date().getFullYear() }} ALW Media</p>

      <!-- Right Side: Social Icons -->
      <div class="flex space-x-6">
        <a
          v-for="(item, index) in socialLinks"
          :key="index"
          :href="item.link"
          target="_blank"
          class="hover:text-white transition-colors"
        >
          <component :is="item.icon" class="size-6" />
        </a>
      </div>

    </div>
  </footer>
</template>



