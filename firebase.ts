import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCENAiZMK90S0S6ECFF7ZpwRgHO4dsGe-E",
  authDomain: "find-users-nuxt-fd91e.firebaseapp.com",
  projectId: "find-users-nuxt-fd91e",
  storageBucket: "find-users-nuxt-fd91e.firebasestorage.app",
  messagingSenderId: "324266030114",
  appId: "1:324266030114:web:7883c498d763eb902d467b",
  measurementId: "G-DMB0C6EH03"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
