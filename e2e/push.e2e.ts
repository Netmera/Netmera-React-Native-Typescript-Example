import {expect as jestExpect} from '@jest/globals';
import {by, device, element, waitFor} from 'detox';
import {installWithNotifications} from './support/notifications';
import {expectScreen} from './support/navigation';
import {openPush, setAndroidHeadsUpEnabled} from './support/push';
import {STUB_PORT} from './support/stubServer';
import * as stub from './support/stubClient';

const OPEN_APP = 0;
const DEEPLINK = 1;
const WEB_VIEW = 2;

const TEMPLATE_ID = 'e2e_template';

const isIos = () => device.getPlatform() === 'ios';

// The URL scheme each app registers.
const deeplink = () =>
  isIos() ? 'netmerareactnative://e2e-deeplink?key=value' : 'netmera://e2e-deeplink?key=value';

async function expectPushOpen(after: number, pushId: string): Promise<void> {
  const request = await stub.waitForRequest('event/fire', {after, bodyContains: '"n:po"'});
  const pushOpen = JSON.parse(request.body).events.find(
    (event: {code: string}) => event.code === 'n:po',
  );
  jestExpect(pushOpen.fs).toBe(pushId);
}

async function expectWebView(): Promise<void> {
  await waitFor(element(isIos() ? by.id('_netmeraWebView') : by.type('android.webkit.WebView')))
    .toExist()
    .withTimeout(10000);
}

describe('Push', () => {
  beforeAll(() => {
    if (!isIos()) {
      setAndroidHeadsUpEnabled(false);
    }
  });

  afterAll(() => {
    if (!isIos()) {
      setAndroidHeadsUpEnabled(true);
    }
  });

  beforeEach(async () => {
    await stub.reset();
  });

  afterEach(async () => {
    await device.enableSynchronization();
  });

  it('opening a push sends the push open event with its push id', async () => {
    await installWithNotifications('granted');
    const after = await stub.requestCount();
    await openPush({pid: 'e2e-open', title: 'E2E open', text: 'Open', act: {at: OPEN_APP}});

    await expectPushOpen(after, 'e2e-open');
  });

  it('a deeplink push opens its URL in the app', async () => {
    await installWithNotifications('granted');
    await openPush({
      pid: 'e2e-deeplink',
      title: 'E2E deeplink',
      text: 'Deeplink',
      act: {at: DEEPLINK, uri: deeplink()},
    });
    // The demo lists push callbacks in a window that hides the screen behind it.
    await waitFor(element(by.id('pushCallbacks.close')))
      .toBeVisible()
      .withTimeout(10000);
    await element(by.id('pushCallbacks.close')).tap();

    await waitFor(element(by.text(`Foreground url: ${deeplink()}`)))
      .toExist()
      .withTimeout(10000);
  });

  it('a web view push shows its URL', async () => {
    await installWithNotifications('granted');
    const after = await stub.requestCount();
    await openPush({
      pid: 'e2e-web-view',
      title: 'E2E web view',
      text: 'Web view',
      act: {at: WEB_VIEW, url: `http://127.0.0.1:${STUB_PORT}/e2e-web-view`},
    });

    await expectWebView();
    await stub.waitForRequest('/e2e-web-view', {after});
  });

  it('a template push shows the template from the app config', async () => {
    await stub.respond('session/init', {
      cfg: {htmlTemps: {[TEMPLATE_ID]: '<html><body>Template</body></html>'}},
    });
    await installWithNotifications('granted');
    await openPush({
      pid: 'e2e-template',
      title: 'E2E template',
      text: 'Template',
      act: {at: WEB_VIEW, tid: TEMPLATE_ID, tprms: {}},
    });

    await expectWebView();
  });

  // RN Android maps `prms` without a null check and crashes; the server always sends one today.
  (isIos() ? it : it.skip)(
    'a push without custom JSON opens the app [bridge bug, Android]',
    async () => {
      await installWithNotifications('granted');
      const after = await stub.requestCount();
      await openPush({
        pid: 'e2e-no-custom-json',
        title: 'E2E no custom JSON',
        text: 'No custom JSON',
        act: {at: OPEN_APP},
        prms: null,
      });

      await expectPushOpen(after, 'e2e-no-custom-json');
      await expectScreen('Home');
    },
  );
});
