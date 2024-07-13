'use client'

import { CreateForm } from '@/lib/forms'
import { sentMessageForm } from '@/lib/integration-forms/slack/form-sent-message'

export default function SheetConfigForm() {
  return (
    <div className="w-full space-y-8">
      <CreateForm {...sentMessageForm} />
    </div>
  )
}
