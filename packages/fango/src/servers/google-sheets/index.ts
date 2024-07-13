import type { Nango } from '@nangohq/node'

import { deleteSheetRow, findSheetName, findSheetRow, findSheets, findSpreadsheets, getSheetValues, insertSheetRow, updateSheetRow } from './actions'
import type { DeleteSheetRowParams, FindSheetNameParams, FindSheetRowParams, FindSheetsParams, FindSpreadsheetsParams, GetSheetValuesParams, InsertSheetRowParams, UpdateSheetRowParams } from './actions'

export class GoogleSheetServer {
  nango: Nango
  constructor(nango: Nango) {
    this.nango = nango
  }

  deleteSheetRow(data: DeleteSheetRowParams) {
    return deleteSheetRow(this.nango, data)
  }

  updateSheetRow(data: UpdateSheetRowParams) {
    return updateSheetRow(this.nango, data)
  }

  insertSheetRow(data: InsertSheetRowParams) {
    return insertSheetRow(this.nango, data)
  }

  findSheetRow(data: FindSheetRowParams) {
    return findSheetRow(this.nango, data)
  }

  findSheetName(data: FindSheetNameParams) {
    return findSheetName(this.nango, data)
  }

  findSheets(data: FindSheetsParams) {
    return findSheets(this.nango, data)
  }

  findSpreadsheets(data: FindSpreadsheetsParams) {
    return findSpreadsheets(this.nango, data)
  }

  getSheetValues(data: GetSheetValuesParams) {
    return getSheetValues(this.nango, data)
  }
}
