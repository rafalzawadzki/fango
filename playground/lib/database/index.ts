import { nanoid } from 'nanoid'

export async function getUserId() {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    const newUserId = nanoid()
    localStorage.setItem('userId', newUserId)
    return newUserId
  }
  return userId
}

export async function getConnections(providerConfigKey?: string) {
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

export async function createConnection({
  connectionId,
  connectionName,
  type = 'google-sheet',
}: any) {
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

export async function updateConnection(
  connectionId: string,
  connectionName: string,
) {
  const connections = await getConnections()
  const index = connections.findIndex(
    (connection: any) => connection.connectionId === connectionId,
  )
  connections[index].connectionName = connectionName
  localStorage.setItem('connections', JSON.stringify(connections))
  return connections[index]
}
