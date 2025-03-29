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

interface VisibleDetails {
  name: string;
  profession: string;
  country: string;
  email: string;
  openedToWork: boolean;
  profilePicture: File | null;
  profilePictureUrl: string | null
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    token: null as string | null,
    currentUser: null as User | null,
    userVisibleDetails: null as VisibleDetails | null
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
    setCurrentUser(user: User | any) {
      this.currentUser = user;
    },
    setVisibleDetails(visibleDetails: VisibleDetails) {
      this.userVisibleDetails = visibleDetails;
    },
    clearCurrentUser() {
      this.currentUser = null;
    },
  },
});