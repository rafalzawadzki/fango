import type { FormItemConfig } from '../../types/form'
import { Input } from '@/components/ui/input'

export function InputForm({ field, tip, placeholder }: FormItemConfig) {
  return (
    <div>
      <Input {...field} className="w-full" placeholder={placeholder} />
      {!!tip && <div className="mt-1 text-muted-foreground text-sm">{tip}</div>}
    </div>
  )
}
