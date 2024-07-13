import { getCommonField } from './form-common'
import type { CreateFormParams } from '@/types/form'
import { PROVIDER_CONFIG_KEY } from '@/servers/google-sheets/constants'
import type { GoogleSheetAction } from '@/types/action'

export function getUpdateRowForm(actions: GoogleSheetAction): CreateFormParams {
  const commonField = getCommonField(actions)
  return {
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
      const res = await actions.updateSheetRowAction({
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
}