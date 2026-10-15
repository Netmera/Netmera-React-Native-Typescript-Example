import {openMenu} from './navigation';

export const LOGIN_EVENT_CODE = 'n:cl';

/** Sends a login event from the Events screen, starting from Home. */
export async function sendLoginEvent(): Promise<void> {
  await openMenu(['home.menu.events', 'events.menu.general', 'general.menu.login']);
}
