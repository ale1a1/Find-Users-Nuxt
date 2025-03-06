<script setup lang="ts">
import { ref, computed } from 'vue';

interface UserDetails {
  name: string;
  profession: string;
  country: string;
  email: string;
  profilePicture: string;
  openToWork: boolean;
}

const props = defineProps<{
  users: UserDetails[];
}>();

const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(props.users.length / pageSize));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return props.users.slice(start, start + pageSize);
});
</script>

<template>
  <div class="flex flex-col w-full items-center justify-center">
    <div class="sm:mx-auto sm:w-[75vw] p-6 text-gray-100">  

      <div class="overflow-x-auto mt-6">
        <div class="border border-amber-400 rounded-lg overflow-hidden shadow-lg">
          <table class="w-full bg-neutral-900 rounded-lg table-fixed">
            <thead>
              <tr class="text-gray-300">
                <th class="p-2 text-left w-[20%]">Name</th>
                <th class="p-2 text-left w-[20%]">Profession</th>
                <th class="p-2 text-left w-[15%]">Country</th>
                <th class="p-2 text-left w-[20%]">Email</th>
                <th class="p-2 text-center w-[10%]">Open to Work</th>
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
                  <span v-if="user.openToWork">✔</span>
                  <span v-else class ="text-sm">❌</span> 
                </td>
                <td class="p-3 text-center w-[20%]"> 
                  <button class="bg-amber-400 text-neutral-900 px-4 py-2 font-bold rounded-md border border-amber-400 hover:bg-amber-400/80">
                    Add to Favourites
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







