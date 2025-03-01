// import { defineNuxtPlugin } from '#app';
// import { initializeApp } from 'firebase/app';
// import { getAuth, type Auth } from 'firebase/auth';
// import { Firestore, getFirestore } from 'firebase/firestore';

// export default defineNuxtPlugin((nuxtApp) => {
//   const firebaseConfig = {
//     apiKey: nuxtApp.$config.public.firebaseApiKey,
//     authDomain: nuxtApp.$config.public.firebaseAuthDomain,
//     projectId: nuxtApp.$config.public.firebaseProjectId,
//     storageBucket: nuxtApp.$config.public.firebaseStorageBucket,
//     messagingSenderId: nuxtApp.$config.public.firebaseMessagingSenderId,
//     appId: nuxtApp.$config.public.firebaseAppId,
//     measurementId: nuxtApp.$config.public.firebaseMeasurementId,
//   };

//   try {
//     // Initialize Firebase
//     const app = initializeApp(firebaseConfig);
//     const auth: Auth = getAuth(app);
//     const db: Firestore = getFirestore(app);
//     // Make auth and db available in the Nuxt app
//     nuxtApp.provide('auth', auth);
//     nuxtApp.provide('db', db);
//   } catch (error) {
//     console.error('Error initializing Firebase:', error);
//   }
// });




import { defineNuxtPlugin } from '#app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

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
  // const db = getFirestore(app);
  const db: Firestore = getFirestore(app);

  // Make auth and db available in the Nuxt app
  nuxtApp.provide('auth', auth);
  nuxtApp.provide('db', db);



});