<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, User } from 'lucide-vue-next';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from 'vue3-toastify';

const props = defineProps<{ users: UserDetails[] }>();

const emit = defineEmits(["updateFavorites"]);

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

const auth = getAuth(); 
const user = auth.currentUser; 

const currentPage = ref(1);
const pageSize = 5;
const totalPages = computed(() => Math.ceil(sortedUsers.value.length / pageSize));

const sortColumn = ref<keyof UserDetails | null>(null);
const sortOrder = ref<'asc' | 'desc'>('asc');

const isRemovingFavorite = ref(false);

let currentTooltip: HTMLElement | null = null 

onMounted(() => {
  favAll(props.users);   
});

const favAll = (users: UserDetails[]) => {
  users.forEach((user) => {  
    user.isFavorite = true;
  });
};

const sortedUsers = computed(() => {
  let users = [...props.users];
  if (!sortColumn.value) return users;
  users.sort((a, b) => {
    let valueA = a[sortColumn.value!];
    let valueB = b[sortColumn.value!];
    // 🛠️ Fix boolean sorting across all pages
    if (sortColumn.value === "openedToWork") {
      return sortOrder.value === "asc"
        ? (valueA === valueB ? 0 : valueA ? -1 : 1)
        : (valueA === valueB ? 0 : valueA ? 1 : -1);
    }
    // 🛠️ Sort strings/numbers
    if (valueA < valueB) return sortOrder.value === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
  // ✅ Returning a **new reference** to force Vue to update
  return [...users];
});
// 🚀 Apply pagination AFTER sorting
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedUsers.value.slice(start, start + pageSize);
});
// 🛠️ Ensure sort order is persistent
const setSortColumn = (column: keyof UserDetails) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortOrder.value = 'asc';
  }
  currentPage.value = 1;  // 🔥 Reset to first page on new sort
};

const removeFromFavorites = async (userToUnfavorite: UserDetails) => {
  const loggedInUserId = auth.currentUser?.uid;
  try {
    const favRef = collection(db, "favorites");
    // Implement logic to find the document based on favoritedBy and userToUnfavorite fields
    const querySnapshot = await getDocs(favRef);
    let favoriteDocId: string | null = null;    
    querySnapshot.forEach(doc => {
      if (doc.data().favoritedBy === loggedInUserId && doc.data().email === userToUnfavorite.email) {
        favoriteDocId = doc.id;  // Get the doc ID for removal
      }
    });
    if (favoriteDocId) {
      // If a document was found, delete it
      await deleteDoc(doc(favRef, favoriteDocId));
      emit("updateFavorites", userToUnfavorite.email);
      return true;
    } else {
      toast.error('Error removing from favorites.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false
      })
      throw new Error("Favorite not found");
    }
  } catch (error) {
    console.error("Error removing from favorites:", error);
    toast.error('Error removing from favorites.', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false
    })
    throw error;  
  }
};

const toggleTooltip = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const tooltip = target.querySelector('.tooltip') as HTMLElement;
  if (tooltip) {
    // Close the previously opened tooltip (if any)
    if (currentTooltip && currentTooltip !== tooltip) {
      currentTooltip.classList.remove('active');    }

    // Toggle the active class for the clicked tooltip
    const isActive = tooltip.classList.contains('active');
    tooltip.classList.toggle('active', !isActive);    
    // Update current tooltip reference
    currentTooltip = !isActive ? tooltip : null;
  }  
  // Prevent the click event from propagating to the document listener
  event.stopPropagation();
};

const hideToolTip = (event: Event) => {
  if (currentTooltip && !currentTooltip.contains(event.target as Node)) {
    currentTooltip.classList.remove('active');
    currentTooltip = null;
  }
};
</script>

<template>
  <div class="flex flex-col w-full items-center justify-start">

    <!-- Show this message if users list is empty -->
    <div v-if="!props.users.length" class="text-gray-300 mt-12">
      <p class="p-20 lg:p-5 text-2xl font-semibold bg-neutral-900/10">You don't have any favorites. Explore the users list and mark your favorites to see them here!</p>
    </div>
 
    <!-- Table Wrapper with scrollable max height and fixed height for pagination -->
    <div v-if="props.users.length" class="sm:mx-auto w-[97.5vw] md:w-[85vw] p-6 text-gray-100 flex-1 min-h-[500px] table-wrapper">
      <div class="overflow-x-auto mt-6">
        <div class="border-2 border-amber-400/50 rounded-lg overflow-x-auto shadow-lg">
          <!-- Table without min-height so it won't stretch on small pages -->
          <table class="w-full bg-neutral-900 rounded-lg table-fixed">
            <thead>
              <tr class="text-gray-300 text-xl"> 
                <th class="px-2 py-4 text-left w-[75px] border-b-2 border-amber-400/40"></th> 
                <th class="px-2 py-4 text-left w-[175px] xl:w-[275px cursor-pointer relative group border-b-2 border-amber-400/40" @click="setSortColumn('name')" title="Sort">
                  Name
                  <span v-if="sortColumn === 'name'">
                    <ChevronUp v-if="sortOrder === 'asc'" class="inline-block w-5 h-5 text-amber-400" />
                    <ChevronDown v-if="sortOrder === 'desc'" class="inline-block w-5 h-5 text-amber-400" />
                  </span>
                </th>
                <th class="px-2 py-4 text-left w-[175px] xl:w-[275px] cursor-pointer relative group border-b-2 border-amber-400/40" @click="setSortColumn('profession')" title="Sort">
                  Profession
                  <span v-if="sortColumn === 'profession'">
                    <ChevronUp v-if="sortOrder === 'asc'" class="inline-block w-5 h-5 text-amber-400" />
                    <ChevronDown v-if="sortOrder === 'desc'" class="inline-block w-5 h-5 text-amber-400" />
                  </span>
                </th>
                <th class="px-2 py-4 text-left w-[175px] xl:w-[275px] cursor-pointer relative group border-b-2 border-amber-400/40" @click="setSortColumn('country')" title="Sort">
                  Country
                  <span v-if="sortColumn === 'country'">
                    <ChevronUp v-if="sortOrder === 'asc'" class="inline-block w-5 h-5 text-amber-400" />
                    <ChevronDown v-if="sortOrder === 'desc'" class="inline-block w-5 h-5 text-amber-400" />
                  </span>
                </th>
                <th class="px-2 py-4 text-left w-[175px] xl:w-[275px] cursor-pointer relative group border-b-2 border-amber-400/40" @click="setSortColumn('email')" title="Sort">
                  Email
                  <span v-if="sortColumn === 'email'">
                    <ChevronUp v-if="sortOrder === 'asc'" class="inline-block w-5 h-5 text-amber-400" />
                    <ChevronDown v-if="sortOrder === 'desc'" class="inline-block w-5 h-5 text-amber-400" />
                  </span>
                </th>
                <th class="px-2 py-4 text-center w-[175px] xl:w-[200px] cursor-pointer relative group border-b-2 border-amber-400/40" @click="setSortColumn('openedToWork')" title="Sort">
                  <span class="flex items-center justify-center gap-1">
                    Open to Work
                    <span v-if="sortColumn === 'openedToWork'">
                      <ChevronUp v-if="sortOrder === 'asc'" class="inline-block w-5 h-5 text-amber-400" />
                      <ChevronDown v-if="sortOrder === 'desc'" class="inline-block w-5 h-5 text-amber-400" />
                    </span>
                  </span>
                </th>
                <th class="px-2 py-4 text-center w-[125px] xl:w-[150px] border-b-2 border-amber-400/40">Favorite</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="user in paginatedUsers" 
                :key="user.email" 
                class="border-t border-gray-600" 
                :class="{
                  'bg-blue-800 text-white cursor-default': user.email === auth.currentUser?.email,
                  'hover:bg-gray-700/50': user.email !== auth.currentUser?.email
                }">
                <td class="p-3 text-center h-[60px] flex items-center justify-center">
                  <img 
                    v-if="user.profilePicture && user.profilePicture !== ''" 
                    :src="user.profilePicture" 
                    alt="Profile" 
                    class="w-12 h-12 rounded-full border-2 border-amber-400/70 object-cover"
                  />
                  <User 
                    v-else 
                    class="w-9 h-9 text-amber-400/50"
                    title="User Icon"
                  />
                </td>  
                <td class="td-container" @click="toggleTooltip($event)">
                  <div class="ps-3 pe-8 text-gray-300 truncate cursor-default" :title="user.name">
                    {{ user.name }}
                  </div>
                  <span class="tooltip" >{{ user.name }}</span>
                </td>     
                <td class="td-container" @click="toggleTooltip($event)">
                  <div class="ps-3 pe-8 text-gray-300 truncate cursor-default" :title="user.profession">
                    {{ user.profession }}
                  </div>
                  <span class="tooltip" >{{ user.profession }}</span>
                </td>        
                <td class="td-container" @click="toggleTooltip($event)">
                  <div class="ps-3 pe-8 text-gray-300 truncate cursor-default" :title="user.country">
                    <img 
                      v-if="user.flag" 
                      :src="user.flag" 
                      alt="Flag" 
                      class="inline-block w-6 h-4 mr-2"
                    />
                    {{ user.country }}
                  </div>
                  <span class="tooltip" >{{ user.country }}</span>
                </td>
                <td class="td-container" @click="toggleTooltip($event)">
                  <div class="ps-3 pe-8 text-gray-300 truncate cursor-default" :title="user.email">
                    {{ user.email }}
                  </div>
                  <span class="tooltip" >{{ user.email }}</span>
                </td>
                <td class="p-3 text-center cursor-default">
                  <span class="text-green-500" v-if="user.openedToWork">✔</span>
                  <span v-else class="text-xs cursor-default">❌</span>
                </td>
                <td class="p-3 text-center w-[10%]">
                  <button
                    @click="removeFromFavorites(user)"
                    :disabled="user.email === auth.currentUser?.email || isRemovingFavorite"
                    class="text-2xl transition-colors"
                    :class="{
                      'text-yellow-400': user.isFavorite, 
                      'text-gray-500 hover:text-gray-400': !user.isFavorite && user.email !== auth.currentUser?.email, 
                      'cursor-not-allowed text-gray-500': user.email === auth.currentUser?.email,
                      'cursor-pointer': user.email !== auth.currentUser?.email
                    }"
                    :title="user.email === auth.currentUser?.email ? 'Cannot favorite yourself' : (user.isFavorite ? 'Remove from Favorites' : 'Add to Favorites')"
                  >
                    ★
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="props.users.length && totalPages > 1" class="flex justify-center items-center gap-4 mt-0 xl:mt-6 mb-8 cursor-default">
      <!-- Previous Button -->
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        :class="{'cursor-pointer': currentPage !== 1,
                'cursor-default': currentPage === 1,
                'border border-2 border-amber-400/90' : currentPage !== 1,
                'border border-2 border-amber-400/60' : currentPage === 1,
                'hover:bg-gray-700 hover:text-white' : currentPage !== 1   
                }"
        class="p-3 rounded-full bg-gray-600 text-gray-300 disabled:opacity-50 relative transition-all duration-200 ease-in-out"
        :title="currentPage === 1 ? '' : 'Previous'">
        <ChevronLeft class="w-5 h-5" />
      </button>

      <span class="text-gray-300">Page {{ currentPage }} of {{ totalPages }}</span>

      <!-- Next Button -->
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        :class="{'cursor-pointer': currentPage !== totalPages, 
                  'cursor-default': currentPage === totalPages, 
                  'border border-2 border-amber-400/90' : currentPage !== totalPages,
                  'border border-2 border-amber-400/60' : currentPage === totalPages,
                  'hover:bg-gray-700 hover:text-white' : currentPage !== totalPages                  
                  }"
        class="p-3 rounded-full bg-gray-600 text-gray-300 disabled:opacity-50 relative transition-all duration-200 ease-in-out "
        :title="currentPage === totalPages ? '' : 'Next'">
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<style scoped>
  .tooltip {
    display: none;
  }

/**************************/
/* BELOW 944px (Tablets) */
/**************************/

@media (max-width: 59em) {
  .table-wrapper {
    overflow-x: scroll !important; /* Ensure the horizontal scrollbar is always visible */
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on mobile */
    scrollbar-width: thin; /* For Firefox */
    scrollbar-color: rgba(255, 165, 0, 0.7) rgba(0, 0, 0, 0.1); /* For Firefox */
  }
  /* Make the scrollbar thicker */
  .table-wrapper::-webkit-scrollbar {
    height: 12px; /* Adjust this value to make the scrollbar thicker */
  }
  .table-wrapper::-webkit-scrollbar-thumb {
    background-color: rgba(255, 165, 0, 0.7); /* Customize thumb color */
    border-radius: 10px;
  }
  .table-wrapper::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1); /* Optional track styling */
  }
  /* Ensure the scrollbar remains visible at all times */
  .table-wrapper {
    overflow-x: scroll !important; /* Forces scroll always */
    -webkit-overflow-scrolling: auto; /* Prevents the scrollbar from disappearing */
  }
  .td-container {
    position: relative; 
  }
  .tooltip {
    position: absolute;
    background-color: #333;
    color: red;
    padding: 5px;
    border-radius: 4px;
    font-size: 12px;
    top: 2rem;
    left: 0;
    white-space: nowrap;
    z-index: 9999 !important;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
  .tooltip.active {
    display: block;
    overflow: visible;
  }
}
</style>