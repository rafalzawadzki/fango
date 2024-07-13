import { getCommonField } from './form-common'
import { PROVIDER_CONFIG_KEY } from '@/servers/google-sheets/constants'
import type { CreateFormParams } from '@/types/form'
import type { GoogleSheetAction } from '@/types/action'

export const getDeleteRowForm: (actions: GoogleSheetAction) => CreateFormParams = (actions) => {
  const commonField = getCommonField(actions)
  return {
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
      const res = await actions.deleteSheetRowAction({
        spreadsheetId,
        connectionId,
        sheetId: Number(sheetId),
        rowId,
      })
      return res
    },
  }
}
