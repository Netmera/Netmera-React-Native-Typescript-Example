import {adbShell} from './launchApp';

const TIMEOUT_MS = 10000;

type Attribute = 'resource-id' | 'text';

/**
 * Taps an element of a system window (permission prompt, notification shade). Detox cannot reach
 * those on Android, so UiAutomator finds the element and adb taps its center.
 */
export async function tapAndroidSystemElement(attribute: Attribute, value: string): Promise<void> {
  const [x, y] = await waitForCenter(attribute, value);
  adbShell(['input', 'tap', String(x), String(y)]);
}

async function waitForCenter(attribute: Attribute, value: string): Promise<[number, number]> {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const bounds = new RegExp(
    `${attribute}="${escaped}"[^>]*bounds="\\[(\\d+),(\\d+)\\]\\[(\\d+),(\\d+)\\]"`,
  );
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    const match = bounds.exec(dumpScreen());
    if (match) {
      const [left, top, right, bottom] = match.slice(1).map(Number);
      return [Math.round((left + right) / 2), Math.round((top + bottom) / 2)];
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error(`No system element with ${attribute}="${value}" appeared`);
}

// A dump taken during an animation fails, and an older file must not be read instead.
function dumpScreen(): string {
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
