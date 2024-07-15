'use server'

import { fangoServer } from '@/lib/fango/server'

export const sendMessageToChannelAction = async (data: any) => fangoServer.slackServer.sendMessageToChannel(data)

export const findChannelsAction = async (connectionId: string) => fangoServer.slackServer.findChannels(connectionId)
