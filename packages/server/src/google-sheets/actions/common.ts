import type { Nango, OAuth2Credentials } from '@nangohq/node'
import { BASIC_URL_PREFIX, PROVIDER_CONFIG_KEY } from '../constants'
import { columnToLabel } from '../utils'

export interface FindSpreadsheetsParams {
  connectionId: string
  searchValue?: string
  includeTeamDrives?: boolean
}

export interface FindSheetsParams {
  connectionId: string
  spreadsheetId: string
  accessToken?: string
}

export interface FindSheetNameParams {
  connectionId: string
  spreadsheetId: string
  sheetId: number
  accessToken?: string
}

export interface GetSheetValuesParams {
  connectionId: string
  spreadsheetId: string
  sheetId: number
}

export async function findConnectionCredentials(nango: Nango, connectionId: string) {
  const connectionConfig = await nango.getConnection(PROVIDER_CONFIG_KEY, connectionId)
  return connectionConfig.credentials as OAuth2Credentials
}

export async function findSpreadsheets(nango: Nango, {
  connectionId,
  searchValue,
  includeTeamDrives,
}: FindSpreadsheetsParams) {
  console.log('findSpreadsheets', connectionId, searchValue, includeTeamDrives)
  if (!connectionId) {
    throw new Error('Connection ID is required')
  }
  const credentials = await findConnectionCredentials(nango, connectionId)
  const queries = ['mimeType=\'application/vnd.google-apps.spreadsheet\'', 'trashed=false']
  if (searchValue) {
    queries.push(`name contains '${searchValue}'`)
  }
  const res = await nango.proxy({
    baseUrlOverride: 'https://www.googleapis.com',
    endpoint: '/drive/v3/files',
    method: 'get',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    connectionId,
    params: {
      q: queries.join(' and '),
      includeItemsFromAllDrives: includeTeamDrives ? 'true' : 'false',
      supportsAllDrives: 'true',
    },
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
    },
  })
  return res.data?.files || []
}

export async function findSheets(nango: Nango, { spreadsheetId, connectionId, accessToken }: FindSheetsParams) {
  let access_token = accessToken
  if (!accessToken) {
    const credentials = await findConnectionCredentials(nango, connectionId)
    access_token = credentials.access_token
  }
  const res = await nango.proxy({
    baseUrlOverride: BASIC_URL_PREFIX,
    endpoint: `/v4/spreadsheets/${spreadsheetId}`,
    method: 'get',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    connectionId,
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  return res.data?.sheets || []
}

export async function findSheetName(nango: Nango, { sheetId, spreadsheetId, connectionId, accessToken }: FindSheetNameParams) {
  const sheets = await findSheets(nango, { spreadsheetId, connectionId, accessToken })
  const sheetName = sheets.find((f: any) => f.properties.sheetId === Number(sheetId))?.properties.title
  if (!sheetName) {
    throw new Error(`Sheet with ID ${sheetId} not found in spreadsheet ${spreadsheetId}`)
  }
  return sheetName
}

export async function getSheetValues(nango: Nango, { spreadsheetId, sheetId, connectionId }: GetSheetValuesParams) {
  const credentials = await findConnectionCredentials(nango, connectionId)
  const accessToken = credentials.access_token
  const sheetName = await findSheetName(nango, { spreadsheetId, sheetId, connectionId, accessToken })
  if (!sheetName) {
    return []
  }
  const response = await nango.proxy({
    baseUrlOverride: BASIC_URL_PREFIX,
    endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${sheetName}`,
    method: 'get',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    connectionId,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.data.values === undefined)
    return []

  const values = response.data.values
  const res = []
  for (let i = 0; i < values.length; i++) {
    const data: any = {}
    for (let j = 0; j < values[i].length; j++) {
      data[columnToLabel(j)] = values[i][j]
    }
    res.push({
      row: i + 1,
      values: data,
    })
  }

  return res
}
