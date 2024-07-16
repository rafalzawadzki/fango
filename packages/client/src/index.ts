import Nango from '@nangohq/frontend'
import type {
  ConnectionDatabaseMethods,
  ConnectionType,
} from './types/connection'
import type { Action, ActionMap } from './types/action'

export * from './types/connection'
export * from './types/action'

export class FangoClient {
  nango: Nango
  connection_db: ConnectionDatabaseMethods = {}
  actions: Map<ConnectionType, Action> = new Map()

  private nango_host?: string
  private nango_public_key: string

  constructor(nango_host: string, nango_public_key: string) {
    this.nango_host = nango_host
    this.nango_public_key = nango_public_key
    this.nango = new Nango({
      host: this.nango_host,
      publicKey: this.nango_public_key,
    })
  }

  setServerActions<T extends ConnectionType>(key: T, actions: ActionMap[T]) {
    this.actions.set(key, actions)
  }

  setConnectionDatabase(methods: ConnectionDatabaseMethods) {
    this.connection_db = methods
  }
}
