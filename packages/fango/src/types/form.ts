import type { UseFormReturn } from 'react-hook-form'
import type { FormItemType } from '../forms/enums'

export interface ConnectionType {
  id: string
  name: string
}

export interface SelectOption {
  value: string
  label: string
}

export interface OptionsConfig {
  disabled?: boolean
  placeholder?: string
  options: SelectOption[]
  couldAdd?: boolean
}

export interface FormItemControlParams {
  form: UseFormReturn<any>
  field: {
    name: string
    value: any
    onChange: (value: any) => void
  }
  authConfig?: Record<string, any>
  providerConfigKey: string
}

export interface OptionsParams {
  form: UseFormReturn<any>
  field: {
    name: string
    value: any
    onChange: (value: any) => void
  }
  searchValue?: string
}

export interface FormItemConfigParams {
  fieldName: string
  label: string
  required?: boolean
  cache?: boolean
  hidden?: boolean
  tip?: string
  refreshers?: string[]
  placeholder?: string
  showSearch?: boolean
  options?: ((deps: any[], options: OptionsParams) => Promise<OptionsConfig>) | OptionsConfig
}

export type FormItemConfig = FormItemConfigParams & FormItemControlParams

export interface FormItemField extends FormItemConfigParams {
  type: FormItemType
  control: (config: FormItemControlParams) => JSX.Element
}

export interface CreateFormParams {
  name: string
  fields: FormItemField[]
  providerConfigKey: string
  authConfig?: Record<string, any>
  run: (values: Record<string, any>) => Promise<any>
  onSave?: (values: Record<string, any>) => Promise<any>
}
