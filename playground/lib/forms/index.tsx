import { useEffect, useMemo, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { FormItemType } from './enums'
import { ConnectionForm, InputForm, Markdown, SelectForm, SwitchForm, ValueListForm } from './items'
import type { CreateFormParams, FormItemConfigParams, FormItemControlParams } from './type'
import { generateSchema } from './schema'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const getCacheKey = (providerConfigKey: string, name: string) => `${providerConfigKey}:form-cache:${name}`

function getFormControl(type: FormItemType) {
  switch (type) {
    case FormItemType.SWITCH:
      return SwitchForm
    case FormItemType.CONNECTION:
      return ConnectionForm
    case FormItemType.SELECT:
      return SelectForm
    case FormItemType.VALUE_LIST:
      return ValueListForm
    case FormItemType.INPUT:
      return InputForm
    case FormItemType.MARKDOWN:
      return Markdown
    default:
      return InputForm
  }
}

function createFormItem(config: FormItemConfigParams, type: FormItemType) {
  const formControl = getFormControl(type)
  return {
    ...config,
    type,
    control: (controlConfig: FormItemControlParams) => formControl({
      ...config,
      ...controlConfig,
    }),
  }
}

export const FormItemFactory = {
  Connection: (config: FormItemConfigParams) => createFormItem(config, FormItemType.CONNECTION),
  Switch: (config: FormItemConfigParams) => createFormItem(config, FormItemType.SWITCH),
  Select: (config: FormItemConfigParams) => createFormItem(config, FormItemType.SELECT),
  ValueList: (config: FormItemConfigParams) => createFormItem(config, FormItemType.VALUE_LIST),
  Input: (config: FormItemConfigParams) => createFormItem(config, FormItemType.INPUT),
  Markdown: (config: FormItemConfigParams) => createFormItem(config, FormItemType.MARKDOWN),
}

export function CreateForm({ fields, run, providerConfigKey, authConfig }: CreateFormParams) {
  const { schema, resolver } = generateSchema(fields)
  const formFields = fields.filter(field => !field.hidden)

  const form = useForm<z.infer<typeof schema>>({ resolver })

  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<any>()

  const cachedFields = useMemo(() => {
    return fields.filter(field => !!field.cache).map(field => field.fieldName)
  }, [fields])

  useEffect(() => {
    if (cachedFields.length) {
      cachedFields.forEach((name) => {
        const cachedValue = sessionStorage.getItem(getCacheKey(providerConfigKey, name))
        if (typeof cachedValue === 'string') {
          form.setValue(name, JSON.parse(cachedValue), { shouldTouch: true })
        }
      })
    }
  }, [cachedFields, form, providerConfigKey])

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && name && cachedFields.includes(name)) {
        // sessionStorage or controlled by outer form
        sessionStorage.setItem(getCacheKey(providerConfigKey, name), JSON.stringify(value[name]))
      }
    })
    return () => subscription.unsubscribe()
  }, [cachedFields, form, form.watch, providerConfigKey])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true)
    try {
      const res = await run(values)
      setRes(res)
    }
    catch (e: any) {
      const message = e.message
      setRes({ error: { message } })
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {
          formFields.map((formField) => {
            return (
              <FormField
                key={formField.fieldName}
                control={form.control}
                name={formField.fieldName}
                render={({ field }) => (
                  <FormItem>
                    {
                      formField.type !== FormItemType.SWITCH
                      && formField.label
                      && (
                        <FormLabel>
                          {formField.label}
                          {' '}
                        </FormLabel>
                      )
                    }
                    <FormControl>
                      {
                        formField.control({
                          field,
                          form,
                          providerConfigKey,
                          authConfig,
                        })
                      }
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          })
        }
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <LoaderCircle size={32} className="animate-spin" /> : 'Submit'}
        </Button>
      </form>
      {
        !!res && (
          <pre className="prose lg:prose-xl mt-2 p-2 w-full text-sky-600 overflow-auto border rounded-sm">
            {JSON.stringify(res, null, 2)}
          </pre>
        )
      }
    </Form>
  )
}
