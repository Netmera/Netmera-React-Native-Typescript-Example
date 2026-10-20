import {STUB_PORT, type RecordedRequest} from './stubServer';

const baseUrl = `http://127.0.0.1:${STUB_PORT}`;

export async function requests(): Promise<RecordedRequest[]> {
  const response = await fetch(`${baseUrl}/__stub/requests`);
  return response.json();
}

export async function reset(): Promise<void> {
  await fetch(`${baseUrl}/__stub/reset`, {method: 'POST'});
}

export async function respond(pathContains: string, body: unknown): Promise<void> {
  const response = await fetch(`${baseUrl}/__stub/responses`, {
    method: 'POST',
    body: JSON.stringify({pathContains, body}),
  });
  if (!response.ok) {
    throw new Error(`Stub rejected the response for "${pathContains}"`);
  }
}

export async function waitForRequest(
  pathContains: string,
  {after = 0, bodyContains = '', timeoutMs = 20000} = {},
): Promise<RecordedRequest> {
  const deadline = Date.now() + timeoutMs;
  let received: RecordedRequest[] = [];
  while (Date.now() < deadline) {
    received = await requests();
    const match = received
      .slice(after)
      .find(
        request =>
          request.path.includes(pathContains) && request.body.includes(bodyContains),
      );
    if (match) {
      return match;
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  const paths = received.map(request => `${request.method} ${request.path}`);
  throw new Error(`No request to "${pathContains}". Received: ${paths.join(', ')}`);
}

export async function requestCount(): Promise<number> {
  return (await requests()).length;
}

export async function expectNoRequest(
  pathContains: string,
  {after = 0, windowMs = 5000} = {},
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, windowMs));
  const received = (await requests())
    .slice(after)
    .filter(request => request.path.includes(pathContains));
  if (received.length > 0) {
    throw new Error(`Unexpected request to "${pathContains}" (${received.length} received)`);
  }
}
