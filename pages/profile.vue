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
    <div class="flex justify-center mt-12">
      <h1 class="text-gray-200 text-4xl font-bold ">PROFILE</h1>
    </div>
    <UserDetails />   
  </div>
  <template v-else>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"> </div>
    </div>
  </template>
</template>