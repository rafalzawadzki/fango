import { LocoServer } from '@fango/server'

export const locoServer = new LocoServer(process.env.NANGO_HOST!, process.env.NANGO_SECRET_KEY!)
