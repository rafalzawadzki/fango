import type { LocoClient } from '@/client'
import { FormItemFactory } from '@/forms'
import type { SlackAction } from '@/types/action'

export const authConfig = {
  user_scope: ['search:read', 'users.profile:write'],
}

export function getCommonField(locoClient: LocoClient) {
  const { findChannelsAction } = locoClient.actions.get('slack') as SlackAction
  return {
    auth: FormItemFactory.Switch({
      locoClient,
      fieldName: 'auth',
      label: 'Auth',
      hidden: true,
      cache: true,
    }),
    connectionId: FormItemFactory.Connection({
      locoClient,
      fieldName: 'connectionId',
      label: 'Connection',
      required: true,
      cache: true,
    }),
    channel: FormItemFactory.Select({
      locoClient,
      fieldName: 'channel',
      label: 'Channel',
      required: true,
      cache: true,
      showSearch: true,
      tip: 'Channel, private group, or IM channel to send message to.',
      placeholder: 'Select a channel',
      refreshers: ['connectionId'],
      options: async (deps, { field }) => {
        if (field.value) {
          field.onChange('')
        }
        const [connectionId] = deps || []
        if (!connectionId) {
          return {
            disabled: false,
            placeholder: 'Connect slack account first',
            options: [],
          }
        }

        const channels = await findChannelsAction(connectionId)
        return {
          options: channels || [],
          disabled: false,
        }
      },
    }),
    username: FormItemFactory.Input({
      locoClient,
      fieldName: 'username',
      label: 'Username',
      tip: 'The username of the bot',
    }),
    profilePicture: FormItemFactory.Input({
      locoClient,
      fieldName: 'profilePicture',
      label: 'Profile Picture',
      tip: 'The profile picture of the bot',
    }),
    slackInfo: FormItemFactory.Markdown({
      locoClient,
      fieldName: '',
      label: '',
      tip: `
	Please make sure add the bot to the channel by following these steps:
	  1. Type /invite in the channel's chat.
	  2. Click on Add apps to this channel.
	  3. Search for and add the bot.`,
    }),
  }
}
