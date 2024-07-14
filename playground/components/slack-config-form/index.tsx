'use client'

import { LocoForm } from '@/lib/fango/form'
import { locoClient } from '@/lib/fango/client'

export default function SheetConfigForm() {
  return (
    <LocoForm
      type="slack"
      locoClient={locoClient}
    />
  )
}
