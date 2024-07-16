import type { Nango } from '@nangohq/node'
import { Dimension, ValueInputOption } from '../enums'
import { BASIC_URL_PREFIX, PROVIDER_CONFIG_KEY } from '../constants'
import { findConnectionCredentials, findSheetName } from './common'

export interface InsertSheetRowParams {
  connectionId: string
  spreadsheetId: string
  sheetId: number
  values: any[]
  asString?: boolean
}

export async function insertSheetRow(
  nango: Nango,
  {
    spreadsheetId,
    sheetId,
    connectionId,
    values,
    asString,
  }: InsertSheetRowParams,
) {
  const credentials = await findConnectionCredentials(nango, connectionId)
  const valueInputOption = asString
    ? ValueInputOption.RAW
    : ValueInputOption.USER_ENTERED
  const range = await findSheetName(nango, {
    sheetId,
    spreadsheetId,
    connectionId,
    accessToken: credentials.access_token,
  })
  const requestBody = {
    majorDimension: Dimension.COLUMNS,
    range: `${range}!A:A`,
    values: values.map((val: any) => ({ values: val })),
  }

  const res = await nango.proxy({
    baseUrlOverride: BASIC_URL_PREFIX,
    endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${range}!A:A:append`,
    method: 'post',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    connectionId,
    data: requestBody,
    params: {
      valueInputOption,
    },
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
    },
  })

  const updatedRangeParts = res.data.updates.updatedRange.split('!')
  const updatedRowRange = updatedRangeParts[1]
  const updatedRowNumber = Number.parseInt(
    updatedRowRange.split(':')[0].substring(1),
    10,
  )

  return { ...res.data, row: updatedRowNumber }
}
