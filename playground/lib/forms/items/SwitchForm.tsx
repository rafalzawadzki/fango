import { FormItemConfig } from '../type'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export function SwitchForm({ field, label, tip }: FormItemConfig) {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Switch checked={field.value} onCheckedChange={field.onChange} id={field.name} />
        <Label htmlFor={field.name} className="ml-2 cursor-pointer">{label}</Label>
      </div>
      {!!tip && <div className="mt-1 text-muted-foreground text-sm">{tip}</div>}
    </div>
  )
}
