// mock user and connection table action, just replace the real database action

import { nanoid } from 'nanoid'

export const getUserId = async () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    const newUserId = nanoid()
    localStorage.setItem('userId', newUserId)
    return newUserId
  }
  return userId
}

export const getConnections = async (providerConfigKey?: string) => {
  const connections = localStorage.getItem('connections')
  if (!connections) {
    return []
  }
  const con = JSON.parse(connections)
  if (!providerConfigKey) {
    return con
  }
  return con.filter((connection: any) => connection.type === providerConfigKey)
}

export const addConnection = async (connectionId: string, connectionName: string, type = 'google-sheet') => {
  const connection = {
    id: nanoid(),
    connectionId,
    connectionName,
    type,
  }
  const connections = await getConnections()
  connections.push(connection)
  localStorage.setItem('connections', JSON.stringify(connections))
  return connection
}

export const updateConnection = async (connectionId: string, connectionName: string) => {
  const connections = await getConnections()
  const index = connections.findIndex((connection: any) => connection.connectionId === connectionId)
  connections[index].connectionName = connectionName
  localStorage.setItem('connections', JSON.stringify(connections))
  return connections[index]
}