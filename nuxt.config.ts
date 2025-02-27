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

      // TO MAKE IT WORK LOCALLY COPY THE VARIABLE FROM .ENV FILE AND COMMENT OUT THE ONES BELOW
      // ADD THIS FILE TO GITIGNORE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  
      // firebaseApiKey: process.env.FIREBASE_API_KEY,
      // firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      // firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      // firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      // firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      // firebaseAppId: process.env.FIREBASE_APP_ID,
      // firebaseMeasurementId: process.env.FIREBASE_MEASRAMENT_ID,
      // imgurKey: process.env.FIREBASE_IMGUR_KEY,

      // TO MAKE IT WORK ON PRODUCTION (NETLIFY DEPLOYMENT) REMOVE THE VARIABLE BELOW, REMOVE THIS FILE FROM GIT IGNORE, AND USE THE process.env to call variables from .env file
      firebaseApiKey: "AIzaSyCOH5cLmatBdW6XdCBvmxv_dWQvLe5qqY8",
      firebaseAuthDomain: "find-users-app-30e24.firebaseapp.com",
      firebaseProjectId: "find-users-app-30e24",
      firebaseStorageBucket: "find-users-app-30e24.firebasestorage.app",
      firebaseMessagingSenderId: "556253103651",
      firebaseAppId: "1:556253103651:web:2f112ed545e62275b91396",
      firebaseMeasurementId: "G-6VTJ5N5QQ0",
      imgurKey: "56f415c0bdf60ec"
    }
  }
})
