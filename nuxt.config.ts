import { defineNuxtConfig } from 'nuxt/config';
import tailwindcss from '@tailwindcss/vite';
require('dotenv').config();
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),      
    ],
  },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {     
      // firebaseApiKey: process.env.FIREBASE_API_KEY,
      // firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      // firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      // firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      // firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      // firebaseAppId: process.env.FIREBASE_APP_ID,
      // firebaseMeasurementId: process.env.FIREBASE_MEASRAMENT_ID,
      // imgurKey: process.env.FIREBASE_IMGUR_KEY,

     


    }
  }
})
