import { commonField } from './form-common'
import { insertSheetRowAction } from '@/action/google-sheets'
import { FormItemFactory } from '@/lib/forms'
import type { CreateFormParams } from '@/lib/forms/type'
import { PROVIDER_CONFIG_KEY } from '@/lib/nango/google-sheets/constants'

export const insertRowForm: CreateFormParams = {
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
    const res = await insertSheetRowAction({
      spreadsheetId: values.spreadsheetId,
      sheetId: Number(values.sheetId),
      connectionId: values.connectionId,
      asString: values.asString,
      values: values.values || [],
    })
    return res
  },
}
