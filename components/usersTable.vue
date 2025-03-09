<script setup lang="ts">
import { ref, computed } from 'vue';

interface UserDetails {
  name: string;
  profession: string;
  country: string;
  email: string;
  profilePicture: string;
  openToWork: boolean;
  isFavorite?: boolean;
}

const props = defineProps<{ users: UserDetails[] }>();

const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(props.users.length / pageSize));

const sortColumn = ref<keyof UserDetails | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');

const sortedUsers = computed(() => {
  if (!sortColumn.value) return props.users;

  return [...props.users].sort((a, b) => {
    let valueA = a[sortColumn.value!];
    let valueB = b[sortColumn.value!];

    if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
      valueA = valueA ? 1 : 0;
      valueB = valueB ? 1 : 0;
    }

    if (valueA < valueB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedUsers.value.slice(start, start + pageSize);
});

const setSortColumn = (column: keyof UserDetails) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortOrder.value = 'asc';
  }
};

const toggleFavorite = (user: UserDetails) => {
  user.isFavorite = !user.isFavorite;
};
</script>

<template>
  <div class="flex flex-col w-full items-center justify-center">
    <div class="sm:mx-auto sm:w-[75vw] p-6 text-gray-100">
      <div class="overflow-x-auto mt-6">
        <div class="border border-amber-400 rounded-lg overflow-hidden shadow-lg">
          <table class="w-full bg-neutral-900 rounded-lg table-fixed">
            <thead>
              <tr class="text-gray-300">
                <th class="p-2 text-left w-[5%]"></th> <!-- Empty header for profile picture -->
                <th class="p-2 text-left w-[20%] cursor-pointer" @click="setSortColumn('name')">
                  Name
                  <span v-if="sortColumn === 'name'">{{ sortOrder === 'asc' ? '⬆' : '⬇' }}</span>
                </th>
                <th class="p-2 text-left w-[20%] cursor-pointer" @click="setSortColumn('profession')">
                  Profession
                  <span v-if="sortColumn === 'profession'">{{ sortOrder === 'asc' ? '⬆' : '⬇' }}</span>
                </th>
                <th class="p-2 text-left w-[15%] cursor-pointer" @click="setSortColumn('country')">
                  Country
                  <span v-if="sortColumn === 'country'">{{ sortOrder === 'asc' ? '⬆' : '⬇' }}</span>
                </th>
                <th class="p-2 text-left w-[20%] cursor-pointer" @click="setSortColumn('email')">
                  Email
                  <span v-if="sortColumn === 'email'">{{ sortOrder === 'asc' ? '⬆' : '⬇' }}</span>
                </th>
                <th class="p-2 text-center w-[15%] cursor-pointer" @click="setSortColumn('openToWork')">
                  <span class="flex items-center justify-center gap-1">
                    Open to Work
                    <span v-if="sortColumn === 'openToWork'">{{ sortOrder === 'asc' ? '⬆' : '⬇' }}</span>
                  </span>
                </th>
                <th class="p-2 text-center w-[10%]">Favorite</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.email" class="border-t border-gray-600 hover:bg-gray-700/50">
                <td class="p-3 text-center">
                  <img 
                    :src="user.profilePicture" 
                    alt="Profile" 
                    class="w-12 h-12 rounded-full border border-amber-400 object-cover"
                  />
                </td>
                <td class="p-3 text-white truncate">{{ user.name }}</td>
                <td class="p-3 text-gray-300 truncate">{{ user.profession }}</td>
                <td class="p-3 text-gray-300 truncate">{{ user.country }}</td>
                <td class="p-3 text-gray-300 truncate">{{ user.email }}</td>
                <td class="p-3 text-center">
                  <span v-if="user.openToWork">✔</span>
                  <span v-else class="text-sm">❌</span>
                </td>
                <td class="p-3 text-center w-[10%]">
                  <button
                    @click="toggleFavorite(user)"
                    class="text-2xl transition-colors cursor-pointer"
                    :class="user.isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-400'"
                    :title="user.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'"
                  >
                    ★
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
