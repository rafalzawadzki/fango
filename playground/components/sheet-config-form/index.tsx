'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ActionFormType } from '@/lib/schema'
import { ActionType, actionResolver } from '@/lib/schema'
import { CreateForm } from '@/lib/forms'
import type { CreateFormParams } from '@/lib/forms/type'
import { insertRowForm } from '@/lib/integration-forms/google-sheet/form-insert-row'
import { updateRowForm } from '@/lib/integration-forms/google-sheet/form-update-row'
import { deleteRowForm } from '@/lib/integration-forms/google-sheet/form-delete-row'
import { findRowForm } from '@/lib/integration-forms/google-sheet/form-find-row'

export default function SheetConfigForm() {
  const form = useForm<ActionFormType>({
    resolver: actionResolver,
    defaultValues: {
      action: ActionType.InsertRow,
    },
  })

  const [currentFormConfig, setCurrentFormConfig] = useState<CreateFormParams>(insertRowForm)

  const handleActionChange = (action: ActionType) => {
    switch (action) {
      case ActionType.InsertRow:
        setCurrentFormConfig(insertRowForm)
        break
      case ActionType.UpdateRow:
        setCurrentFormConfig(updateRowForm)
        break
      case ActionType.DeleteRow:
        setCurrentFormConfig(deleteRowForm)
        break
      case ActionType.FindRows:
        setCurrentFormConfig(findRowForm)
        break
    }
  }

  return (
    <div className="w-full space-y-8">
      <Form {...form}>
        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleActionChange(value as ActionType)
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ActionType.InsertRow}>Insert Row</SelectItem>
                    <SelectItem value={ActionType.UpdateRow}>Update Row</SelectItem>
                    <SelectItem value={ActionType.DeleteRow}>Delete Row</SelectItem>
                    <SelectItem value={ActionType.FindRows}>Find Rows</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <CreateForm {...currentFormConfig} />
    </div>
  )
}
