import {by, device, system} from 'detox';
import {ANDROID_PACKAGE, adbShell, launchAppWithStub} from './launchApp';

const POST_NOTIFICATIONS = 'android.permission.POST_NOTIFICATIONS';
const PROMPT_TIMEOUT_MS = 10000;

const IOS_PROMPT_BUTTONS = {allow: 'Allow', deny: 'Don’t Allow'};
const ANDROID_PROMPT_BUTTONS = {
  allow: 'com.android.permissioncontroller:id/permission_allow_button',
  deny: 'com.android.permissioncontroller:id/permission_deny_button',
};

type PromptAnswer = keyof typeof IOS_PROMPT_BUTTONS;

/** Reinstalls the app with notifications either granted or never asked, so the SDK starts clean. */
export async function installWithNotifications(permission: 'granted' | 'notAsked'): Promise<void> {
  if (device.getPlatform() === 'ios') {
    await launchAppWithStub({
      delete: true,
      permissions: {notifications: permission === 'granted' ? 'YES' : 'unset'},
    });
    return;
  }
  await device.terminateApp();
  await device.uninstallApp();
  // Detox installs the APK with every runtime permission granted.
  await device.installApp();
  if (permission === 'notAsked') {
    adbShell(['pm', 'revoke', ANDROID_PACKAGE, POST_NOTIFICATIONS]);
  }
  await launchAppWithStub();
}

/** Runs the step that opens the system notification prompt, then answers it like a user. */
export async function answerNotificationPrompt(
  answer: PromptAnswer,
  openPrompt: () => Promise<void>,
): Promise<void> {
  if (device.getPlatform() === 'ios') {
    await openPrompt();
    await system.element(by.system.label(IOS_PROMPT_BUTTONS[answer])).tap();
    return;
  }
  // The app never looks idle to Detox while a system window covers it.
  await device.disableSynchronization();
  try {
    await openPrompt();
    // Detox cannot reach system windows on Android; UiAutomator finds the button by its stable id.
    const [x, y] = await waitForAndroidButtonCenter(ANDROID_PROMPT_BUTTONS[answer]);
    adbShell(['input', 'tap', String(x), String(y)]);
  } finally {
    await device.enableSynchronization();
  }
}

async function waitForAndroidButtonCenter(resourceId: string): Promise<[number, number]> {
  const bounds = new RegExp(
    `resource-id="${resourceId}"[^>]*bounds="\\[(\\d+),(\\d+)\\]\\[(\\d+),(\\d+)\\]"`,
  );
  const deadline = Date.now() + PROMPT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const match = bounds.exec(dumpAndroidScreen());
    if (match) {
      const [left, top, right, bottom] = match.slice(1).map(Number);
      return [Math.round((left + right) / 2), Math.round((top + bottom) / 2)];
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`The system prompt button "${resourceId}" did not appear`);
}

// A dump taken during an animation fails, and an older file must not be read instead.
function dumpAndroidScreen(): string {
  try {
    return adbShell([
      'rm',
      '-f',
      '/sdcard/ui.xml',
      '&&',
      'uiautomator',
      'dump',
      '/sdcard/ui.xml',
      '>/dev/null',
      '&&',
      'cat',
      '/sdcard/ui.xml',
    ]);
  } catch {
    return '';
  }
}
