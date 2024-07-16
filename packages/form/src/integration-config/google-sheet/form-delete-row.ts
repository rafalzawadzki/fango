import type { FangoClient } from '@fango/client'
import { getCommonField } from './form-common'
import { PROVIDER_CONFIG_KEY } from './constants'
import type { CreateFormParams } from '@/types/form'

export function getDeleteRowForm(fangoClient: FangoClient): CreateFormParams {
  const actions = fangoClient.actions.get('google-sheet') as any
  const commonField = getCommonField(fangoClient)
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
