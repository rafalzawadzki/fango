import React, { useCallback, useEffect, useState } from 'react'
import { LoaderCircle, Plus, X } from 'lucide-react'
import { FormItemConfig } from '../type'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function ValueListForm({
  field,
  form,
  refreshers,
  options,
}: FormItemConfig) {
  const isOptionsObj = typeof options === 'object'
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<{ value: string, label: string }[]>([])
  const [disabled, setDisabled] = useState(false)
  const [emptyText, setEmptyText] = useState('')
  const [couldAdd, setCouldAdd] = useState(false)

  const refreshOptions = useCallback(async (values: any, searchValue?: string) => {
    if (typeof options === 'function') {
      setLoading(true)
      try {
        const res = await options(values, { form, field, searchValue })
        setItems(res.options)
        setDisabled(!!res.disabled)
        setEmptyText(res.placeholder || '')
        setCouldAdd(!!res.couldAdd)
      }
      catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
  }, [field, form, options])

  useEffect(() => {
    if (!isOptionsObj) {
      refreshOptions([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof options !== 'function')
      return

    const subscription = form.watch((value, { name, type }) => {
      if (type === 'change' && refreshers?.includes(name as string)) {
        const values = refreshers.map(name => value[name])
        refreshOptions(values)
      }
    })

    return () => subscription.unsubscribe()
  }, [form, form.watch, options, refreshOptions, refreshers])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const values = field.value || []
    values[index] = e.target.value
    field.onChange(values)
  }

  const handleAddItem = () => {
    setItems([...items, { value: '', label: '' }])
  }

  const handleRemoveItem = (index: number) => {
    const values = field.value
    values.splice(index, 1)
    field.onChange(values)
    setItems(items.filter((_, i) => i !== index))
  }

  if (!items.length && !loading) {
    return (
      <div className="flex items-center justify-center w-full h-32 text-gray-500 border rounded-sm">
        {emptyText || 'No items'}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-32 text-gray-500 border rounded-sm">
        <LoaderCircle size={32} className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      {
        items.map((item, index) => {
          return (
            <div key={index} className="flex items-center gap-2 w-full">
              {/* {!!item.label && <Label>{item.label}</Label>} */}
              <Input disabled={disabled} defaultValue={item.value} placeholder={item.label || `Item${index + 1}`} onChange={e => handleValueChange(e, index)} />
              {
                !disabled && couldAdd && (
                  <Button variant="ghost" onClick={() => handleRemoveItem(index)}>
                    <X />
                  </Button>
                )
              }
            </div>
          )
        })
      }
      {
        couldAdd && (
          <Button
            variant="outline"
            className="flex gap-2 items-center w-full mt-2"
            onClick={handleAddItem}
            type="button"
          >
            <Plus size={18} />
            Add item
          </Button>
        )
      }
    </div>
  )
}
