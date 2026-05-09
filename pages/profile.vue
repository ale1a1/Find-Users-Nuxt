<script setup lang="ts">
import UserDetails from '~/components/userDetails.vue';
const showContent = ref(false);

onMounted(() => {
  setTimeout(() => {
    showContent.value = true;
  }, 300); 
});
</script>

<template>
  <div v-if="showContent" class="flex flex-col w-full gap-6 lg:gap-16">
    <div class="flex flex-col items-center mt-8 mb-2 gap-2">
      <h1 class="text-white text-2xl sm:text-3xl font-bold tracking-widest uppercase">Profile</h1>
      <div class="w-12 h-[2px] bg-amber-400/70 rounded-full"></div>
    </div>
    <UserDetails />   
  </div>
  <template v-else>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"> </div>
    </div>
  </template>
</template>