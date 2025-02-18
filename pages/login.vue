<script setup lang="ts">
import RegistrationModal from '~/components/registration-modal.vue'; 

const isModalOpen = ref(false)

const openRegisterModal = () => {
  isModalOpen.value = true
}

const closeRegisterModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div class="flex min-h-screen flex-col w-full items-center justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm shadow-lg rounded-lg p-8 bg-white">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 class="mt-0 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
      </div>
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" action="#" method="POST">
          <div>
            <label for="email" class="block font-medium text-gray-900">Email address</label>
            <div class="mt-2">
              <input type="email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block font-medium text-gray-900">Password</label>
              <div class="text-sm">
                <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
            </div>
            <div class="mt-2">
              <input type="password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            </div>
          </div>
          <div>
            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">Sign in</button>
          </div>
        </form>
        <p class="mt-10 text-center text-sm/6 text-gray-500">
          Not register yet?
          <a @click="openRegisterModal" class="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">Click here to create your profile</a>
        </p>
      </div>
    </div>
  </div>

 <RegistrationModal :isOpen="isModalOpen" @close="closeRegisterModal"/>
 
</template>