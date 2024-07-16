import { getCommonField } from './form-common'
import { FormItemFactory } from '@/forms'
import type { CreateFormParams } from '@/types/form'
import { PROVIDER_CONFIG_KEY } from './constants'
import type { FangoClient } from '@fango/client'

export function getInsertRowForm(fangoClient: FangoClient): CreateFormParams {
  const actions = fangoClient.actions.get('google-sheet') as any
  const commonField = getCommonField(fangoClient)
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
        fangoClient,
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
