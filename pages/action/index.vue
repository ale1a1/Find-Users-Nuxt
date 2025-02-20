<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import LoadingSpinner from '~/components/loading-spinner.vue';

const route = useRoute();
const router = useRouter();

// Extract query parameters from the URL
const mode = route.query.mode as string;
const oobCode = route.query.oobCode as string;
const apiKey = route.query.apiKey as string;

// Redirect based on the mode
if (mode === 'resetPassword') {
  router.replace(`/action/reset-password?oobCode=${oobCode}&apiKey=${apiKey}`);
} else if (mode === 'verifyEmail') {
  router.replace(`/action/email-verified?oobCode=${oobCode}&apiKey=${apiKey}`);
} else {
  console.error('Unknown action mode:', mode);
  router.replace('/'); // Redirect to home or error page
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <LoadingSpinner />
  </div>
</template>

