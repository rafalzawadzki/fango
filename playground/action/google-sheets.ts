'use server'

import { locoServer } from '@/lib/fango/server'

export async function insertSheetRowAction(data: any) {
  return locoServer.googleSheetServer.insertSheetRow(data)
}

export async function findSheetRowAction(data: any) {
  return locoServer.googleSheetServer.findSheetRow(data)
}

export async function updateSheetRowAction(data: any) {
  return locoServer.googleSheetServer.updateSheetRow(data)
}

export async function deleteSheetRowAction(data: any) {
  return locoServer.googleSheetServer.deleteSheetRow(data)
}

export async function findSheetsAction(data: any) {
  return locoServer.googleSheetServer.findSheets(data)
}

export async function findSpreadsheetsAction(data: any) {
  return locoServer.googleSheetServer.findSpreadsheets(data)
}

export async function findSheetNameAction(data: any) {
  return locoServer.googleSheetServer.findSheetName(data)
}

export async function getSheetValuesAction(data: any) {
  return locoServer.googleSheetServer.getSheetValues(data)
}
