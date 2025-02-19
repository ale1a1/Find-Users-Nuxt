// nuxt.d.ts
import { Auth } from 'firebase/auth';
import { NuxtApp } from 'nuxt/app';

declare module 'nuxt/app' {
  interface NuxtApp {
    $auth: Auth; 
  }
}
