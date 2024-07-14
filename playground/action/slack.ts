'use server'

import { locoServer } from '@/lib/fango/server'

export const sendMessageToChannelAction = async (data: any) => locoServer.slackServer.sendMessageToChannel(data)

export const findChannelsAction = async (connectionId: string) => locoServer.slackServer.findChannels(connectionId)
