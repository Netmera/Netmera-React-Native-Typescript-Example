import {LOGIN_EVENT_CODE, sendLoginEvent} from './support/events';
import {launchAppWithStub} from './support/launchApp';
import {goBack, openMenu} from './support/navigation';
import * as stub from './support/stubClient';

describe('Core', () => {
  beforeEach(async () => {
    await stub.reset();
    await launchAppWithStub();
  });

  afterAll(async () => {
    // Data transfer state persists, so leave it enabled for the next suites.
    await launchAppWithStub();
    await openMenu(['home.menu.core', 'core.menu.enableData']);
  });

  it('Enable Data: events are sent', async () => {
    await openMenu(['home.menu.core', 'core.menu.enableData']);
    await goBack();

    const after = await stub.requestCount();
    await sendLoginEvent();

    await stub.waitForRequest('event/fire', {after, bodyContains: LOGIN_EVENT_CODE});
  });

  it('Disable Data: events are not sent', async () => {
    await openMenu(['home.menu.core', 'core.menu.disableData']);
    await goBack();

    const after = await stub.requestCount();
    await sendLoginEvent();

    await stub.expectNoRequest('event/fire', {after});
  });

  it('Kill Netmera: events are not sent afterwards', async () => {
    await openMenu(['home.menu.core', 'core.menu.enableData', 'core.menu.kill']);
    await goBack();

    const after = await stub.requestCount();
    await sendLoginEvent();

    await stub.expectNoRequest('event/fire', {after});
  });
});
