import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ConnectionType } from '@fango/client'
import { getInsertRowForm } from './google-sheets/form-insert-row'
import { getUpdateRowForm } from './google-sheets/form-update-row'
import { getDeleteRowForm } from './google-sheets/form-delete-row'
import { getFindRowForm } from './google-sheets/form-find-row'
import { getSendMessageForm } from './slack/form-send-message'

export enum GoogleSheetFormType {
  InsertRow = '1',
  UpdateRow = '2',
  DeleteRow = '3',
  FindRows = '4',
}

export const GoogleSheetFormList = [
  {
    value: GoogleSheetFormType.InsertRow,
    label: 'Insert Row',
  },
  {
    value: GoogleSheetFormType.UpdateRow,
    label: 'Update Row',
  },
  {
    value: GoogleSheetFormType.DeleteRow,
    label: 'Delete Row',
  },
  {
    value: GoogleSheetFormType.FindRows,
    label: 'Find Rows',
  },
]

export enum SlackFormType {
  SendMessage = '1',
}

export const SlackFormList = [
  {
    value: SlackFormType.SendMessage,
    label: 'Send Message To Channel',
  },
]

export type FormType = GoogleSheetFormType | SlackFormType

export interface FormTypeMap {
  'google-sheets': GoogleSheetFormType
  slack: SlackFormType
}

export const actionSchema = z.object({
  action: z.string(),
})
export type ActionFormType = z.infer<typeof actionSchema>
export const actionResolver = zodResolver(actionSchema)

export function normalizeFormList<T extends ConnectionType>(
  type: T,
  forms?: Array<{
    value: FormTypeMap[T]
    label: string
  }>,
) {
  if (type === 'google-sheets') {
    return forms || GoogleSheetFormList
  }

  if (type === 'slack') {
    return forms || SlackFormList
  }
}

export function getFormConfigFuncByAction(
  type: ConnectionType,
  action: FormType,
) {
  if (type === 'google-sheets') {
    switch (action) {
      case GoogleSheetFormType.InsertRow:
        return getInsertRowForm
      case GoogleSheetFormType.UpdateRow:
        return getUpdateRowForm
      case GoogleSheetFormType.DeleteRow:
        return getDeleteRowForm
      case GoogleSheetFormType.FindRows:
        return getFindRowForm
    }
  }

  if (type === 'slack') {
    switch (action) {
      case SlackFormType.SendMessage:
        return getSendMessageForm
    }
  }
}
