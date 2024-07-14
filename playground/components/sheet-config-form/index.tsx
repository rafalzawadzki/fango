'use client'

import { LocoForm } from '../../../packages/client/dist/form'
import { locoClient } from '@/lib/fango/client'
import { deleteSheetRowAction, findSheetNameAction, findSheetRowAction, findSpreadsheetsAction, getSheetValuesAction, insertSheetRowAction, updateSheetRowAction } from '@/action/google-sheets'

export default function SheetConfigForm() {
  findSpreadsheetsAction({})
  locoClient.setServerActions('google-sheet', {
    insertSheetRowAction,
    findSheetRowAction,
    updateSheetRowAction,
    deleteSheetRowAction,
    findSheetsAction: findSheetRowAction,
    findSpreadsheetsAction,
    findSheetNameAction,
    getSheetValuesAction,
  })

  return (
    <LocoForm
      type="google-sheet"
      locoClient={locoClient}
    />
  )
}
