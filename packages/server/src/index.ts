import { Nango } from '@nangohq/node'
import { SlackServer } from './slack'
import { GoogleSheetServer } from './google-sheet'

export class FangoServer {
  nango: Nango

  googleSheetServer: GoogleSheetServer
  slackServer: SlackServer

  private nango_host: string
  private nango_secret_key: string

  constructor(nango_host: string, nango_secret_key: string) {
    this.nango_host = nango_host
    this.nango_secret_key = nango_secret_key
    this.nango = new Nango({
      host: this.nango_host,
      secretKey: this.nango_secret_key,
    })
    this.googleSheetServer = new GoogleSheetServer(this.nango)
    this.slackServer = new SlackServer(this.nango)
  }
}
