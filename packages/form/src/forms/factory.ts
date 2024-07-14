import type { FormItemConfigParams, FormItemControlParams } from '../types/form'
import { FormItemType } from './enums'
import { ConnectionForm, InputForm, Markdown, SelectForm, SwitchForm, ValueListForm } from './items'

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
