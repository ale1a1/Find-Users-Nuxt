export interface FirebaseUser {
  // Properties directly from Firebase's User object
  emailVerified: boolean;
  isAnonymous: boolean;
  providerData: ProviderData[];
  // You can keep these fields optional since Firebase doesn't always provide them
  stsTokenManager?: StsTokenManager;
  createdAt?: string;
  lastLoginAt?: string;
  apiKey?: string;
  appName?: string;
}

export interface ProviderData {
  providerId: string;
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

export interface StsTokenManager {
  refreshToken: string;
  accessToken: string;
  expirationTime: number;
}
