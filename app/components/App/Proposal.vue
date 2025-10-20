<template>
  <div class="space-y-12">
    <section v-for="section in sections" :key="section.id" class="space-y-8">
      <!-- Hero Section (First section) -->
      <div v-if="section.id === 'intro'" class="py-8">
        <h1 class="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {{ section.title }}
        </h1>
        <p v-if="section.subtitle" class="mt-6 text-lg text-balance text-neutral-500 dark:text-neutral-400">
          {{ section.subtitle }}
        </p>
      </div>

      <!-- Regular Sections -->
      <div v-else class="space-y-6">
        <div>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
            {{ section.title }}
          </h2>
          <p v-if="section.subtitle" class="mt-4 text-base text-neutral-500 dark:text-neutral-400">
            {{ section.subtitle }}
          </p>
        </div>
      </div>

      <!-- Content Blocks -->
      <div v-for="block in section.blocks" :key="block.id" class="mb-8">
        <!-- Simple text (no card) -->
        <div v-if="'text' in block && !('list' in block)">
          <h3 v-if="block.heading" class="text-xl font-semibold mb-4">{{ block.heading }}</h3>
          <p class="text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {{ block.text }}
          </p>
        </div>

        <!-- Lists in cards (strategic - only for long lists) -->
        <AppProposalCard
          v-else-if="'list' in block && block.list && block.list.length >= 4"
          :title="block.heading"
        >
          <ul class="space-y-3">
            <li v-for="(item, i) in block.list" :key="i" class="flex items-start gap-3">
              <UIcon name="i-lucide-check-circle" class="text-primary-500 size-5 mt-0.5 shrink-0" />
              <span class="text-neutral-700 dark:text-neutral-300">{{ item }}</span>
            </li>
          </ul>
        </AppProposalCard>

        <!-- Short lists (no card) -->
        <div v-else-if="'list' in block && block.list && block.list.length < 4">
          <h3 v-if="block.heading" class="text-xl font-semibold mb-4">{{ block.heading }}</h3>
          <ul class="space-y-2">
            <li v-for="(item, i) in block.list" :key="i" class="flex items-start gap-3">
              <UIcon name="i-lucide-check-circle" class="text-primary-500 size-4 mt-1 shrink-0" />
              <span class="text-neutral-600 dark:text-neutral-300">{{ item }}</span>
            </li>
          </ul>
        </div>

        <!-- Tables in cards -->
        <AppProposalTable
          v-if="'type' in block && (block.type === 'revenue' || block.type === 'timeline' || block.type === 'financial-terms')"
          :type="block.type"
          :data="block.data"
          :title="block.heading || ''"
          :footer="'footer' in block ? block.footer : undefined"
        />

        <!-- KPI cards -->
        <div v-if="'type' in block && block.type === 'kpi'">
          <h3 v-if="block.heading" class="text-xl font-semibold mb-4">{{ block.heading }}</h3>
          <AppProposalKpi :data="block.data" />
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="mt-16 rounded-xl bg-[#fbfaf9] p-1.5 dark:bg-neutral-950">
      <div class="card-shadow rounded-md bg-white p-8 dark:bg-neutral-900">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to discuss the next steps?
          </h2>
          <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Let's schedule a meeting to dive into the details, answer any questions, and start building your community platform.
          </p>
          <AppProposalMeetingRequestForm />
        </div>
      </div>
    </section>

    <!-- Closing Quote -->
    <footer class="py-12 text-center space-y-4">
      <blockquote class="text-xl italic text-neutral-600 dark:text-neutral-400">
        "{{ closing.quote }}"
      </blockquote>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { sections, closing } = useProposal()
</script>

<style scoped>
.card-shadow {
  box-shadow:
    0 1px 2px #5f4a2e14,
    0 4px 6px #5f4a2e0a,
    0 24px 40px -16px #684b2514;
}
</style>
