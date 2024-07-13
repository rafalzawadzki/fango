import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormItemType } from './enums'
import type { FormItemField } from './type'

export function generateSchema(fields: FormItemField[]) {
  const schemaObj: { [key: string]: z.ZodType<any, any, any> } = {}
  fields.forEach((field) => {
    const { type, required, fieldName, label } = field
    if (!fieldName)
      return
    const message = `${label} is required`
    if (type === FormItemType.SWITCH) {
      schemaObj[fieldName] = z.boolean().optional()
    }
    else if (type === FormItemType.VALUE_LIST) {
      schemaObj[fieldName] = required
        ? z.array(z.string().min(1)).min(1, { message })
        : z.array(z.string()).optional()
    }
    else {
      schemaObj[fieldName] = required ? z.string({ message }).min(1) : z.string().optional()
    }
  })
  const schema = z.object(schemaObj)
  const resolver = zodResolver(schema)
  return { schema, resolver }
}
