import { getCommonField } from './form-common'
import { FormItemFactory } from '@/forms'
import type { CreateFormParams } from '@/types/form'
import { PROVIDER_CONFIG_KEY } from './constants'
import type { LocoClient } from '@/client'

export function getFindRowForm(locoClient: LocoClient): CreateFormParams {
  const actions = locoClient.actions.get('google-sheet') as any
  const commonField = getCommonField(locoClient)
  const { findSheetNameAction, findSheetRowAction, getSheetValuesAction } = actions
  return {
    name: 'Find Row',
    providerConfigKey: PROVIDER_CONFIG_KEY,
    fields: [
      commonField.auth,
      commonField.connectionId,
      commonField.spreadsheetId,
      commonField.includeTeamDrives,
      commonField.sheetId,
      FormItemFactory.Select({
        locoClient,
        fieldName: 'columnName',
        label: 'The name of the column to search in',
        showSearch: true,
        refreshers: ['spreadsheetId', 'sheetId'],
        placeholder: 'Select a column name',
        options: async (deps, { form, field }) => {
          const [spreadsheetId, sheetId] = deps || []
          const connectionId = form.getValues('connectionId' as any)
          if (field.value) {
            field.onChange('')
          }
          if (
            (spreadsheetId ?? '').toString().length === 0
            || (sheetId ?? '').toString().length === 0
          ) {
            return {
              disabled: true,
              options: [],
              placeholder: 'Please select a sheet first',
            }
          }

          const sheetName = await findSheetNameAction({
            spreadsheetId,
            sheetId,
            connectionId,
          })

          if (!sheetName) {
            throw new Error('Sheet not found in spreadsheet')
          }

          const values: {
            row: number
            values: {
              [x: string]: string[]
            }[]
          }[] = await getSheetValuesAction({
            sheetId,
            spreadsheetId,
            connectionId,
          })

          const ret = []

          const firstRow = values[0].values
          const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

          if (firstRow.length === 0) {
            let columnSize = 1

            for (const row of values) {
              columnSize = Math.max(columnSize, row.values.length)
            }

            for (let i = 0; i < columnSize; i++) {
              ret.push({
                label: alphabet[i].toUpperCase(),
                value: alphabet[i],
              })
            }
          }
          else {
            let index = 0
            for (const key in firstRow) {
              let value = 'A'
              if (index >= alphabet.length) {
                // if the index is greater than the length of the alphabet, we need to add another letter
                const firstLetter
                  = alphabet[Math.floor(index / alphabet.length) - 1]
                const secondLetter = alphabet[index % alphabet.length]
                value = firstLetter + secondLetter
              }
              else {
                value = alphabet[index]
              }

              ret.push({
                label: firstRow[key].toString(),
                value,
              })
              index++
            }
          }
          return {
            options: ret,
            disabled: false,
          }
        },
      }),
      FormItemFactory.Input({
        locoClient,
        fieldName: 'searchValue',
        label: 'Search Value',
        tip: 'The value to search for in the specified column. If left empty, all rows will be returned.',
      }),
      FormItemFactory.Switch({
        locoClient,
        fieldName: 'matchCase',
        label: 'Exact match',
        tip: 'Whether to choose the rows with exact match or choose the rows that contain the search value',
      }),
      FormItemFactory.Input({
        locoClient,
        fieldName: 'startingRow',
        label: 'Starting Row',
        tip: 'The row number to start searching from',
      }),
      FormItemFactory.Input({
        locoClient,
        fieldName: 'numberOfRows',
        label: 'Number of Rows',
        tip: 'The number of rows to return ( the default is 1 if not specified )',
      }),
    ],
    run: async (values: any) => {
      const res = await findSheetRowAction({
        spreadsheetId: values.spreadsheetId,
        sheetId: Number(values.sheetId),
        connectionId: values.connectionId,
        startingRow: values.startingRow,
        numberOfRows: values.numberOfRows,
        columnName: values.columnName,
        searchValue: values.searchValue,
        matchCase: values.matchCase,
      })
      return res
    },
  }
}
