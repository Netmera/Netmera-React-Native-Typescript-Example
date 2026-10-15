import {by, element, waitFor} from 'detox';

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
    await waitFor(element(by.id(rowId)))
      .toBeVisible()
      .whileElement(by.id(`${menuId}.menu`))
      .scroll(200, 'down');
    await element(by.id(rowId)).tap();
  }
}

// `toExist` rather than `toBeVisible`: the screen wrapper is transparent, which
// fails Detox's pixel-based visibility check on iOS. Screens are mounted only
// once navigated to, so existence is enough.
export async function expectScreen(routeName: string): Promise<void> {
  await waitFor(element(by.id(`screen.${routeName}`)))
    .toExist()
    .withTimeout(TIMEOUT_MS);
}
