import {by, device, element, expect, waitFor} from 'detox';
import {openMenu, tap, tapInScroll} from './support/navigation';
import {answerNotificationPrompt, installWithNotifications} from './support/notifications';
import * as stub from './support/stubClient';

const PUSH_ENABLE = 'push/enable';
const PUSH_DISABLE = 'push/disable';
const PUSH_REGISTER = 'push/register';

const PUSH_SWITCH = 'notification.menu.pushReceivingStatus';

const isIos = () => device.getPlatform() === 'ios';

async function openNotification(): Promise<void> {
  await openMenu(['home.menu.notification']);
}

async function expectPermission(title: string): Promise<void> {
  await waitFor(element(by.text(title).withAncestor(by.id('notification.menu.permission'))))
    .toExist()
    .withTimeout(10000);
}

describe('Notification', () => {
  beforeEach(async () => {
    await stub.reset();
  });

  it('turning push receiving off and on sends push/disable and push/enable', async () => {
    await installWithNotifications('granted');
    await openNotification();
    await expectPermission('Granted');

    await expect(element(by.id(PUSH_SWITCH))).toHaveToggleValue(true);

    let after = await stub.requestCount();
    await tapInScroll(PUSH_SWITCH, 'notification.menu');
    await stub.waitForRequest(PUSH_DISABLE, {after});

    after = await stub.requestCount();
    await tapInScroll(PUSH_SWITCH, 'notification.menu');
    await stub.waitForRequest(PUSH_ENABLE, {after});
  });

  it('Register Push with Allow sends push/enable', async () => {
    await installWithNotifications('notAsked');
    await openNotification();
    await expectPermission('Not determined');

    const after = await stub.requestCount();
    await answerNotificationPrompt('allow', () => tap('notification.menu.registerPush'));

    await stub.waitForRequest(PUSH_ENABLE, {after});
    await expectPermission('Granted');
  });

  it("Register Push with Don't Allow does not send push/enable", async () => {
    await installWithNotifications('notAsked');
    await openNotification();
    await expectPermission('Not determined');

    const after = await stub.requestCount();
    await answerNotificationPrompt('deny', () => tap('notification.menu.registerPush'));

    await expectPermission('Denied');
    await stub.expectNoRequest(PUSH_ENABLE, {after});
  });

  // The iOS simulator never receives an APNs token.
  (isIos() ? it.skip : it)('the push token is registered', async () => {
    const after = await stub.requestCount();
    await installWithNotifications('granted');

    await stub.waitForRequest(PUSH_REGISTER, {after, bodyContains: '"token"', timeoutMs: 30000});
  });
});
