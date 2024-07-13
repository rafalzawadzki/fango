import { commonField } from './form-common'
import { deleteSheetRowAction } from '@/action/google-sheets'
import { CreateFormParams } from '@/lib/forms/type'
import { PROVIDER_CONFIG_KEY } from '@/lib/nango/google-sheets/constants'

export const deleteRowForm: CreateFormParams = {
  name: 'Delete Row',
  providerConfigKey: PROVIDER_CONFIG_KEY,
  fields: [
    commonField.auth,
    commonField.connectionId,
    commonField.spreadsheetId,
    commonField.includeTeamDrives,
    commonField.sheetId,
    commonField.rowId,
  ],
  run: async (values: any) => {
    const { spreadsheetId, connectionId, sheetId, rowId } = values
    const res = await deleteSheetRowAction({
      spreadsheetId,
      connectionId,
      sheetId: Number(sheetId),
      rowId,
    })
    return res
  },
}
