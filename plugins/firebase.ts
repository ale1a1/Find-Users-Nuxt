import { defineNuxtPlugin } from '#app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: nuxtApp.$config.public.firebaseApiKey,
    authDomain: nuxtApp.$config.public.firebaseAuthDomain,
    projectId: nuxtApp.$config.public.firebaseProjectId,
    storageBucket: nuxtApp.$config.public.firebaseStorageBucket,
    messagingSenderId: nuxtApp.$config.public.firebaseMessagingSenderId,
    appId: nuxtApp.$config.public.firebaseAppId,
    measurementId: nuxtApp.$config.public.firebaseMeasurementId,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Make auth and db available in the Nuxt app
  nuxtApp.provide('auth', auth);
  nuxtApp.provide('db', db);
});

