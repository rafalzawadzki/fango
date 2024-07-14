import { LocoClient } from '@fango/client'
import { createConnection, getConnections, updateConnection } from '@/lib/database'
import { findChannelsAction, sendMessageToChannelAction } from '@/action/slack'
import { deleteSheetRowAction, findSheetNameAction, findSheetRowAction, findSheetsAction, findSpreadsheetsAction, getSheetValuesAction, insertSheetRowAction, updateSheetRowAction } from '@/action/google-sheets'

const locoClient = new LocoClient(process.env.NANGO_HOST!, process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY!)

locoClient.setConnectionDatabase({
  getConnections,
  updateConnection,
  createConnection,
})

locoClient.setServerActions('slack', {
  findChannelsAction,
  sendMessageToChannelAction,
})

locoClient.setServerActions('google-sheet', {
  insertSheetRowAction,
  findSheetRowAction,
  updateSheetRowAction,
  deleteSheetRowAction,
  findSheetsAction,
  findSpreadsheetsAction,
  findSheetNameAction,
  getSheetValuesAction,
})

export { locoClient }
