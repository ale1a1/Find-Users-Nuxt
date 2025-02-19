import tailwindcss from "@tailwindcss/vite";
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
      firebaseApiKey: "AIzaSyDue5AxOsRxQT9wUO1V2hQ52BBZnDFc5yI",
      firebaseAuthDomain: "find-users-40740.firebaseapp.com",
      firebaseProjectId: "find-users-40740",
      firebaseStorageBucket: "find-users-40740.firebasestorage.app",
      firebaseMessagingSenderId: "930002321451",
      firebaseAppId: "1:930002321451:web:710c024a69623911512a6e",
      firebaseMeasurementId: "G-N14HDDSK8K"
    }
  }
})
