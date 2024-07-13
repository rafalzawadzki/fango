"use server"

import { sendMessageToChannel, findChannels, type SendMessageToChannelParams } from "@/lib/nango/slack/actions"

export const sendMessageToChannelAction = async (data: SendMessageToChannelParams) => sendMessageToChannel(data)

export const findChannelsAction = async (connectionId: string) => findChannels(connectionId)
