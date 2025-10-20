<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Message" name="message">
      <UTextarea
        v-model="state.message"
        placeholder="Let's discuss the proposal details, timeline, or any questions you have..."
        :rows="4"
        size="lg"
        variant="subtle"
        class="w-full"
        :ui="{
          base: 'w-full',
          wrapper: 'w-full',
        }"
      />
    </UFormField>

    <UButton
      type="submit"
      size="xl"
      block
      :loading="loading"
      label="Schedule Meeting"
      icon="i-lucide-calendar"
      :ui="{
        leadingIcon: 'size-5',
      }"
    />
  </UForm>
</template>

<script setup lang="ts">
import type * as z from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { meetingRequestSchema } from '@@/shared/validations/meeting'

const schema = meetingRequestSchema
type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  message: '',
})

const loading = ref(false)
const toast = useToast()
const { submitMeetingRequest } = useMeetingRequest()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await submitMeetingRequest(event.data)

    toast.add({
      title: 'Meeting request sent!',
      description: 'Paul will reach out to schedule a time to discuss the proposal.',
      color: 'success',
    })

    // Clear form
    state.message = ''
  } catch (error) {
    // Production-safe error logging
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting the meeting request'
    console.error(errorMessage)

    // Log full error details only in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('Full error details:', error)
    }

    toast.add({
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
