import { LocoClient } from '@fango/client'
import { createConnection, getConnections, updateConnection } from '@/lib/database'

const locoClient = new LocoClient(process.env.NANGO_HOST!, process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY!)

locoClient.setConnectionDatabase({
  getConnections,
  updateConnection,
  createConnection,
})

export { locoClient }
