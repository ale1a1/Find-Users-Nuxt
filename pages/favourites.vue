<script setup lang="ts">
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, getDocs, query, where } from "firebase/firestore";
import { toast } from 'vue3-toastify';

const showContent = ref(false);
const db = getFirestore();

interface UserDetails {
  flag?: any;
  name: string;
  profession: string;
  country: string;
  email: string;
  profilePicture: string;
  openedToWork: boolean;
  isFavorite?: boolean;
}

const favorites = ref<UserDetails[]>([]);
const auth = getAuth(); 
const user = auth.currentUser; 

onMounted(async () => {  
  if (user) {
    await fetchFavorites(user.uid)
    showContent.value = true  
  }
});

const fetchFavorites = async (loggedInUserId: string) => {
  const favRef = collection(db, 'favorites');
  const q = query(favRef, where('favoritedBy', '==', loggedInUserId)); 
  try {
    const querySnapshot = await getDocs(q);
    const userFavorites = querySnapshot.docs.map(doc => doc.data());
    favorites.value = userFavorites;
  } catch (error) {
    toast.error('Error fetching favorites.', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
    console.error('Error fetching favorites:', error);
  }
};

const handleUpdateFavorites = (email: string) => {
  favorites.value = favorites.value.filter(user => user.email !== email);
};
</script>

<template>
  <div v-if="showContent" class="flex flex-col w-full gap-6 lg:gap-16 mb-8">
    <div class="flex justify-center mt-12">
      <h1 class="text-gray-200 text-4xl font-bold">FAVORITES</h1>
    </div>
    <FavsTable :users="favorites" @updateFavorites="handleUpdateFavorites"/>
  </div>
  <template v-else>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"> </div>
    </div>
  </template>
</template>