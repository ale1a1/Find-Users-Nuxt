<template>
  <div class="flex items-center justify-center h-screen bg-neutral-900 text-white">
    <div class="text-center max-w-xl p-8 bg-neutral-800/70 rounded-lg shadow-md">
      <h1 class="text-6xl font-bold text-amber-400">404</h1>
      <p class="mt-4 text-xl text-gray-200">Oops! The page you are looking for doesn't exist.</p>
      <div class="mt-6">
        <NuxtLink to="/" class="text-amber-400 hover:underline text-lg font-semibold">
          Go back to the homepage
        </NuxtLink>
      </div>
    </div>
  </div>
</template>