export type ConnectionType = 'google-sheet' | 'slack'

export interface Connection {
  id: string | number
  connectionId: string
  connectionName: string
  type: ConnectionType
}

export interface ConnectionDatabaseMethods {
  getConnection?: (connectionId: string) => Promise<Connection>
  getConnections?: (providerConfigKey?: string) => Promise<Connection[]>
  createConnection?: (connection: Partial<Connection>) => Promise<Connection>
  updateConnection?: (connectionId: string, connectionName: string) => Promise<Connection>
}
