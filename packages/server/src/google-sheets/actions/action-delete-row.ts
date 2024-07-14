import type { Nango } from '@nangohq/node'
import { BASIC_URL_PREFIX, PROVIDER_CONFIG_KEY } from '../constants'
import { findConnectionCredentials } from './common'

export interface DeleteSheetRowParams {
  connectionId: string
  spreadsheetId: string
  sheetId: number
  rowId: string
}

export async function deleteSheetRow(nango: Nango, { spreadsheetId, connectionId, sheetId, rowId }: DeleteSheetRowParams) {
  const credentials = await findConnectionCredentials(nango, connectionId)
  const accessToken = credentials.access_token

  const adjustedRowIndex = (Number(rowId) || 1) - 1

  const res = await nango.proxy({
    baseUrlOverride: BASIC_URL_PREFIX,
    endpoint: `/v4/spreadsheets/${spreadsheetId}/:batchUpdate`,
    method: 'post',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    connectionId,
    data: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: adjustedRowIndex,
              endIndex: adjustedRowIndex + 1,
            },
          },
        },
      ],
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return {
    success: true,
    body: res.data,
  }
}
