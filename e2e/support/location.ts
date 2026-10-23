import {execFileSync} from 'child_process';
import {by, device, system} from 'detox';
import {ANDROID_PACKAGE, adbShell, launchAppWithStub} from './launchApp';

const IOS_BUNDLE_ID = 'com.netmera.demo.reactnative';

const REVOKED_ON_ANDROID = {
  always: [],
  inuse: ['ACCESS_BACKGROUND_LOCATION'],
  never: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION', 'ACCESS_BACKGROUND_LOCATION'],
};

type LocationPermission = keyof typeof REVOKED_ON_ANDROID;

/** Reinstalls the app, so the SDK starts without a previously reported location status. */
export async function installWithLocation(permission: LocationPermission): Promise<void> {
  if (device.getPlatform() === 'ios') {
    await launchAppWithStub({delete: true, permissions: {location: permission}});
    return;
  }
  await device.terminateApp();
  await device.uninstallApp();
  // Detox installs the APK with every runtime permission granted.
  await device.installApp();
  revokeOnAndroid(permission);
  await launchAppWithStub();
}

export async function relaunchWithLocationDenied(): Promise<void> {
  if (device.getPlatform() === 'ios') {
    await launchAppWithStub({permissions: {location: 'never'}});
    return;
  }
  await device.terminateApp();
  revokeOnAndroid('never');
  await launchAppWithStub();
}

/** Changes the iOS permission while the app runs, as if the user changed it in Settings. */
export function grantLocationAlwaysOnIosWhileRunning(): void {
  execFileSync('xcrun', [
    'simctl',
    'privacy',
    device.id,
    'grant',
    'location-always',
    IOS_BUNDLE_ID,
  ]);
}

export async function answerIosLocationPrompt(
  button: 'Allow Once' | 'Allow While Using App',
): Promise<void> {
  await system.element(by.system.label(button)).tap();
}

export type Coordinate = {latitude: number; longitude: number};

const ANDROID_TEST_PROVIDER = 'gps';

/**
 * Android: a platform test provider, which GMS geofencing picks up
 * (same as android-demo's MockLocationProvider).
 */
export function installAndroidTestLocationProvider(): void {
  adbShell(['appops', 'set', 'com.android.shell', 'android:mock_location', 'allow']);
  adbShell(['cmd', 'location', 'providers', 'add-test-provider', ANDROID_TEST_PROVIDER]);
  adbShell([
    'cmd',
    'location',
    'providers',
    'set-test-provider-enabled',
    ANDROID_TEST_PROVIDER,
    'true',
  ]);
}

export function removeAndroidTestLocationProvider(): void {
  adbShell(['cmd', 'location', 'providers', 'remove-test-provider', ANDROID_TEST_PROVIDER]);
  adbShell(['appops', 'set', 'com.android.shell', 'android:mock_location', 'default']);
}

export function setAndroidTestLocation({latitude, longitude}: Coordinate): void {
  adbShell([
    'cmd',
    'location',
    'providers',
    'set-test-provider-location',
    ANDROID_TEST_PROVIDER,
    '--location',
    `${latitude},${longitude}`,
    '--accuracy',
    '5',
  ]);
}

/**
 * Moves the simulator along a route; region monitoring reacts to this,
 * not reliably to an instant `set` (same as swift-demo's geofence tests).
 */
export function moveIosSimulator(from: Coordinate, to: Coordinate): void {
  execFileSync('xcrun', [
    'simctl',
    'location',
    device.id,
    'start',
    '--speed=150',
    `${from.latitude},${from.longitude}`,
    `${to.latitude},${to.longitude}`,
  ]);
}

function revokeOnAndroid(permission: LocationPermission): void {
  REVOKED_ON_ANDROID[permission].forEach(name =>
    adbShell(['pm', 'revoke', ANDROID_PACKAGE, `android.permission.${name}`]),
  );
}
