'use server'

import { deleteSheetRow, findSheetName, findSheetRow, findSheets, findSpreadsheets, getSheetValues, insertSheetRow, updateSheetRow } from '@/lib/nango/google-sheets/actions'
import type { DeleteSheetRowParams, FindSheetNameParams, FindSheetRowParams, FindSheetsParams, FindSpreadsheetsParams, GetSheetValuesParams, InsertSheetRowParams, UpdateSheetRowParams } from '@/lib/nango/google-sheets/actions'

export const insertSheetRowAction = async (data: InsertSheetRowParams) => insertSheetRow(data)

export const findSheetRowAction = async (data: FindSheetRowParams) => findSheetRow(data)

export const updateSheetRowAction = async (data: UpdateSheetRowParams) => updateSheetRow(data)

export const deleteSheetRowAction = async (data: DeleteSheetRowParams) => deleteSheetRow(data)

export const findSheetsAction = async (data: FindSheetsParams) => findSheets(data)

export const findSpreadsheetsAction = async (data: FindSpreadsheetsParams) => findSpreadsheets(data)

export const findSheetNameAction = async (data: FindSheetNameParams) => findSheetName(data)

export const getSheetValuesAction = async (data: GetSheetValuesParams) => getSheetValues(data)
