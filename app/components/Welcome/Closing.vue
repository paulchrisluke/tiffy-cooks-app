<template>
  <section class="h-screen flex items-center justify-center px-6 snap-start">
    <div class="text-center max-w-2xl">
      <h2 class="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-8">
        Closing.
      </h2>
      <p class="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
        Let's build something unforgettable.<br>
        <span class="font-medium">The TiffyCooks Community.</span>
      </p>
      <p class="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
        A platform for creativity, connection, and long-term value.
      </p>
      <p class="text-base md:text-lg text-neutral-500 dark:text-neutral-500 mb-8">
        Built with the same care you bring to every recipe.
      </p>

      <div class="space-y-6">
        <UButton
          label="View Proposal"
          color="primary"
          size="xl"
          class="rounded-2xl"
          trailing-icon="i-lucide-arrow-right"
          :ui="{ trailingIcon: 'size-5' }"
          :to="loggedIn ? '/dashboard/proposal' : '/auth/register'"
        />

        <div class="text-sm text-neutral-500 dark:text-neutral-500">
          — PCL Labs<br>
          Build. Grow. Exit.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>
