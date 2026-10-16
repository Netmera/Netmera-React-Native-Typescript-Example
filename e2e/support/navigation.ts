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
    await tapInScroll(rowId, `${rowId.slice(0, separator)}.menu`);
  }
}

/** Scrolls `scrollId` until the element is visible, then taps it. */
export async function tapInScroll(id: string, scrollId: string): Promise<void> {
  await withPushCallbacksClosed(async () => {
    await waitFor(element(by.id(id)))
      .toBeVisible()
      .whileElement(by.id(scrollId))
      .scroll(200, 'down');
    await element(by.id(id)).tap();
  });
}

export async function tap(id: string): Promise<void> {
  await withPushCallbacksClosed(() => element(by.id(id)).tap());
}

export async function typeText(id: string, text: string): Promise<void> {
  await withPushCallbacksClosed(() => element(by.id(id)).replaceText(text));
}

/**
 * The demo opens its Push Callbacks window whenever the SDK reports a push
 * callback (e.g. registration), at a time the test cannot predict. A step it
 * covered is retried once after closing it.
 */
async function withPushCallbacksClosed(step: () => Promise<unknown>): Promise<void> {
  await closePushCallbacks();
  try {
    await step();
  } catch (error) {
    if (!(await closePushCallbacks())) {
      throw error;
    }
    await step();
  }
}

async function closePushCallbacks(): Promise<boolean> {
  const closeButton = element(by.id('pushCallbacks.close'));
  try {
    await expect(closeButton).toBeVisible();
  } catch {
    return false;
  }
  await closeButton.tap();
  return true;
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
  await withPushCallbacksClosed(async () => {
    await waitFor(backButton).toBeVisible().withTimeout(TIMEOUT_MS);
    await backButton.tap();
  });
}
