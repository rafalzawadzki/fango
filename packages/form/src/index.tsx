import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { CreateFormParams } from './types/form'
import type { ActionFormType, FormType } from '@/integration-config'
import { actionResolver, getFormConfigFuncByAction, normalizeFormList } from '@/integration-config'
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
import { CreateForm } from '@/forms'
import type { ConnectionType } from '@/types/connection'

export interface LocoFormParams {
  type: ConnectionType
  locoClient: any
  defaultForm?: FormType
  forms?: Array<{
    value: FormType
    label: string
  }>
  onSubmit?: (data: any) => Promise<void>
}

export function LocoForm({
  type,
  locoClient,
  forms,
  defaultForm,
  onSubmit,
}: LocoFormParams) {
  const formList = normalizeFormList(type, forms)!
  const defaultAction = defaultForm || formList[0].value
  const formConfigFunc = getFormConfigFuncByAction(type, defaultAction)
  if (!formConfigFunc) {
    throw new Error(`Form config function not found for action: ${defaultAction}`)
  }
  const defaultFormConfig = formConfigFunc(locoClient)

  const form = useForm<ActionFormType>({
    resolver: actionResolver,
    defaultValues: {
      action: defaultAction,
    },
  })

  const [currentFormConfig, setCurrentFormConfig] = useState<CreateFormParams>(defaultFormConfig)

  const handleActionChange = (action: FormType) => {
    const formConfigFunc = getFormConfigFuncByAction(type, action)
    if (formConfigFunc) {
      setCurrentFormConfig(formConfigFunc(locoClient))
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
                    handleActionChange(value as FormType)
                  }}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                  <SelectContent>
                    {
                      formList.map(form => (
                        <SelectItem key={form.value} value={form.value}>
                          {form.label}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
      <CreateForm {...currentFormConfig} onSave={onSubmit} />
    </div>
  )
}
