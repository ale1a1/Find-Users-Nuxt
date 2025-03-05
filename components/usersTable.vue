<script setup>
import { ref, computed } from 'vue';

const USERS = ref([
  { name: 'John Doe', profession: 'Software Engineer', country: 'USA', email: 'john@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: true },
  { name: 'Jane Smith', profession: 'Product Designer', country: 'UK', email: 'jane@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: false },
  { name: 'Alice Johnson', profession: 'Data Scientist', country: 'Canada', email: 'alice@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: true },
  { name: 'Bob Brown', profession: 'DevOps Engineer', country: 'Germany', email: 'bob@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: false },
  { name: 'Charlie White', profession: 'UX Researcher', country: 'France', email: 'charlie@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: true },
  { name: 'David Black', profession: 'Backend Developer', country: 'India', email: 'david@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: false },
  { name: 'Eva Green', profession: 'Frontend Developer', country: 'Italy', email: 'eva@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: true },
  { name: 'Frank Blue', profession: 'Machine Learning Engineer', country: 'Spain', email: 'frank@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: false },
  { name: 'Grace Red', profession: 'Full Stack Developer', country: 'Brazil', email: 'grace@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: true },
  { name: 'Henry Gold', profession: 'Cybersecurity Analyst', country: 'Netherlands', email: 'henry@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: false },
  { name: 'Ivy Silver', profession: 'Cloud Engineer', country: 'Australia', email: 'ivy@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: true },
  { name: 'Jack Copper', profession: 'Blockchain Developer', country: 'Sweden', email: 'jack@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: false },
  { name: 'Karen Bronze', profession: 'AI Researcher', country: 'Japan', email: 'karen@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: true },
  { name: 'Leo Iron', profession: 'Embedded Systems Engineer', country: 'China', email: 'leo@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: false },
  { name: 'Mia Steel', profession: 'Game Developer', country: 'South Korea', email: 'mia@example.com', profilePicture: 'https://via.placeholder.com/40', openToWork: true },
]);

const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(USERS.value.length / pageSize));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return USERS.value.slice(start, start + pageSize);
});
</script>

<template>
  <div class="flex flex-col w-full items-center justify-center">
    <div class="sm:mx-auto sm:w-[75vw] p-6 text-gray-100">      
      <div class="overflow-x-auto mt-6">
        <!-- Wrapper div with the amber border -->
        <div class="border border-amber-400 rounded-lg overflow-hidden shadow-lg">
          <table class="w-full bg-neutral-900 rounded-lg table-fixed">
            <thead>
              <tr class="text-gray-300">
                <th class="p-2 text-left w-[20%]">Name</th>
                <th class="p-2 text-left w-[20%]">Profession</th>
                <th class="p-2 text-left w-[15%]">Country</th>
                <th class="p-2 text-left w-[20%]">Email</th>
                <th class="p-2 text-center w-[10%]">Open to Work</th>
                <!-- Removed Actions column header -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.email" class="border-t border-gray-600 hover:bg-gray-700/50">
                <td class="p-3 flex items-center gap-3">
                  <img :src="user.profilePicture" alt="Profile" class="w-10 h-10 rounded-full border border-amber-400" />
                  <span class="text-white truncate">{{ user.name }}</span>
                </td>
                <td class="p-3 text-gray-300 truncate">{{ user.profession }}</td>
                <td class="p-3 text-gray-300 truncate">{{ user.country }}</td>
                <td class="p-3 text-gray-300 truncate">{{ user.email }}</td>
                <td class="p-3 text-center">
                  <span v-if="user.openToWork" class="text-green-500 font-bold">✔</span>
                  <!-- Force red color on the 'X' by ensuring strong red styling -->
                  <span v-else class="text-red-600 font-bold text-xl">✖</span> <!-- Strong red and larger size -->
                </td>
                <td class="p-3 text-center w-[20%]"> <!-- Increased width of Actions column -->
                  <button class="bg-amber-400 text-neutral-900 px-4 py-2 font-bold rounded-md border border-amber-400 hover:bg-amber-400/80">
                    Add to Favourite
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-center items-center gap-4 mt-6">
        <button @click="currentPage--" :disabled="currentPage === 1" class="p-2 rounded-full bg-gray-600 text-gray-300 disabled:opacity-50">
          ⬅
        </button>
        <span class="text-gray-300">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="p-2 rounded-full bg-gray-600 text-gray-300 disabled:opacity-50">
          ➡
        </button>
      </div>
    </div>
  </div>
</template>







