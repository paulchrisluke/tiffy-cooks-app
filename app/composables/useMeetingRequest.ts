export const useMeetingRequest = () => {
  const submitMeetingRequest = async (payload: { message: string }) => {
    return await $fetch('/api/proposal/meeting-request', {
      method: 'POST',
      body: payload,
    })
  }

  return {
    submitMeetingRequest,
  }
}
