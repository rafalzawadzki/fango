'use server'

import { fangoServer } from '@/lib/fango/server'

export async function insertSheetRowAction(data: any) {
  return fangoServer.googleSheetServer.insertSheetRow(data)
}

export async function findSheetRowAction(data: any) {
  return fangoServer.googleSheetServer.findSheetRow(data)
}

export async function updateSheetRowAction(data: any) {
  return fangoServer.googleSheetServer.updateSheetRow(data)
}

export async function deleteSheetRowAction(data: any) {
  return fangoServer.googleSheetServer.deleteSheetRow(data)
}

export async function findSheetsAction(data: any) {
  return fangoServer.googleSheetServer.findSheets(data)
}

export async function findSpreadsheetsAction(data: any) {
  return fangoServer.googleSheetServer.findSpreadsheets(data)
}

export async function findSheetNameAction(data: any) {
  return fangoServer.googleSheetServer.findSheetName(data)
}

export async function getSheetValuesAction(data: any) {
  return fangoServer.googleSheetServer.getSheetValues(data)
}
