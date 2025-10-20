<template>
  <div class="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50">
    <div
      class="flex flex-col gap-2"
      role="list"
      aria-label="Carousel progress"
    >
      <div
        v-for="slide in totalSlides"
        :key="slide"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="slide === currentSlide
          ? 'bg-primary-500 scale-125'
          : 'bg-neutral-300 dark:bg-neutral-600'"
        role="listitem"
        :aria-label="`Slide ${slide} of ${totalSlides}`"
        :aria-current="slide === currentSlide ? 'true' : 'false'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentSlide: number
  totalSlides: number
}

defineProps<Props>()
</script>
