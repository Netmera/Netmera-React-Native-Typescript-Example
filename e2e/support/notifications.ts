import {by, device, system} from 'detox';
import {tapAndroidSystemElement} from './androidSystemUi';
import {ANDROID_PACKAGE, adbShell, launchAppWithStub} from './launchApp';

const POST_NOTIFICATIONS = 'android.permission.POST_NOTIFICATIONS';

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
    await tapAndroidSystemElement('resource-id', ANDROID_PROMPT_BUTTONS[answer]);
  } finally {
    await device.enableSynchronization();
  }
}
