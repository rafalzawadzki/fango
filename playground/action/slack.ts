'use server'

import { type SendMessageToChannelParams, findChannels, sendMessageToChannel } from '@/lib/nango/slack/actions'

export const sendMessageToChannelAction = async (data: SendMessageToChannelParams) => sendMessageToChannel(data)

export const findChannelsAction = async (connectionId: string) => findChannels(connectionId)
