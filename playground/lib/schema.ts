import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export enum ActionType {
  InsertRow = '1',
  UpdateRow = '2',
  DeleteRow = '3',
  FindRows = '4',
}

export const actionSchema = z.object({
  action: z.enum([ActionType.InsertRow, ActionType.UpdateRow, ActionType.DeleteRow, ActionType.FindRows], {
    message: 'Please select an action',
  }),
})
export type ActionFormType = z.infer<typeof actionSchema>
export const actionResolver = zodResolver(actionSchema)
