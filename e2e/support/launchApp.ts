import {execFileSync} from 'child_process';
import path from 'path';
import {device} from 'detox';
import * as stub from './stubClient';
import {STUB_PORT} from './stubServer';

export const ANDROID_PACKAGE = 'com.netmera.demo.reactnative';
const STUB_BASE_URL = `http://127.0.0.1:${STUB_PORT}`;
const STUB_API_KEY = 'e2e';

/**
 * Launches the app pointed at the stub server through the demo's existing
 * "custom" environment, so the app itself needs no test-only code.
 * Tests must launch through here, not `device.launchApp`, or the app falls
 * back to the production backend.
 * iOS reads it from UserDefaults, which launch arguments override; Android
 * reads it from SharedPreferences before Netmera is initialized.
 */
export async function launchAppWithStub(
  config: Detox.DeviceLaunchAppConfig = {},
): Promise<void> {
  const after = await stub.requestCount();
  if (device.getPlatform() === 'ios') {
    await launchIos(config);
  } else {
    await launchAndroid(config);
  }
  // Tapping SDK actions before session/init races the SDK setup.
  await stub.waitForRequest('session/init', {after});
}

async function launchIos(config: Detox.DeviceLaunchAppConfig): Promise<void> {
  device.appLaunchArgs.modify({
    environment: 'custom',
    baseURL: STUB_BASE_URL,
    APIKey: STUB_API_KEY,
  });
  await device.launchApp({newInstance: true, ...config});
}

async function launchAndroid(config: Detox.DeviceLaunchAppConfig): Promise<void> {
  // A reinstall wipes the preferences, so it has to happen before they are written.
  const {delete: reinstall, ...launchConfig} = config;
  await device.terminateApp();
  if (reinstall) {
    await device.uninstallApp();
    await device.installApp();
  }
  writeAndroidCustomEnvironment();
  await device.launchApp({newInstance: true, ...launchConfig});
}

function writeAndroidCustomEnvironment(): void {
  const preferences =
    "<?xml version='1.0' encoding='utf-8' standalone='yes' ?><map>" +
    '<string name="environment">custom</string>' +
    `<string name="baseUrl">${STUB_BASE_URL}</string>` +
    `<string name="apiKey">${STUB_API_KEY}</string>` +
    '</map>';
  adbShell(
    [
      'run-as',
      ANDROID_PACKAGE,
      'sh',
      '-c',
      "'mkdir -p shared_prefs && cat > shared_prefs/Preferences.xml'",
    ],
    preferences,
  );
}

export function adbShell(args: string[], input?: string): string {
  const sdkRoot = process.env.ANDROID_SDK_ROOT ?? process.env.ANDROID_HOME ?? '';
  return execFileSync(
    path.join(sdkRoot, 'platform-tools', 'adb'),
    ['-s', device.id, 'shell', ...args],
    {input},
  ).toString();
}
