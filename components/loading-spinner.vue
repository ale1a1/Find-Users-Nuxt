<script setup lang="ts">
  const props = defineProps<{
    message: string; 
  }>();
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen w-screen">
    <p class="mb-3 text-gray-600 text-lg">{{ message }}</p>
    <div class="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
</template>
