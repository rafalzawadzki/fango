import { useCallback, useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'
import { LoaderCircle, RefreshCw } from 'lucide-react'
import type { FormItemConfig, SelectOption } from '../../types/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils'

export function SelectForm({ field, form, refreshers, options, placeholder, showSearch }: FormItemConfig) {
  const isOptionsObj = typeof options === 'object'
  const [items, setItems] = useState<SelectOption[]>(isOptionsObj ? options?.options : [])
  const [disabled, setDisabled] = useState(isOptionsObj ? options?.disabled : false)
  const [emptyText, setEmptyText] = useState(isOptionsObj ? options?.placeholder : '')
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const filteredItems = useMemo(() => {
    if (!searchValue)
      return items
    return items.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()))
  }, [items, searchValue])

  const refreshOptions = useCallback(async (values: any, searchValue?: string) => {
    if (typeof options === 'function') {
      setLoading(true)
      try {
        const res = await options(values, {
          form,
          field,
          searchValue,
        })
        setItems(res.options)
        setDisabled(res.disabled)
        setEmptyText(res.placeholder)
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

  const handleSearchChange = debounce(async (e: any) => {
    setSearchValue(e.target.value)
  }, 500)

  const handleRefresh = async (e: any) => {
    if (loading)
      return
    e.stopPropagation()
    const values = refreshers?.map(name => form.getValues(name as any)) || []
    await refreshOptions(values)
  }

  return (
    <div className="relative">
      <Select onValueChange={field.onChange} value={String(field.value || '')}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {
            emptyText && !items.length && !loading && <div className="flex items-center justify-center text-muted-foreground h-10">{emptyText}</div>
          }
          {
            loading && (
              <div className="flex items-center justify-center text-muted-foreground h-10">
                <LoaderCircle size={32} className="animate-spin" />
              </div>
            )
          }
          {
            !!items.length && showSearch && (
              <div className="px-4 py-2">
                <Input placeholder="Search" onChange={handleSearchChange} />
              </div>
            )
          }
          {
            filteredItems.map((item, index) => (
              <SelectItem disabled={disabled} key={index} value={String(item.value)}>{item.label}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>
      {
        !isOptionsObj && (
          <RefreshCw
            size={20}
            className={cn(
              'absolute -top-8 right-0 cursor-pointer flex-shrink-0 mr-2 text-gray-500 z-1000',
              loading && 'text-gray-300 animate-spin',
            )}
            onClick={handleRefresh}
          />
        )
      }
    </div>
  )
}
