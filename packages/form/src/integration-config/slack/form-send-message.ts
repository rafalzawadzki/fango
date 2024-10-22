import type { FangoClient } from '@fango/client'
import { authConfig, getCommonField } from './form-common'
import { PROVIDER_CONFIG_KEY } from './constants'
import type { CreateFormParams } from '@/types/form'
import { FormItemFactory } from '@/forms'

export function getSendMessageForm(fangoClient: FangoClient): CreateFormParams {
  const actions = fangoClient.actions.get('slack') as any
  const commonField = getCommonField(fangoClient)
  const { sendMessageToChannelAction } = actions
  return {
    name: 'Send Message',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    authConfig,
    fields: [
      commonField.auth,
      commonField.connectionId,
      commonField.slackInfo,
      commonField.channel,
      FormItemFactory.Input({
        fangoClient,
        fieldName: 'text',
        label: 'Message',
        required: true,
        tip: 'The text of your message',
        placeholder: 'Enter the message',
      }),
      commonField.username,
      commonField.profilePicture,
      FormItemFactory.Input({
        fangoClient,
        fieldName: 'threadTs',
        label: 'Thread ts',
        tip: 'Provide the ts (timestamp) value of the **parent** message to make this message a reply. Do not use the ts value of the reply itself; use its parent instead. For example `1710304378.475129`.Alternatively, you can easily obtain the message link by clicking on the three dots next to the parent message and selecting the `Copy link` option.',
        placeholder: 'Enter the Thread ts',
      }),
    ],
    run: async (values: any) => {
      const {
        connectionId,
        text,
        channel,
        username,
        profilePicture,
        threadTs,
      } = values
      const res = await sendMessageToChannelAction({
        connectionId,
        text,
        conversationId: channel,
        username,
        profilePicture,
        threadTs,
      })
      return res
    },
  }
}
