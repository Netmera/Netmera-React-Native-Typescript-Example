import {expect as jestExpect} from '@jest/globals';
import {launchAppWithStub} from './support/launchApp';
import {goBack, openMenu, tap} from './support/navigation';
import * as stub from './support/stubClient';

async function sendEvent(rowId: string, code: string) {
  const after = await stub.requestCount();
  await openMenu([rowId]);
  return stub.waitForRequest('event/fire', {after, bodyContains: `"${code}"`});
}

describe('Events', () => {
  beforeEach(async () => {
    await stub.reset();
    await launchAppWithStub();
    await openMenu(['home.menu.events']);
  });

  it('standard events are sent with their codes', async () => {
    await openMenu(['events.menu.general']);
    await sendEvent('general.menu.login', 'n:cl');
    await sendEvent('general.menu.register', 'n:rg');
    await sendEvent('general.menu.custom', 'ral');
    await goBack();

    await openMenu(['events.menu.commerce']);
    const purchase = await sendEvent('commerce.menu.purchase', 'mxw');
    jestExpect(purchase.body).toContain('TEST_COUPON');
    // Typed events carry their attributes under "prms", generic ones under "attr".
    jestExpect(purchase.body).toContain('"prms"');
    await goBack();

    await openMenu(['events.menu.media']);
    await sendEvent('media.menu.contentView', 'n:vc');
  });

  it('Use Generic Method: events are still sent with their codes', async () => {
    await tap('events.genericMethod');

    await openMenu(['events.menu.general']);
    await sendEvent('general.menu.login', 'n:cl');
    await goBack();

    await openMenu(['events.menu.commerce']);
    const purchase = await sendEvent('commerce.menu.purchase', 'mxw');
    jestExpect(purchase.body).toContain('TEST_COUPON');
    jestExpect(purchase.body).toContain('"attr"');
  });
});
