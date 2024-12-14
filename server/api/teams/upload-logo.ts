export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const form = await readFormData(event)
  const image = form.get('image')
  if (!(image instanceof Blob)) {
    throw new Error('Image is not a Blob')
  }
  ensureBlob(image, {
    maxSize: '1MB',
    types: ['image/png', 'image/jpeg', 'image/webp'],
  })

  const file = await hubBlob().put(image.name, image, {
    addRandomSuffix: false,
  })
  return file.pathname
})
