import {by, element} from 'detox';
import {closePushCallbacks, openMenu} from './navigation';

export const LOGIN_EVENT_CODE = 'n:cl';

/** Sends a login event from the Events screen, starting from Home. */
export async function sendLoginEvent(): Promise<void> {
  await openMenu(['home.menu.events']);
  await closePushCallbacks();
  await element(by.text('LOGIN EVENT')).tap();
}
