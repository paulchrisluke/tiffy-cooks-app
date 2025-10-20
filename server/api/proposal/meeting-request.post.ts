import { render } from '@vue-email/render'
import MeetingRequest from '@@/emails/meeting-request.vue'
import { sendEmail } from '@@/server/services/email'
import { validateBody } from '@@/server/utils/bodyValidation'
import { meetingRequestSchema } from '@@/shared/validations/meeting'
import { env } from '@@/env'

export default defineEventHandler(async (event) => {
  // 1. Require user session
  const session = await requireUserSession(event)

  // 2. Validate request body
  const data = await validateBody(event, meetingRequestSchema)

  // 3. Render email template
  const htmlTemplate = await render(MeetingRequest, {
    userName: session.user.name,
    userEmail: session.user.email,
    teamName: session.user.team?.name, // if available
    message: data.message,
  })

  // 4. Send email
  if (env.MOCK_EMAIL) {
    console.table({
      to: 'paulchrisluke@gmail.com',
      from: 'REDACTED',
      userName: session.user.name,
      message: data.message,
    })
  } else {
    await sendEmail({
      to: 'paulchrisluke@gmail.com',
      subject: `Meeting Request from ${session.user.name} - TiffyCooks Proposal`,
      html: htmlTemplate,
    })
  }

  return {
    success: true,
    message: 'Meeting request sent successfully',
  }
})
