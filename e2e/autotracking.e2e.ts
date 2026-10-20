import {expect as jestExpect} from '@jest/globals';
import {by, device, element} from 'detox';
import {launchAppWithStub} from './support/launchApp';
import {goBack, openMenu, tap, tapInScroll} from './support/navigation';
import * as stub from './support/stubClient';

const SCREEN = 'AutoTrackingAutomation';
const ID = 'autotracking.automation';

const TRACKED = {v: 1, scv: true, ife: true, itd: true, cv: false};
const WHITELISTED = {
  v: 1,
  scv: true,
  ife: true,
  itd: false,
  tsv: [{pt: SCREEN, sc: 'automation_screen'}],
  tsa: [{pt: `${SCREEN}|${ID}.plainButton`, sc: 'automation_plain_button', at: 0}],
};

const SCREEN_VIEW = 'n:shvt';
const ACTION = 'n:vat';
const WHITELISTED_SCREEN_VIEW = 'n:shv';
const WHITELISTED_ACTION = 'n:va';
const ALL_CODES = [SCREEN_VIEW, ACTION, WHITELISTED_SCREEN_VIEW, WHITELISTED_ACTION];

const MANUAL = -1;
const BUTTON = 0;
const SWITCH = 3;
const TEXT = 4;

const TIMEOUT_MS = 10000;
const SETTLE_MS = 3000;

interface TrackedEvent {
  code: string;
  eb?: string;
  ea?: string;
  ed?: number;
}

async function launchWithConfig(cfg: object): Promise<void> {
  await stub.respond('session/init', {cfg});
  await launchAppWithStub();
}

async function openAutomationScreen(): Promise<void> {
  await openMenu(['home.menu.autotracking', 'autotracking.menu.automation']);
}

async function recordedEvents(after: number, codes: string[]): Promise<TrackedEvent[]> {
  return (
    (await stub.requests())
      .slice(after)
      .filter(request => request.path.includes('event/fire'))
      .flatMap(request => JSON.parse(request.body).events as TrackedEvent[])
      .filter(event => codes.includes(event.code))
      // The navigation helpers close the demo's push callback modal, which is tracked too.
      .filter(event => !event.eb?.endsWith('|pushCallbacks.close'))
      .map(({code, eb, ea, ed}) => ({code, eb, ea, ed}))
  );
}

/** Waits for `count` events, then for the settle window, so that extra events are caught too. */
async function trackedEvents(after: number, codes: string[], count = 0) {
  const deadline = Date.now() + TIMEOUT_MS;
  while ((await recordedEvents(after, codes)).length < count && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  await new Promise(resolve => setTimeout(resolve, SETTLE_MS));
  return recordedEvents(after, codes);
}

const byPath = (a: TrackedEvent, b: TrackedEvent) => (a.eb ?? '').localeCompare(b.eb ?? '');

// One tap can be reported as several events, in no guaranteed order.
async function expectActions(act: () => Promise<void>, expected: TrackedEvent[]) {
  const after = await stub.requestCount();
  await act();
  const actions = await trackedEvents(after, [ACTION], expected.length);
  jestExpect(actions.sort(byPath)).toEqual([...expected].sort(byPath));
}

const action = (path: string, ed: number, screen = SCREEN): TrackedEvent => ({
  code: ACTION,
  eb: `${screen}|${path}`,
  ed,
});

describe('Autotracking', () => {
  beforeEach(async () => {
    await stub.reset();
  });

  describe('with tracking on', () => {
    beforeEach(async () => {
      await launchWithConfig(TRACKED);
      await openAutomationScreen();
    });

    it('opening a screen tracks its route name', async () => {
      const after = await stub.requestCount();
      await goBack();
      await openMenu(['autotracking.menu.automation']);

      jestExpect(await trackedEvents(after, [SCREEN_VIEW], 2)).toEqual([
        {code: SCREEN_VIEW, eb: 'Autotracking'},
        {code: SCREEN_VIEW, eb: SCREEN},
      ]);
    });

    it('returning from a pushed screen tracks the screen again', async () => {
      const after = await stub.requestCount();
      await tap(`${ID}.openPlainScreen`);
      await goBack();

      jestExpect(await trackedEvents(after, [SCREEN_VIEW], 2)).toEqual([
        {code: SCREEN_VIEW, eb: 'AutoTrackingAutomationPlain'},
        {code: SCREEN_VIEW, eb: SCREEN},
      ]);
    });

    it('a modal is tracked as a screen and its actions use its name', async () => {
      const after = await stub.requestCount();
      await tap(`${ID}.openModal`);
      await tap(`${ID}.closeModal`);

      jestExpect(await trackedEvents(after, [SCREEN_VIEW], 2)).toEqual([
        {code: SCREEN_VIEW, eb: 'AutoTrackingAutomationModal'},
        {code: SCREEN_VIEW, eb: SCREEN},
      ]);
      jestExpect(await recordedEvents(after, [ACTION])).toContainEqual(
        action(`${ID}.closeModal`, BUTTON, 'AutoTrackingAutomationModal'),
      );
    });

    it('an alert is not tracked as a screen', async () => {
      const after = await stub.requestCount();
      await tap(`${ID}.openAlert`);
      await element(by.text('OK')).tap();

      jestExpect(await trackedEvents(after, [SCREEN_VIEW])).toEqual([]);
    });

    it('a button tap is tracked', async () => {
      await expectActions(
        () => tapInScroll(`${ID}.plainButton`, ID),
        [action(`${ID}.plainButton`, BUTTON)],
      );
    });

    // useTapTracking does not check `disabled`, so a disabled button is tracked as a tap.
    it.skip('a disabled button is not tracked [RN SDK bug]', async () => {
      await expectActions(() => tapInScroll(`${ID}.disabledButton`, ID), []);
    });

    it('a switch toggle is tracked', async () => {
      await expectActions(() => tapInScroll(`${ID}.switch`, ID), [action('Switch', SWITCH)]);
    });

    // A tap on a TextInput produces no event on Android.
    (device.getPlatform() === 'ios' ? it : it.skip)(
      'a text field tap is tracked [RN SDK bug on Android]',
      async () => {
        await expectActions(
          () => tapInScroll(`${ID}.textField`, ID),
          [action(`${ID}.textField`, TEXT)],
        );
      },
    );

    it('a manual action is tracked under the current screen', async () => {
      await expectActions(
        () => tapInScroll(`${ID}.manualAction`, ID),
        [action('manualAction', MANUAL), action(`${ID}.manualAction`, BUTTON)],
      );
    });

    it('a tap on text inside a card is tracked as the card', async () => {
      await expectActions(() => tapInScroll(`${ID}.cardTitle`, ID), [action(`${ID}.card`, BUTTON)]);
    });

    it('a tap on an icon inside a card is tracked as the icon only', async () => {
      await expectActions(
        () => tapInScroll(`${ID}.cardInfoIcon`, ID),
        [action(`${ID}.cardInfoIcon`, BUTTON)],
      );
    });

    it('a tap inside nested cards is tracked as the inner card', async () => {
      await expectActions(
        () => tapInScroll(`${ID}.innerCardTitle`, ID),
        [action(`${ID}.innerCard`, BUTTON)],
      );
    });

    it('a button without an id is tracked by its text', async () => {
      await expectActions(
        () => tapInScroll(`${ID}.textOnlyButtonTitle`, ID),
        [action('Text Only Button', BUTTON)],
      );
    });

    it('a tap on text without a press action is not tracked', async () => {
      await expectActions(() => tapInScroll(`${ID}.plainText`, ID), []);
    });
  });

  describe('with collect values on', () => {
    beforeEach(async () => {
      await launchWithConfig({...TRACKED, cv: true});
      await openAutomationScreen();
    });

    it('a list item tap carries its position', async () => {
      await expectActions(
        () => tapInScroll(`${ID}.listItem.1`, ID),
        [action(`FlatList|${ID}.listItem.1|index:1`, BUTTON)],
      );
    });

    it('a switch toggle carries its value', async () => {
      await expectActions(() => tapInScroll(`${ID}.switch`, ID), [action('Switch|true', SWITCH)]);
    });
  });

  describe('with a whitelist', () => {
    beforeEach(async () => {
      await launchWithConfig(WHITELISTED);
    });

    it('a whitelisted screen is sent with its short code only', async () => {
      const after = await stub.requestCount();
      await openAutomationScreen();

      jestExpect(await trackedEvents(after, ALL_CODES, 1)).toEqual([
        {code: WHITELISTED_SCREEN_VIEW, ea: 'automation_screen'},
      ]);
    });

    it('a whitelisted action is sent with its short code', async () => {
      await openAutomationScreen();
      const after = await stub.requestCount();
      await tapInScroll(`${ID}.plainButton`, ID);

      jestExpect(await trackedEvents(after, ALL_CODES, 1)).toEqual([
        {code: WHITELISTED_ACTION, ea: 'automation_plain_button', ed: BUTTON},
      ]);
    });

    it('an action that is not whitelisted is not sent', async () => {
      await openAutomationScreen();
      const after = await stub.requestCount();
      await tapInScroll(`${ID}.switch`, ID);

      jestExpect(await trackedEvents(after, ALL_CODES)).toEqual([]);
    });
  });

  it('with tracking off nothing is sent', async () => {
    await launchWithConfig({v: 1, scv: false, ife: false, itd: true});
    const after = await stub.requestCount();
    await openAutomationScreen();
    await tapInScroll(`${ID}.plainButton`, ID);
    await tapInScroll(`${ID}.switch`, ID);

    jestExpect(await trackedEvents(after, ALL_CODES)).toEqual([]);
  });
});
