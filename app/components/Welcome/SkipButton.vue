<template>
  <div class="fixed top-4 md:top-6 right-4 md:right-6 z-50 flex items-center gap-3">
    <ThemeToggle />
    <UButton
      color="neutral"
      variant="ghost"
      size="md"
      label="Skip"
      :to="loggedIn ? '/dashboard/proposal' : '/auth/register'"
      class="backdrop-blur-sm bg-white/80 dark:bg-neutral-900/80"
    />
  </div>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>
