import { useCallback, useEffect, useRef, useState } from 'react'
import { LoaderCircle, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FormItemConfig } from '../../types/form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { generateConnectionId } from '@/utils'

interface ConnectionType {
  id: string
  name: string
}

const connectionSchema = z.object({
  name: z.string({ message: 'Name is required' }),
})
const connectionFormResolver = zodResolver(connectionSchema)
type ConnectionFormType = z.infer<typeof connectionSchema>

export function ConnectionForm({ fangoClient, field, form, providerConfigKey, authConfig }: FormItemConfig) {
  const addForm = useForm<ConnectionFormType>({
    resolver: connectionFormResolver,
  })

  const [open, setOpen] = useState(false)
  const [connections, setConnections] = useState<ConnectionType[]>([])
  const [loading, setLoading] = useState(false)
  const [auth, setAuth] = useState(false)
  const [editingConnectionId, setEditingConnectionId] = useState('')
  const addConnectionId = useRef<string>('')

  const { createConnection, getConnections, updateConnection } = fangoClient.connection_db || {}

  if (!createConnection || !getConnections || !updateConnection) {
    throw new Error('Connection DB not available')
  }

  const handleRefreshConnections = useCallback(async () => {
    const res = await getConnections(providerConfigKey!)
    const connections = res.map((connection: any) => ({ id: connection.connectionId, name: connection.connectionName }))
    setConnections(connections)
  }, [providerConfigKey])

  useEffect(() => {
    handleRefreshConnections()
  }, [handleRefreshConnections])

  const reset = () => {
    addForm.setValue('name', '')
    setEditingConnectionId('')
    addConnectionId.current = ''
    setLoading(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    setOpen(open)
  }

  const handleDisconnect = () => {
    setAuth(false)
  }
  const handleAuth = async () => {
    const valid = await addForm.trigger('name')
    if (!valid || !providerConfigKey)
      return
    setLoading(true)
    try {
      if (editingConnectionId) {
        await fangoClient.nango.auth(providerConfigKey, editingConnectionId, {
          detectClosedAuthWindow: true,
        })
      }
      else {
        const id = generateConnectionId()
        addConnectionId.current = id
        await fangoClient.nango.auth(providerConfigKey, id, {
          detectClosedAuthWindow: true,
          ...authConfig,
        })
        setEditingConnectionId(id)
      }
      setAuth(true)
    }
    catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleCancel = () => {
    reset()
    setOpen(false)
  }
  const handleSave = async () => {
    if (!addConnectionId.current && !editingConnectionId)
      return
    setLoading(true)
    if (addConnectionId.current) {
      await createConnection({
        connectionId: addConnectionId.current,
        connectionName: addForm.getValues('name'),
        type: providerConfigKey as any,
      })
    }
    else {
      await updateConnection(editingConnectionId, addForm.getValues('name'))
    }
    await handleRefreshConnections()
    form.setValue('auth', true)
    field.onChange(addConnectionId.current)
    reset()
    setOpen(false)
  }

  const handleRefresh = async () => {
    const connection = connections.find(connection => connection.id === field.value)
    if (!connection)
      return
    setAuth(true)
    setEditingConnectionId(connection.id)
    addForm.setValue('name', connection.name || '')
    setOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className="relative">
        <Select
          value={field.value}
          onValueChange={(value) => {
            form.setValue('auth', true)
            field.onChange(value)
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an connection" />
          </SelectTrigger>
          <SelectContent>
            <DialogTrigger asChild>
              <div className="flex items-center justify-center gap-1 h-10 text-sm border-b cursor-pointer">
                <Plus className="w-4 h-4" />
                {' '}
                New Connection
              </div>
            </DialogTrigger>
            {
              connections.map(connection => (
                <SelectItem key={connection.id} value={connection.id}>
                  {connection.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        {
          field.value && (
            <Button
              className="absolute -top-10 right-0 cursor-pointer flex-shrink-0 text-primary-500 hover:text-primary-500/80  z-1000"
              variant="link"
              type="button"
              onClick={handleRefresh}
            >
              Reconnection
            </Button>
          )
        }
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Google Sheets Connection</DialogTitle>
        </DialogHeader>
        <Form {...addForm}>
          <form className="space-y-8">
            <FormField
              control={addForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading || (auth && !!editingConnectionId)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              (auth && !!editingConnectionId)
                ? (
                    <Button
                      className="w-full"
                      variant="destructive"
                      type="button"
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </Button>
                  )
                : (
                    <Button
                      className="w-full"
                      onClick={handleAuth}
                      disabled={loading}
                      type="button"
                    >
                      {loading ? <LoaderCircle size={32} className="animate-spin" /> : 'Connect'}
                    </Button>
                  )
            }
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading || !auth}>
            {loading ? <LoaderCircle size={32} className="animate-spin" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
