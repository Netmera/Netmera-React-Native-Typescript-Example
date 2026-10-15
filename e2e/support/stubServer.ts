import http from 'http';

export const STUB_PORT = 8089;

export type RecordedRequest = {
  method: string;
  path: string;
  query: string;
  headers: Record<string, string>;
  body: string;
};

/**
 * Stand-in for the Netmera backend. It runs on the host before the app
 * starts, so launch-time requests such as `session/init` are not lost.
 */
export function startStubServer(port = STUB_PORT): Promise<http.Server> {
  const requests: RecordedRequest[] = [];

  const server = http.createServer((request, response) => {
    const chunks: Buffer[] = [];
    request.on('data', chunk => chunks.push(chunk));
    request.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      const url = new URL(request.url ?? '/', `http://127.0.0.1:${port}`);
      response.setHeader('Content-Type', 'application/json');

      if (url.pathname === '/__stub/requests' && request.method === 'GET') {
        response.end(JSON.stringify(requests));
      } else if (url.pathname === '/__stub/reset' && request.method === 'POST') {
        requests.length = 0;
        response.end('{}');
      } else {
        const headers: Record<string, string> = {};
        for (const [name, value] of Object.entries(request.headers)) {
          headers[name] = Array.isArray(value) ? value.join(',') : value ?? '';
        }
        requests.push({
          method: request.method ?? '',
          path: url.pathname,
          query: url.search.replace(/^\?/, ''),
          headers,
          body,
        });
        response.end('{}');
      }
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}
