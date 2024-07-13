import { getCommonField } from './form-common'
import { FormItemFactory } from '@/forms'
import type { CreateFormParams } from '@/types/form'
import { PROVIDER_CONFIG_KEY } from '@/servers/google-sheets/constants'
import type { GoogleSheetAction } from '@/types/action'

export function getInsertRowForm(actions: GoogleSheetAction): CreateFormParams {
  const commonField = getCommonField(actions)
  return {
    name: 'Insert Row',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    fields: [
      commonField.auth,
      commonField.connectionId,
      commonField.spreadsheetId,
      commonField.includeTeamDrives,
      commonField.sheetId,
      FormItemFactory.Switch({
        fieldName: 'asString',
        label: 'As String',
        tip: 'Inserted values that are dates and formulas will be entered strings and have no effect',
      }),
      commonField.firstRowHeaders,
      commonField.values,
    ],
    run: async (values: any) => {
      const res = await actions.insertSheetRowAction({
        spreadsheetId: values.spreadsheetId,
        sheetId: Number(values.sheetId),
        connectionId: values.connectionId,
        asString: values.asString,
        values: values.values || [],
      })
      return res
    },
  }
}
