<script setup lang="ts">
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from 'vue3-toastify';

interface UserDetails {
  id: string; 
  name: string;
  profession: string;
  country: string;
  email: string;
  profilePicture: string;
  openToWork: boolean;
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
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }
    const data = await response.json();
    countries.value = data
      .map((country: any) => ({
        name: country.name.common,
        alpha3Code: country.cca3,
        flag: country.flags.svg,
      }))
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
      console.log(countries.value)
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

const fetchAllUsers = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    console.error("User not logged in!");
    return;
  }
  try {
    const db = getFirestore();
    const usersCollection = collection(db, "UsersProfileDetails");
    const querySnapshot = await getDocs(usersCollection);
    const fetchedUsers: UserDetails[] = []; 
    querySnapshot.forEach((doc) => {
      fetchedUsers.push({ id: doc.id, ...doc.data() } as UserDetails); 
    });   
    users.value = [...fetchedUsers, ...hardCodedusers];
    // Now map the users to include country flags
    users.value = users.value.map((user) => {
      const countryMatch = countries.value.find(
        (c) => c.name.toLowerCase() === user.country.toLowerCase()
      );
      return {
        ...user,
        flag: countryMatch?.flag || "", // Add flag if country is found, else leave empty string
      };
    });
  } catch (error) {
    toast.error('Error fetching all users.', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
    console.error("Error fetching all users:", error);
  }
};

onMounted(async () => {
  await fetchCountries()
  await fetchAllUsers()
  showContent.value = true  
});
</script>

<template>
  <div v-if="showContent" class="flex flex-col w-full gap-16">
    <div class="flex justify-center mt-12">
      <h1 class="text-amber-400 text-4xl font-bold">USERS LIST</h1>
    </div>
    <UsersTable :users="users"/>
  </div>
  <template v-else>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <div class="w-16 h-16 border-6 border-amber-400 border-t-transparent rounded-full animate-spin"> </div>
    </div>
  </template>
</template>