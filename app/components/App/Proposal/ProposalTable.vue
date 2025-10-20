<template>
  <div class="rounded-xl bg-[#fbfaf9] p-1.5 dark:bg-neutral-950">
    <div class="card-shadow rounded-md bg-white dark:bg-neutral-900">
      <header
        class="border-b border-neutral-100 px-4 py-2 dark:border-white/10"
      >
        <p class="text-sm text-neutral-500">{{ title }}</p>
      </header>
      <div class="p-4">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <!-- Revenue table headers -->
              <template v-if="type === 'revenue'">
                <tr>
                  <th scope="col" class="sr-only p-2 text-left">Revenue Stream</th>
                  <th scope="col" class="sr-only p-2 text-left">Description</th>
                  <th scope="col" class="sr-only p-2 text-right">Target by Year 2</th>
                </tr>
              </template>

              <!-- Timeline table headers -->
              <template v-else-if="type === 'timeline'">
                <tr>
                  <th scope="col" class="sr-only p-2 text-left">Phase</th>
                  <th scope="col" class="sr-only p-2 text-left">Dates</th>
                  <th scope="col" class="sr-only p-2 text-right">Deliverables</th>
                </tr>
              </template>

              <!-- Financial terms table headers -->
              <template v-else-if="type === 'financial-terms'">
                <tr>
                  <th scope="col" class="sr-only p-2 text-left">Term</th>
                  <th scope="col" class="sr-only p-2 text-left">Description</th>
                  <th scope="col" class="sr-only p-2 text-right">Amount</th>
                </tr>
              </template>
            </thead>
            <tbody>
              <tr
                v-for="(item, i) in data"
                :key="i"
                class="border-b border-neutral-100 text-sm text-neutral-500 hover:bg-neutral-50 dark:border-white/10 dark:text-neutral-400 dark:hover:bg-neutral-800/50 [&>td]:whitespace-nowrap"
              >
                <!-- Revenue table columns -->
                <template v-if="type === 'revenue'">
                  <td class="p-2">
                    <strong>{{ item.stream }}</strong>
                  </td>
                  <td class="p-2">{{ item.description }}</td>
                  <td class="p-2 text-right">
                    <em>Target by Year 2:</em> {{ item.target }}
                  </td>
                </template>

                <!-- Timeline table columns -->
                <template v-else-if="type === 'timeline'">
                  <td class="p-2">
                    <strong>{{ item.phase }}</strong>
                  </td>
                  <td class="p-2">({{ item.dates }})</td>
                  <td class="p-2 text-right">{{ item.deliverables }}</td>
                </template>

                <!-- Financial terms table columns -->
                <template v-else-if="type === 'financial-terms'">
                  <td class="p-2">
                    <strong>{{ item.term }}</strong>
                  </td>
                  <td class="p-2">{{ item.description }}</td>
                  <td class="p-2 text-right">
                    <strong>{{ item.amount }}</strong>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="footer" class="mt-4 text-sm text-neutral-500 dark:text-neutral-400">{{ footer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RevenueBlock, TimelineBlock, FinancialTermsBlock } from '@@/types/proposal'

interface RevenueProps {
  type: 'revenue'
  data: RevenueBlock['data']
  title: string
  footer?: string
}

interface TimelineProps {
  type: 'timeline'
  data: TimelineBlock['data']
  title: string
  footer?: string
}

interface FinancialTermsProps {
  type: 'financial-terms'
  data: FinancialTermsBlock['data']
  title: string
  footer?: string
}

type Props = RevenueProps | TimelineProps | FinancialTermsProps

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
