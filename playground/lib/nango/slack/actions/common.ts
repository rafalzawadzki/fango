import { OAuth2Credentials } from "@nangohq/node";
import { nango } from "@/lib/nango/common/nango-node";
import { BASIC_URL_PREFIX, PROVIDER_CONFIG_KEY } from "../constants";

export const findConnectionCredentials = async (connectionId: string) => {
  const connectionConfig = await nango.getConnection(PROVIDER_CONFIG_KEY, connectionId)
  return connectionConfig.credentials as OAuth2Credentials
}

export const findChannels = async (connectionId: string) => {
  const { access_token } = await findConnectionCredentials(connectionId)
  const channels: { label: string; value: string }[] = [];
  let cursor;
  do {
    const response = await nango.proxy({
      baseUrlOverride: BASIC_URL_PREFIX,
      endpoint: '/api/conversations.list',
      method: 'get',
      providerConfigKey: PROVIDER_CONFIG_KEY,
      connectionId,
      params: {
        types: 'public_channel,private_channel',
        limit: '200',
        cursor: cursor ?? '',
      },
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    const data = response.data as { channels: { id: string; name: string }[], response_metadata: { next_cursor: string }, ok?: boolean, error?: string };
    if (!data.ok) {
      throw new Error(data.error);
    }
    channels.push(
      ...data.channels.map((channel) => ({ label: channel.name, value: channel.id })),
    );
    cursor = data.response_metadata.next_cursor;
  } while (cursor !== '' && channels.length < 600);

  return channels;
}