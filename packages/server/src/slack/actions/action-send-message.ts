import type { Nango } from '@nangohq/node'
import { BASIC_URL_PREFIX, PROVIDER_CONFIG_KEY } from '../constants'
import { processMessageTimestamp } from '../utils'
import { findConnectionCredentials } from './common'

export interface SendMessageToChannelParams {
  connectionId: string
  text: string
  conversationId: string
  username?: string
  profilePicture?: string
  threadTs?: string
}

export async function sendMessageToChannel(
  nango: Nango,
  {
    connectionId,
    text,
    conversationId,
    username,
    profilePicture,
    threadTs,
  }: SendMessageToChannelParams,
) {
  const { access_token } = await findConnectionCredentials(nango, connectionId)

  const data: any = {
    text,
    channel: conversationId,
  }

  threadTs = threadTs ? processMessageTimestamp(threadTs) : undefined

  if (username) data.username = username
  if (profilePicture) data.icon_url = profilePicture
  if (threadTs) data.thread_ts = threadTs

  const response = await nango.proxy({
    baseUrlOverride: BASIC_URL_PREFIX,
    endpoint: '/api/chat.postMessage',
    method: 'post',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    connectionId,
    data,
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  if (!response.data.ok) {
    switch (response.data.error) {
      case 'not_in_channel':
        throw new Error(
          'The bot is not in the channel',
          // JSON.stringify({
          //   message: 'The bot is not in the channel',
          //   code: 'not_in_channel',
          //   action: 'Invite the bot from the channel settings',
          // })
        )
      default: {
        throw new Error(response.data.error)
      }
    }
  }

  return {
    success: true,
    request_body: data,
    response_body: response.data,
  }
}
