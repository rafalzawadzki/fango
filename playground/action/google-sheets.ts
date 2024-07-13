"use server"

import { insertSheetRow, findSheetRow, updateSheetRow, deleteSheetRow, findSheets, findSpreadsheets, findSheetName, getSheetValues } from "@/lib/nango/google-sheets/actions"
import type { InsertSheetRowParams, FindSheetRowParams, UpdateSheetRowParams, DeleteSheetRowParams, FindSheetsParams, FindSpreadsheetsParams, FindSheetNameParams, GetSheetValuesParams } from "@/lib/nango/google-sheets/actions"

export const insertSheetRowAction = async (data: InsertSheetRowParams) => insertSheetRow(data)

export const findSheetRowAction = async (data: FindSheetRowParams) => findSheetRow(data)

export const updateSheetRowAction = async (data: UpdateSheetRowParams) => updateSheetRow(data)

export const deleteSheetRowAction = async (data: DeleteSheetRowParams) => deleteSheetRow(data)

export const findSheetsAction = async (data: FindSheetsParams) => findSheets(data)

export const findSpreadsheetsAction = async (data: FindSpreadsheetsParams) => findSpreadsheets(data)

export const findSheetNameAction = async (data: FindSheetNameParams) => findSheetName(data)

export const getSheetValuesAction = async (data: GetSheetValuesParams) => getSheetValues(data)
