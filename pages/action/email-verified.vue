<script setup lang="ts">
import Login from '~/components/login.vue';
import { useLoginRedirectStore } from '@/stores/loginRedirect';
import { applyActionCode, reload } from "firebase/auth";

const loginRedirectStore = useLoginRedirectStore();
const auth = useNuxtApp().$auth;

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get('oobCode');
  if (oobCode) {
    try {
      await applyActionCode(auth, oobCode);
      console.log("✅ Email verified!");
      // Reload user state
      if (auth.currentUser) {
       await reload(auth.currentUser);
      }
      // Check if user is verified
      if (auth.currentUser?.emailVerified) {
        console.log("✅ Email verification successful! Redirecting...");
        window.location.href = "/home"; // Redirect after verification
      } else {
         console.log("❌ User not logged in. Please log in manually.");
      }
    } catch (error: any) {
      console.error("❌ Error verifying email:", error.message);
    }
  } else {
    console.error("❌ No oobCode found in URL.");
  }
  loginRedirectStore.setRedirectFrom('email-verified');
})
</script>

<template>  
  <Login />
</template>