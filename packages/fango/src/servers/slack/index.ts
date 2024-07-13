import type { Nango } from '@nangohq/node'

import { type SendMessageToChannelParams, findChannels, sendMessageToChannel } from './actions'

export class SlackServer {
  nango: Nango
  constructor(nango: Nango) {
    this.nango = nango
  }

  findChannels(connectionId: string) {
    return findChannels(this.nango, connectionId)
  }

  sendMessageToChannel(data: SendMessageToChannelParams) {
    return sendMessageToChannel(this.nango, data)
  }
}
