<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#000000" />
  <UApp :toaster="{ position: 'top-center' }">
    <NuxtPage />
  </UApp>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'PCL-Labs',
  description: 'PCL-Labs - Advanced team collaboration and proposal management platform for modern businesses',
})
</script>
