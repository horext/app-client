import { OAuth2Client } from 'google-auth-library'
const client = new OAuth2Client()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { credential } = body
  const {
    public: { gsi },
  } = useRuntimeConfig()
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: gsi.clientId,
  })
  const payload = ticket.getPayload()
  if (!payload) {
    throw new Error('Invalid token')
  }
  const userid = payload['sub']
  const domain = payload['hd']
  if (domain !== 'yourdomain.com') {
    throw new Error('Invalid domain')
  }
  if (userid) {
    return {
      body: {
        status: 'ok',
      },
    }
  } else {
    throw new Error('Invalid token')
  }
})
