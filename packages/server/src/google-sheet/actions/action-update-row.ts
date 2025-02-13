import type { Nango } from '@nangohq/node'
import { Dimension, ValueInputOption } from '../enums'
import { BASIC_URL_PREFIX, PROVIDER_CONFIG_KEY } from '../constants'
import { stringifyArray } from '../utils'
import { findConnectionCredentials, findSheetName } from './common'

export interface UpdateSheetRowParams {
  connectionId: string
  spreadsheetId: string
  sheetId: number
  values: string[]
  rowId: string
  firstRowHeaders?: boolean
}

export async function updateSheetRow(
  nango: Nango,
  { spreadsheetId, connectionId, sheetId, values, rowId }: UpdateSheetRowParams,
) {
  const credentials = await findConnectionCredentials(nango, connectionId)
  const accessToken = credentials.access_token

  const sheetName = await findSheetName(nango, {
    sheetId,
    spreadsheetId,
    connectionId,
    accessToken,
  })

  const formattedValues = values.map((value) => (value === '' ? null : value))
  if (formattedValues.length > 0) {
    const rowIndex = Number(rowId)
    values = stringifyArray(formattedValues)

    const requestBody = {
      majorDimension: Dimension.ROWS,
      range: `${sheetName}!A${rowIndex}:ZZZ${rowIndex}`,
      values: [values],
    }
    const res = await nango.proxy({
      baseUrlOverride: BASIC_URL_PREFIX,
      endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A${rowIndex}:ZZZ${rowIndex}`,
      method: 'put',
      providerConfigKey: PROVIDER_CONFIG_KEY,
      connectionId,
      data: requestBody,
      params: {
        valueInputOption: ValueInputOption.USER_ENTERED,
      },
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
      },
    })

    const updatedRangeParts = res.data.updatedRange.split('!')
    const updatedRowRange = updatedRangeParts[1]
    const updatedRowNumber = Number.parseInt(
      updatedRowRange.split(':')[0].substring(1),
      10,
    )

    return { updates: { ...res.data }, row: updatedRowNumber }
  } else {
    throw new Error(
      `Values passed are empty or not array ${JSON.stringify(formattedValues)}`,
    )
  }
}
