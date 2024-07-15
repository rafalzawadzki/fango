import { FangoServer } from '@fango/server'

export const fangoServer = new FangoServer(process.env.NANGO_HOST!, process.env.NANGO_SECRET_KEY!)
