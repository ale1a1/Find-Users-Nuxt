<script setup lang="ts">
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from 'vue3-toastify';

interface UserDetails {
  id?: string; 
  name: string;
  profession: string;
  country: string;
  email: string;
  profilePicture?: string;
  openToWork?: boolean;
  flag?: string;
}

interface Country {
  name: string;
  alpha3Code: string;
  flag: string;
}

const showContent = ref(false);
const countries = ref<Country[]>([]);
const users = ref<UserDetails[]>([]);
 
const fetchCountries = async () => {
  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images");
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }
    const { data } = await response.json();
    countries.value = data
      .map((country: any) => ({
        name: country.name,
        alpha3Code: country.iso3,
        flag: country.flag,
      }))
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

const hardCodedusers = [
  { name: 'John Doe', profession: 'Software Engineer', country: 'United States', email: 'john@example.com', profilePicture: 'https://randomuser.me/api/portraits/men/8.jpg', openedToWork: true },
  { name: 'Jane Smith', profession: 'Product Designer', country: 'United Kingdom', email: 'jane@example.com', profilePicture: '', openedToWork: false },
  { name: 'Alice Johnson Mega Long Name Mega Long Name Mega Long Name Mega Long Name Mega Long Name Mega Long Name Mega Long Name Mega Long Name Mega Long Name', profession: 'Data Scientist', country: 'Canada', email: 'alice@example.com', profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg', openedToWork: true },
  { name: 'Bob Brown', profession: 'DevOps Engineer', country: 'Germany', email: 'bob@example.com', profilePicture: '', openedToWork: false },
  { name: 'Charlie White', profession: 'UX Researcher', country: 'France', email: 'charlie@example.com', profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg', openedToWork: true },
  { name: 'David Black', profession: 'Backend Developer', country: 'India', email: 'david@example.com', profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg', openedToWork: false },
  { name: 'Eva Green', profession: 'Frontend Developer', country: 'Italy', email: 'eva@example.com', profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg', openedToWork: true },
  { name: 'Frank Blue', profession: 'Machine Learning Engineer', country: 'Spain', email: 'frank@example.com', profilePicture: '', openedToWork: false },
  { name: 'Grace Red', profession: 'Full Stack Developer', country: 'Brazil', email: 'grace@example.com', profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg', openedToWork: true },
  { name: 'Henry Gold', profession: 'Cybersecurity Analyst', country: 'Netherlands', email: 'henry@example.com', profilePicture: '', openedToWork: false },
  { name: 'Ivy Silver', profession: 'Cloud Engineer', country: 'Australia', email: 'ivy@example.com', profilePicture: 'https://randomuser.me/api/portraits/women/5.jpg', openedToWork: true },
  { name: 'Jack Copper', profession: 'Blockchain Developer', country: 'Sweden', email: 'jack@example.com', profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg', openedToWork: false },
  { name: 'Karen Bronze', profession: 'AI Researcher', country: 'Japan', email: 'karen@example.com', profilePicture: 'https://randomuser.me/api/portraits/women/6.jpg', openedToWork: true },
  { name: 'Leo Iron', profession: 'Embedded Systems Engineer', country: 'China', email: 'leo@example.com', profilePicture: '', openedToWork: false },
  { name: 'Mia Steel', profession: 'Game Developer', country: 'South Korea', email: 'mia@example.com', profilePicture: 'https://randomuser.me/api/portraits/women/7.jpg', openedToWork: true },
];

const fetchAllUsers = (): Promise<void> => new Promise((resolve) => {
  const auth = getAuth();
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    unsubscribe();
    if (!user) {
      console.error("User not logged in!");
      resolve();
      return;
    }
    try {
      const db = getFirestore();
      const usersCollection = collection(db, "UsersProfileDetails");
      const querySnapshot = await getDocs(usersCollection);
      const fetchedUsers: any = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() } as UserDetails);
      });
      users.value = fetchedUsers.map((user: any) => ({
        name: user.name,
        profession: user.profession,
        country: user.country,
        email: user.email,
        profilePicture: user.profilePictureUrl,
        openedToWork: user.openedToWork,
      }));
      users.value = [...users.value, ...hardCodedusers];
      users.value = users.value.map((user) => {
        const countryMatch = countries.value.find(
          (c) => c.name.toLowerCase() === user.country.toLowerCase()
        );
        return {
          ...user,
          flag: countryMatch?.flag || "",
        };
      });
    } catch (error) {
      toast.error('Error fetching all users.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false
      });
      console.error("Error fetching all users:", error);
    }
    resolve();
  });
});

onMounted(async () => {
  await fetchCountries()
  await fetchAllUsers()
  showContent.value = true  
});
</script>

<template>
  <div v-if="showContent" class="flex flex-col w-full mb-8">
    <div class="flex flex-col items-center mt-8 mb-2 gap-2">
      <h1 class="text-white text-2xl sm:text-3xl font-bold tracking-widest uppercase">Users List</h1>
      <div class="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
    </div>
    <UsersTable :users="users"/>
  </div>
  <template v-else>
    <div class="absolute inset-0 flex flex-col items-center justify-center" role="status" aria-live="polite" aria-label="Loading users">
      <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </template>
</template>