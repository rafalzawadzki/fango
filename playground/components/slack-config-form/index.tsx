'use client'

import { useEffect } from 'react'
import { LocoForm } from '@/lib/fango/form'
import { locoClient } from '@/lib/fango/client'
import { findChannelsAction, sendMessageToChannelAction } from '@/action/slack'

export default function SheetConfigForm() {
  useEffect(() => {
    locoClient.setServerActions('slack', {
      findChannelsAction,
      sendMessageToChannelAction,
    })
  }, [])

  return (
    <LocoForm
      type="slack"
      locoClient={locoClient}
    />
  )
}
