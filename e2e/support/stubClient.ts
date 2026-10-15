import {STUB_PORT, type RecordedRequest} from './stubServer';

const baseUrl = `http://127.0.0.1:${STUB_PORT}`;

export async function requests(): Promise<RecordedRequest[]> {
  const response = await fetch(`${baseUrl}/__stub/requests`);
  return response.json();
}

export async function reset(): Promise<void> {
  await fetch(`${baseUrl}/__stub/reset`, {method: 'POST'});
}

export async function waitForRequest(
  pathContains: string,
  {after = 0, timeoutMs = 20000} = {},
): Promise<RecordedRequest> {
  const deadline = Date.now() + timeoutMs;
  let received: RecordedRequest[] = [];
  while (Date.now() < deadline) {
    received = await requests();
    const match = received
      .slice(after)
      .find(request => request.path.includes(pathContains));
    if (match) {
      return match;
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  const paths = received.map(request => `${request.method} ${request.path}`);
  throw new Error(`No request to "${pathContains}". Received: ${paths.join(', ')}`);
}
