'use client'

import { LocoForm } from '@fango/form'
import '@fango/form/dist/style.css'
import { locoClient } from '@/lib/fango/client'
import { findChannelsAction, sendMessageToChannelAction } from '@/action/slack'

export default function SheetConfigForm() {
  locoClient.setServerActions('slack', {
    findChannelsAction,
    sendMessageToChannelAction,
  })

  return (
    <LocoForm
      type="slack"
      locoClient={locoClient}
    />
  )
}
