'use client'

import { LocoForm } from '@fango/client'
import { locoClient } from '@/lib/fango/client'
import { deleteSheetRowAction, findSheetNameAction, findSheetRowAction, findSheetsAction, findSpreadsheetsAction, getSheetValuesAction, insertSheetRowAction, updateSheetRowAction } from '@/action/google-sheets'

export default function SheetConfigForm() {
  locoClient.setServerActions('google-sheet', {
    insertSheetRowAction,
    findSheetRowAction,
    updateSheetRowAction,
    deleteSheetRowAction,
    findSheetsAction,
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
