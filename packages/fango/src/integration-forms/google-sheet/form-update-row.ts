import { commonField } from './form-common'
import { updateSheetRowAction } from '@/action/google-sheets'
import type { CreateFormParams } from '@/forms/type'
import { PROVIDER_CONFIG_KEY } from '@/nango/google-sheets/constants'

export const updateRowForm: CreateFormParams = {
  name: 'Update Row',
  providerConfigKey: PROVIDER_CONFIG_KEY,
  fields: [
    commonField.auth,
    commonField.connectionId,
    commonField.spreadsheetId,
    commonField.includeTeamDrives,
    commonField.sheetId,
    commonField.rowId,
    commonField.firstRowHeaders,
    commonField.values,
  ],
  run: async (data: any) => {
    const { spreadsheetId, connectionId, sheetId, values, rowId, firstRowHeaders } = data
    const res = await updateSheetRowAction({
      spreadsheetId,
      connectionId,
      sheetId: Number(sheetId),
      values: values || [],
      rowId,
      firstRowHeaders,
    })
    return res
  },
}
