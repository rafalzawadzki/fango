import { nango } from "@/lib/nango/common/nango-node";
import { columnToLabel } from "@/lib/nango/google-sheets/utils";
import { OAuth2Credentials } from "@nangohq/node";
import { BASIC_URL_PREFIX, PROVIDER_CONFIG_KEY } from "../constants";

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

export const findConnectionCredentials = async (connectionId: string) => {
  const connectionConfig = await nango.getConnection(PROVIDER_CONFIG_KEY, connectionId)
  return connectionConfig.credentials as OAuth2Credentials
}

export const findSpreadsheets = async ({
  connectionId,
  searchValue,
  includeTeamDrives
}: FindSpreadsheetsParams) => {
  if (!connectionId) {
    throw new Error('Connection ID is required')
  }
  const credentials = await findConnectionCredentials(connectionId)
  const queries = ["mimeType='application/vnd.google-apps.spreadsheet'", "trashed=false"];
  if (searchValue) {
    queries.push(`name contains '${searchValue}'`);
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
      Authorization: `Bearer ${credentials.access_token}`
    }
  })
  return res.data?.files || []
}

export const findSheets = async ({ spreadsheetId, connectionId, accessToken }: FindSheetsParams) => {
  let access_token = accessToken;
  if (!accessToken) {
    const credentials = await findConnectionCredentials(connectionId)
    access_token = credentials.access_token;
  }
  const res = await nango.proxy({
    baseUrlOverride: BASIC_URL_PREFIX,
    endpoint: '/v4/spreadsheets/' + spreadsheetId,
    method: 'get',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    connectionId,
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
  return res.data?.sheets || []
}

export const findSheetName = async ({ sheetId, spreadsheetId, connectionId, accessToken }: FindSheetNameParams) => {
  const sheets = await findSheets({ spreadsheetId, connectionId, accessToken });
  const sheetName = sheets.find((f: any) => f.properties.sheetId === Number(sheetId))?.properties.title;
  if (!sheetName) {
    throw Error(`Sheet with ID ${sheetId} not found in spreadsheet ${spreadsheetId}`);
  }
  return sheetName;
}

export const getSheetValues = async ({ spreadsheetId, sheetId, connectionId }: GetSheetValuesParams) => {
  const credentials = await findConnectionCredentials(connectionId)
  const accessToken = credentials.access_token;
  const sheetName = await findSheetName({ spreadsheetId, sheetId, connectionId, accessToken });
  if (!sheetName) {
    return [];
  }
  const response = await nango.proxy({
    baseUrlOverride: BASIC_URL_PREFIX,
    endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${sheetName}`,
    method: 'get',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    connectionId,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (response.data.values === undefined) return [];

  const values = response.data.values;
  const res = [];
  for (let i = 0; i < values.length; i++) {
    const data: any = {};
    for (let j = 0; j < values[i].length; j++) {
      data[columnToLabel(j)] = values[i][j];
    }
    res.push({
      row: i + 1,
      values: data,
    });
  }

  return res;
}
