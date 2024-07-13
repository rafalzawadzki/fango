import { BASIC_URL_PREFIX, PROVIDER_CONFIG_KEY } from '../constants'
import { findConnectionCredentials, findSheetName } from './common'
import { nango } from '@/nango/common/nango-node'
import { columnToLabel, labelToColumn } from '@/nango/google-sheets/utils'

export interface FindSheetRowParams {
  connectionId: string
  spreadsheetId: string
  sheetId: number
  matchCase?: boolean
  startingRow?: string
  numberOfRows?: string
  columnName?: string
  searchValue?: string
}

export async function findSheetRow({
  sheetId,
  spreadsheetId,
  connectionId,
  startingRow,
  numberOfRows,
  matchCase,
  columnName: cn,
  searchValue: sv,
}: FindSheetRowParams) {
  const credentials = await findConnectionCredentials(connectionId)
  const accessToken = credentials.access_token

  const sheetName = await findSheetName({
    sheetId,
    spreadsheetId,
    connectionId,
    accessToken,
  })

  const starting = (startingRow === '' || startingRow === undefined) ? 1 : Number(startingRow)
  const numberOfRowsToReturn = (numberOfRows === '' || numberOfRows === undefined) ? 1 : Number(numberOfRows)

  const newSheetName = `${sheetName}!A${starting}:ZZZ`

  const response = await nango.proxy({
    baseUrlOverride: BASIC_URL_PREFIX,
    endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${newSheetName}`,
    method: 'get',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    connectionId,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = response.data.values

  if (!data)
    return []

  let rows = []
  for (let i = 0; i < data.length; i++) {
    const values: any = {}
    for (let j = 0; j < data[i].length; j++) {
      values[columnToLabel(j)] = data[i][j]
    }

    rows.push({
      row: i + 1,
      values,
    })
  }
  rows = rows.map((row) => {
    return {
      row: row.row + starting - 1,
      values: row.values,
    }
  })

  const values = rows.map((row) => {
    return row.values
  })

  const matchingRows: any[] = []
  const columnName = cn || 'A'
  const columnNumber = labelToColumn(columnName)
  const searchValue = sv ?? ''

  let matchedRowCount = 0

  for (let i = 0; i < values.length; i++) {
    const row = values[i]

    if (matchedRowCount === numberOfRowsToReturn)
      break

    if (searchValue === '') {
      matchingRows.push(rows[i])
      matchedRowCount += 1
      continue
    }

    const keys = Object.keys(row)
    if (keys.length <= columnNumber)
      continue
    const entry_value = row[keys[columnNumber]]

    if (entry_value === undefined) {
      continue
    }
    if (matchCase) {
      if (entry_value === searchValue) {
        matchedRowCount += 1
        matchingRows.push(rows[i])
      }
    }
    else {
      if (entry_value.toLowerCase().includes(searchValue.toLowerCase())) {
        matchedRowCount += 1
        matchingRows.push(rows[i])
      }
    }
  }

  return matchingRows
}
