<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div
      v-for="item in data"
      :key="item.title"
      class="rounded-xl bg-[#fbfaf9] p-1.5 dark:bg-neutral-950"
    >
      <div class="card-shadow rounded-md bg-white p-4 dark:bg-neutral-900">
        <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ item.title }}</p>
        <p class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{{ item.value }}</p>
        <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ item.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KpiBlock } from '@@/types/proposal'

interface Props {
  data: KpiBlock['data']
}

defineProps<Props>()
</script>

<style scoped>
.card-shadow {
  box-shadow:
    0 1px 2px #5f4a2e14,
    0 4px 6px #5f4a2e0a,
    0 24px 40px -16px #684b2514;
}
</style>
