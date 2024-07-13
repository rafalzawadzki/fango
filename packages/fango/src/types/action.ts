export interface GoogleSheetAction {
  insertSheetRowAction: (data: any) => Promise<any>
  findSheetRowAction: (data: any) => Promise<any>
  updateSheetRowAction: (data: any) => Promise<any>
  deleteSheetRowAction: (data: any) => Promise<any>
  findSheetsAction: (data: any) => Promise<any>
  findSpreadsheetsAction: (data: any) => Promise<any>
  findSheetNameAction: (data: any) => Promise<any>
  getSheetValuesAction: (data: any) => Promise<any>
}

export interface SlackAction {
  sendMessageToChannelAction: (data: any) => Promise<any>
  findChannelsAction: (data: any) => Promise<any>
}

export type Action = GoogleSheetAction | SlackAction

export interface ActionMap {
  'google-sheet': GoogleSheetAction
  'slack': SlackAction
}
