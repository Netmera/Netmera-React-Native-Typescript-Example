import {by, device, element, expect, waitFor} from 'detox';

const TIMEOUT_MS = 10000;

/**
 * Taps through menu rows by their testIDs, e.g. `['home.menu.user', 'user.menu.identify']`.
 */
export async function openMenu(path: string[]): Promise<void> {
  for (const rowId of path) {
    const separator = rowId.indexOf('.menu.');
    if (separator < 0) {
      throw new Error(`"${rowId}" is not a menu row id (<menu>.menu.<entry>)`);
    }
    const menuId = rowId.slice(0, separator);
    await closePushCallbacks();
    await waitFor(element(by.id(rowId)))
      .toBeVisible()
      .whileElement(by.id(`${menuId}.menu`))
      .scroll(200, 'down');
    await element(by.id(rowId)).tap();
  }
}

/**
 * The demo opens its Push Callbacks window whenever the SDK reports a push
 * callback (e.g. registration), at a time the test cannot predict.
 */
export async function closePushCallbacks(): Promise<void> {
  const closeButton = element(by.id('pushCallbacks.close'));
  try {
    await expect(closeButton).toBeVisible();
  } catch {
    return;
  }
  await closeButton.tap();
}

// `toExist` rather than `toBeVisible`: the screen wrapper is transparent, which
// fails Detox's pixel-based visibility check on iOS. Screens are mounted only
// once navigated to, so existence is enough.
export async function expectScreen(routeName: string): Promise<void> {
  await waitFor(element(by.id(`screen.${routeName}`)))
    .toExist()
    .withTimeout(TIMEOUT_MS);
}

export async function goBack(): Promise<void> {
  await closePushCallbacks();
  if (device.getPlatform() === 'android') {
    await device.pressBack();
    return;
  }
  const backButton = element(by.label('Back').and(by.traits(['button'])));
  await waitFor(backButton).toBeVisible().withTimeout(TIMEOUT_MS);
  await backButton.tap();
}
