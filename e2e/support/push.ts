import {by, device, element, waitFor} from 'detox';
import {tapAndroidSystemElement} from './androidSystemUi';
import {adbShell} from './launchApp';
import {closePushCallbacks, expectScreen} from './navigation';

const TEST_PUSH_URL = 'netmera://e2e/push?nm=';
const TIMEOUT_MS = 10000;
const OPEN_SETTLE_MS = 2000;

export interface PushOptions {
  pid: string;
  title: string;
  text: string;
  act: object;
  /** Custom JSON; the server always sends one, `null` leaves it out. */
  prms?: object | null;
}

/**
 * Delivers a Netmera push and taps its notification, as a user would. On Android Detox
 * synchronization is left off afterwards; the caller turns it back on after the test.
 */
export async function openPush(push: PushOptions): Promise<void> {
  const nm = {
    pid: push.pid,
    pt: 1,
    act: push.act,
    ...(push.prms === null ? {} : {prms: push.prms ?? {}}),
  };
  if (device.getPlatform() === 'ios') {
    // From the background, as a user taps a banner; Detox delivers it to the running app.
    await device.sendToHome();
    await device.launchApp({
      newInstance: false,
      userNotification: {
        trigger: {type: 'push'},
        title: push.title,
        body: push.text,
        payload: {_nm: nm},
      },
    });
    return;
  }
  await openOnAndroid(push, nm);
}

async function openOnAndroid(push: PushOptions, nm: object): Promise<void> {
  const androidNm = {...nm, ps: {ctitle: push.title, ctext: push.text}};
  await closePushCallbacks();
  // The hook listens from the root component, so the first screen must be up.
  await expectScreen('Home');
  // Debug builds hand this payload to the SDK the way an FCM message is handed (src/helpers/TestPush.ts).
  await device.openURL({url: TEST_PUSH_URL + encodeURIComponent(JSON.stringify(androidNm))});
  await waitForPostedNotification(push.title);
  // onPushReceive opens the demo's callback window, which keeps focus over the shade.
  await waitFor(element(by.text('onPushReceive')))
    .toExist()
    .withTimeout(TIMEOUT_MS);
  await element(by.id('pushCallbacks.close')).tap();
  // Detox rarely sees the app idle again once the push is opened from the shade.
  await device.disableSynchronization();
  try {
    adbShell(['cmd', 'statusbar', 'expand-notifications']);
    await tapAndroidSystemElement('text', push.title);
    // Collapsing the shade before the tapped notification has brought the app back leaves the
    // app without window focus.
    await new Promise(resolve => setTimeout(resolve, OPEN_SETTLE_MS));
  } finally {
    adbShell(['cmd', 'statusbar', 'collapse']);
  }
}

async function waitForPostedNotification(title: string): Promise<void> {
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (
      adbShell(['dumpsys', 'notification', '--noredact']).includes(
        `android.title=String (${title})`,
      )
    ) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`The SDK did not post a notification titled "${title}"`);
}

/** Heads-up banners steal window focus from the app while a test opens pushes. */
export function setAndroidHeadsUpEnabled(enabled: boolean): void {
  adbShell(['settings', 'put', 'global', 'heads_up_notifications_enabled', enabled ? '1' : '0']);
}
