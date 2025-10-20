<template>
  <div class="relative">
    <div class="max-w-full" ref="scrollContainer">
      <slot />
    </div>

    <!-- Progress indicator -->
    <WelcomeProgress :current-slide="currentSlide" :total-slides="totalSlides" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const currentSlide = ref(1)
const scrollContainer = ref<HTMLElement>()
const totalSlides = ref(0)

// Update the cached total slides count
const updateTotalSlides = () => {
  const sections = document.querySelectorAll('section.snap-start')
  totalSlides.value = sections.length
}

// Track scroll position to update current slide
const handleScroll = () => {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const slideIndex = Math.round(scrollTop / windowHeight) + 1
  currentSlide.value = Math.max(1, Math.min(totalSlides.value, slideIndex))
}

// Handle resize events to update slide count if needed
const handleResize = () => {
  updateTotalSlides()
}

onMounted(async () => {
  // Wait for DOM to be fully rendered before counting slides
  await nextTick()
  updateTotalSlides()

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>
