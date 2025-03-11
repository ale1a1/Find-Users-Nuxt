<script setup lang="ts">
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

interface UserDetails {
  id: string; 
  name: string;
  profession: string;
  country: string;
  email: string;
  profilePicture: string;
  openToWork: boolean;
}

const showContent = ref(false);

const users = ref([
  { name: 'John Doe', profession: 'Software Engineer', country: 'USA', email: 'john@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: true },
  { name: 'Jane Smith', profession: 'Product Designer', country: 'UK', email: 'jane@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: false },
  { name: 'Alice Johnson Mega Long Name Mega Long Name Mega Long Name Mega Long Name Mega Long Name Mega Long Name Mega Long Name Mega Long Name Mega Long Name', profession: 'Data Scientist', country: 'Canada', email: 'alice@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: true },
  { name: 'Bob Brown', profession: 'DevOps Engineer', country: 'Germany', email: 'bob@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: false },
  { name: 'Charlie White', profession: 'UX Researcher', country: 'France', email: 'charlie@example.com', profilePicture: 'https://via.placeholder.com/40', opeedToWork: true },
  { name: 'David Black', profession: 'Backend Developer', country: 'India', email: 'david@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: false },
  { name: 'Eva Green', profession: 'Frontend Developer', country: 'Italy', email: 'eva@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: true },
  { name: 'Frank Blue', profession: 'Machine Learning Engineer', country: 'Spain', email: 'frank@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: false },
  { name: 'Grace Red', profession: 'Full Stack Developer', country: 'Brazil', email: 'grace@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: true },
  { name: 'Henry Gold', profession: 'Cybersecurity Analyst', country: 'Netherlands', email: 'henry@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: false },
  { name: 'Ivy Silver', profession: 'Cloud Engineer', country: 'Australia', email: 'ivy@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: true },
  { name: 'Jack Copper', profession: 'Blockchain Developer', country: 'Sweden', email: 'jack@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: false },
  { name: 'Karen Bronze', profession: 'AI Researcher', country: 'Japan', email: 'karen@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: true },
  { name: 'Leo Iron', profession: 'Embedded Systems Engineer', country: 'China', email: 'leo@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: false },
  { name: 'Mia Steel', profession: 'Game Developer', country: 'South Korea', email: 'mia@example.com', profilePicture: 'https://via.placeholder.com/40', openedToWork: true },
]);

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
    users.value = [...fetchedUsers, ...users.value];
  } catch (error) {
    console.error("Error fetching all users:", error);
  }
};

onMounted(() => {
  setTimeout(() => {
    showContent.value = true;
  }, 300); 
  fetchAllUsers()
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