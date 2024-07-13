import { findSheetsAction, findSpreadsheetsAction, getSheetValuesAction } from "@/action/google-sheets";
import { FormItemFactory } from "@/lib/forms";

export const commonField = {
  auth: FormItemFactory.Switch({
    fieldName: 'auth',
    label: 'Auth',
    hidden: true,
    cache: true
  }),
  connectionId: FormItemFactory.Connection({
    fieldName: 'connectionId',
    label: 'Connection',
    required: true,
    cache: true,
  }),
  spreadsheetId: FormItemFactory.Select({
    fieldName: 'spreadsheetId',
    label: 'Spreadsheet ID',
    required: true,
    cache: true,
    showSearch: true,
    placeholder: "Select a spreadsheet",
    refreshers: ['connectionId', 'includeTeamDrives'],
    options: async (deps, { form, field }) => {
      const auth = form.getValues('auth' as any)
      if (field.value) {
        field.onChange('')
      }
      const [connectionId, includeTeamDrives] = deps || []
      if (!auth || !connectionId)
        return {
          options: [],
          placeholder: 'Please authenticate first'
        }

      const res = await findSpreadsheetsAction({ connectionId, includeTeamDrives })
      const options = res.map((sheet: any) => ({ value: sheet.id, label: sheet.name }))
      return {
        options,
        disabled: false,
      }
    }
  }),
  includeTeamDrives: FormItemFactory.Switch({
    fieldName: 'includeTeamDrives',
    label: 'Include Team Drive Sheets',
    tip: 'Determines if sheets from Team Drives should be included in the results.',
    cache: true
  }),
  sheetId: FormItemFactory.Select({
    fieldName: 'sheetId',
    label: 'Sheet',
    required: true,
    cache: true,
    showSearch: true,
    refreshers: ['connectionId', 'spreadsheetId'],
    placeholder: 'Select a sheet',
    options: async (deps, { field }) => {
      const [connectionId, spreadsheetId] = deps || []
      if (field.value) {
        field.onChange('')
      }
      if (!connectionId || !spreadsheetId) return {
        options: [],
        placeholder: 'Please select a spreadsheet first'
      }

      const res = await findSheetsAction({ connectionId, spreadsheetId })
      const options = res.map((sheet: any) => ({ value: sheet.properties.sheetId, label: sheet.properties.title }))
      return {
        options,
        disabled: false,
      }
    }
  }),
  values: FormItemFactory.ValueList({
    fieldName: 'values',
    label: 'Values',
    refreshers: ['sheetId', 'spreadsheetId', 'firstRowHeaders'],
    options: async (deps, { form, field }) => {
      if ((field.value && field.value.length) || !field.value) {
        field.onChange([])
      }
      const auth = form.getValues('auth')
      const [sheetId, spreadsheetId, firstRowHeaders] = deps || []
      if (!auth || !sheetId || !spreadsheetId)
        return {
          options: [],
          disabled: false,
          couldAdd: false,
        }
      const connectionId = form.getValues('connectionId')

      const values = await getSheetValuesAction({ sheetId, spreadsheetId, connectionId })

      if (!firstRowHeaders) {
        return {
          options: [
            {
              label: '',
              value: ''
            }
          ],
          disabled: false,
          couldAdd: true,
        };
      }
      const firstRow = values?.[0]?.values ?? [];
      const options = []
      for (const key in firstRow) {
        options.push({
          value: '',
          label: firstRow[key].toString()
        })
      }
      return {
        options,
        disabled: false,
        couldAdd: false,
      }
    }
  }),
  rowId: FormItemFactory.Input({
    fieldName: 'rowId',
    label: 'Row Number',
    tip: 'The row number to remove',
    required: true
  }),
  firstRowHeaders: FormItemFactory.Switch({
    fieldName: 'firstRowHeaders',
    label: 'Does the first row contain headers?',
    tip: 'If the first row is headers',
  }),
}