<template>
  <section class="h-screen flex items-center justify-center px-6 snap-start">
    <div class="text-center max-w-4xl">
      <h2 class="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-8">
        The Experience
      </h2>
      <p class="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
        More than a website.<br>
        <span class="font-medium">It’s a living community.</span>
      </p>
      <p class="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 mb-12 leading-relaxed">
        Creators can share what they’re building, swap lessons, and grow together —<br>
        all in one elegant, app‑ready space.
      </p>

      <!-- Animated UI Mockup -->
      <div class="relative">
        <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 mx-auto max-w-sm">
          <div class="space-y-4">
            <div class="h-4 bg-primary-200 dark:bg-primary-800 rounded w-3/4"></div>
            <div class="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            <div class="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
            <div class="h-8 bg-primary-100 dark:bg-primary-900 rounded w-full"></div>
          </div>
        </div>

        <!-- Floating text reveal -->
        <div class="absolute -top-4 left-1/2 -translate-x-1/2">
          <span class="text-sm font-medium text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-800 px-3 py-1 rounded-full shadow-lg">
            TiffyCooks Community
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Minimal logic, UI presentation only
</script>
