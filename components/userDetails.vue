<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useUserStore } from '#imports';
import { Check } from 'lucide-vue-next';

interface UserDetails {
  username: string;
  job: string;
  country: string;
  email: string;
  phone: string;
  openToWork: boolean;
  profilePicture: File | null;
}

const formInitialState: UserDetails = {
  username: '',
  job: '',
  country: '',
  email: '',
  phone: '',
  openToWork: false,
  profilePicture: null,
};

const form = reactive({ ...formInitialState });
const apiCall = ref(false);
const isSubmitting = ref(false);
const formTouched = ref(false);
const userStore = useUserStore();
const fileName = ref('');

const isFormValid = computed(() => {
  return (
    form.username &&
    form.job &&
    form.country &&
    form.email &&
    form.phone &&
    form.profilePicture !== null
  );
});

const resetForm = () => {
  Object.assign(form, formInitialState);
  formTouched.value = false;
};

const fetchFormData = async () => {
  try {
    const userData = await userStore.getUserDetails();
    Object.assign(form, userData);
  } catch (error) {
    console.error('Error fetching user details', error);
  }
};

const submitForm = async () => {
  apiCall.value = true;
  isSubmitting.value = true;
  try {
    await userStore.updateUserDetails(form);
    toast.success('Profile updated successfully!', { position: 'top-right' });
    formTouched.value = false;
  } catch (error) {
    toast.error('Error updating profile.', { position: 'top-right' });
  } finally {
    apiCall.value = false;
    isSubmitting.value = false;
  }
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  form.profilePicture = input.files?.[0] || null;
  fileName.value = form.profilePicture ? form.profilePicture.name : 'No file chosen';
  formTouched.value = true;
};

onMounted(fetchFormData);
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-2xl shadow-lg border border-amber-400 rounded-lg p-8 bg-neutral-900 text-gray-100">
      <form @submit.prevent="submitForm" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
          <div v-for="(label, key) in { username: 'Username', job: 'Job', country: 'Country', email: 'Email', phone: 'Phone Number' }" :key="key">
            <label :for="key" class="block font-medium">{{ label }}</label>
            <input
              v-model="form[key]"
              type="text"
              :id="key"
              required
              class="block w-full mt-2 rounded-md bg-gray-400/10 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-amber-400/50 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-500/80 sm:text-sm/6"
              @input="formTouched = true"
            />
          </div>
          <!-- Profile Picture -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center space-x-2">
              <label class="font-medium">Profile Picture <span class="text-xs text-gray-400">(optional)</span> </label>
              <label class="font-medium">-</label>
              <label class="text-amber-400  hover:text-amber-400/80 text-sm cursor-pointer italic">
                choose file
                <input
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  class="hidden"
                />
              </label>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gray-300 text-sm">{{ fileName || 'No file chosen' }}</span>
              <button
                type="button"
                @click="form.profilePicture = null; fileName.value = ''"
                class="text-red-500 hover:text-red-500/80 text-lg cursor-pointer"
                v-if="form.profilePicture"
              >
                &times; 
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <input v-model="form.openToWork" type="checkbox" class="w-4 h-4" />
            <span>Open to Work</span>
          </div>
        </div>
        <div class="flex space-x-8">
          <button
            type="submit"
            :disabled="!isFormValid"
            class="w-full bg-amber-400 px-3 py-1.5 text-sm font-bold text-neutral-900 rounded-md shadow hover:bg-amber-400/80 disabled:cursor-not-allowed disabled:bg-amber-400/40"
          >
            <span v-if="apiCall" class="animate-spin h-5 w-5 mr-2">🔄</span>
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
          <button
            type="button"
            @click="resetForm"
            :disabled="!formTouched"
            class="w-full bg-red-500 px-3 py-1.5 text-sm font-bold text-white rounded-md shadow hover:bg-red-500/80 disabled:cursor-not-allowed disabled:bg-red-500/40"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped>
input:-webkit-autofill {
  background-color: rgba(16, 16, 16, 0.1) !important;
  color: #d1d5db !important;
  -webkit-text-fill-color: #d1d5db !important;
  -webkit-box-shadow: 0 0 0px 1000px rgba(16, 16, 16, 0.1) inset !important;
  transition: background-color 5000s ease-in-out 0s;
}
input.autofill {
  background-color: rgba(16, 16, 16, 0.1) !important;
  color: #d1d5db !important;
  -webkit-text-fill-color: #d1d5db !important;
}
</style>
