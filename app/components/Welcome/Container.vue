<template>
  <div class="relative">
    <div class="h-screen overflow-y-scroll snap-y snap-mandatory max-w-full" ref="scrollContainer">
      <slot />
    </div>

    <!-- Progress indicator -->
    <WelcomeProgress :current-slide="currentSlide" :total-slides="TOTAL_SLIDES" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const TOTAL_SLIDES = 8

const currentSlide = ref(1)
const scrollContainer = ref<HTMLElement>()

// Track scroll position to update current slide
const handleScroll = () => {
  if (!scrollContainer.value) return

  const scrollTop = scrollContainer.value.scrollTop
  const windowHeight = window.innerHeight
  const slideIndex = Math.round(scrollTop / windowHeight) + 1
  currentSlide.value = Math.max(1, Math.min(TOTAL_SLIDES, slideIndex))
}

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>
