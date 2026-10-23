import {expect as jestExpect} from '@jest/globals';
import {launchAppWithStub} from './support/launchApp';
import * as stub from './support/stubClient';

describe('Smoke', () => {
  beforeAll(async () => {
    await stub.reset();
    await launchAppWithStub();
  });

  it('SDK sends session/init to the stub server at launch', async () => {
    const request = await stub.waitForRequest('session/init');
    jestExpect(request.method).toBe('POST');
  });
});
