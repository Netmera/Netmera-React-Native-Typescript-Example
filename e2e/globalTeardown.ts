import type {Server} from 'http';
import {globalTeardown as detoxGlobalTeardown} from 'detox/runners/jest';

export default async function globalTeardown(): Promise<void> {
  try {
    await detoxGlobalTeardown();
  } finally {
    const server: Server | undefined = (globalThis as any).__STUB_SERVER__;
    await new Promise<void>(resolve => (server ? server.close(() => resolve()) : resolve()));
  }
}
