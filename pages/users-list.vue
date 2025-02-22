<script setup lang="ts">
const showContent = ref(false);

onMounted(() => {
  setTimeout(() => {
    showContent.value = true;
  }, 300); 
});
</script>

<template>
  <div v-if="showContent" class="flex flex-col w-full">
    <div class="flex justify-center mt-[8vh]">
      <h1 class="text-red-900 text-4xl">USER LIST</h1>
    </div>
    <div class="flex-grow flex items-center justify-center">
      <div class="w-[75vw] h-[50vh] border-4 border-red-500 flex items-center justify-center">
        <p class="text-2xl">some content...</p>
      </div>
    </div>
  </div>
  <template v-else>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"> </div>
    </div>
  </template>
</template>