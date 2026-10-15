import {globalSetup as detoxGlobalSetup} from 'detox/runners/jest';
import {startStubServer} from './support/stubServer';

export default async function globalSetup(): Promise<void> {
  (globalThis as any).__STUB_SERVER__ = await startStubServer();
  await detoxGlobalSetup();
}
