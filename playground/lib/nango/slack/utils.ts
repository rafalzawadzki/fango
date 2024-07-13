export function processMessageTimestamp(input: string) {
  // Regular expression to match a URL containing the timestamp
  const urlRegex = /\/p(\d+)(\d{6})$/;
  // Check if the input is a URL
  const urlMatch = input.match(urlRegex);
  if (urlMatch) {
    const timestamp = `${urlMatch[1]}.${urlMatch[2]}`;
    return timestamp;
  }

  // Check if the input is already in the desired format
  const timestampRegex = /^(\d+)\.(\d{6})$/;
  const timestampMatch = input.match(timestampRegex);
  if (timestampMatch) {
    return input;
  }

  return undefined;
}