<script setup lang="ts">
import Login from '~/components/login.vue';
import { useLoginRedirectStore } from '@/stores/loginRedirect';

const loginRedirectStore = useLoginRedirectStore();

onMounted(() => {
  loginRedirectStore.setRedirectFrom('email-verified')
})
</script>

<template>  
  <Login />
</template>