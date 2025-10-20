<template>
  <div class="relative">
    <div class="max-w-full" ref="scrollContainer">
      <slot />
    </div>

    <!-- Progress indicator -->
    <WelcomeProgress :current-slide="currentSlide" :total-slides="getTotalSlides()" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(1)
const scrollContainer = ref<HTMLElement>()

// Count actual sections dynamically
const getTotalSlides = () => {
  const sections = document.querySelectorAll('section.snap-start')
  return sections.length
}

// Track scroll position to update current slide
const handleScroll = () => {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const totalSlides = getTotalSlides()
  const slideIndex = Math.round(scrollTop / windowHeight) + 1
  currentSlide.value = Math.max(1, Math.min(totalSlides, slideIndex))
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
