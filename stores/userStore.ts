import { defineStore } from 'pinia';

type Token = string | null;
interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerData: ProviderData[];
  stsTokenManager: STSTokenManager;
  createdAt: string; 
  lastLoginAt: string; 
  apiKey: string;
  appName: string;
}

interface ProviderData {
  providerId: string;
  uid: string;
  displayName: string | null;
  email: string;
  phoneNumber: string | null;
  photoURL: string | null;
}

interface STSTokenManager {
  refreshToken: string;
  accessToken: string;
  expirationTime: number; 
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    token: null as string | null,
    currentUser: null as User | null,
  }),
  actions: {
    setToken(token: Token) {
      this.token = token;
      if (token) sessionStorage.setItem('find-users-Token', token);      
    },
    clearToken() {
      this.token = null;
      sessionStorage.removeItem('find-users-Token'); 
    },
    setCurrentUser(user: any) {
      this.currentUser = user;
    },
    clearCurrentUser() {
      this.currentUser = null;
    },
  },
});