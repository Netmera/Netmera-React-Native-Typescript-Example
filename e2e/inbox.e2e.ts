import {expect as jestExpect} from '@jest/globals';
import {by, device, element, waitFor} from 'detox';
import {launchAppWithStub} from './support/launchApp';
import {openMenu, tap} from './support/navigation';
import * as stub from './support/stubClient';

const FETCH = 'inbox/fetch';
const COUNT = 'inbox/count';
const CATEGORY_COUNT = 'inbox/categoryCount';
const SET = 'inbox/set';

const pushInstanceId = (n: number) =>
  device.getPlatform() === 'ios' ? `piid-${n}` : `ui-test-piid-${n}`;

// Android messages carry an empty `prms` as the server sends it; see the skipped test below.
const messages = (count: number) => ({
  msgs: Array.from({length: count}, (_, i) =>
    device.getPlatform() === 'ios'
      ? {
          aps: {
            alert: {title: `Title ${i + 1}`, body: 'Body'},
            badge: 1,
            'content-available': 0,
          },
          _nm: {
            pt: 1,
            pid: `pid-${i + 1}`,
            piid: pushInstanceId(i + 1),
            st: 2,
          },
        }
      : {
          pid: `pid-${i + 1}`,
          piid: pushInstanceId(i + 1),
          sts: 0,
          st: 2,
          prms: {},
        },
  ),
  cnts: {},
});
const GENERAL_PREFERENCE = {cts: [{ctid: 1, ctn: 'General', cte: true}]};
const GENERAL_WITH_UNREAD = {
  cnt: [
    device.getPlatform() === 'ios'
      ? {ct: 'General', st: {'2': 3}}
      : {ct: 'General', st: {'2': 3}, msg: {sts: 0, prms: {}}},
  ],
};
const HAS_NEXT_PAGE = {prms: {nId: 1}};

async function bodyOf(path: string, after: number) {
  return JSON.parse((await stub.waitForRequest(path, {after})).body);
}

async function openInbox() {
  const after = await stub.requestCount();
  await openMenu(['home.menu.inbox']);
  await stub.waitForRequest(FETCH, {after});
}

async function chooseMenuItem(id: string) {
  await tap('inbox.list.menu');
  await tap(`inbox.menu.${id}`);
}

describe('Inbox', () => {
  beforeEach(async () => {
    await stub.reset();
    await launchAppWithStub();
  });

  it('opening the inbox fetches messages and counts', async () => {
    const after = await stub.requestCount();
    await openInbox();

    const fetch = await bodyOf(FETCH, after);
    jestExpect(fetch.st).toBe(3);
    jestExpect(fetch.ie).toBe(true);
    jestExpect((await bodyOf(COUNT, after)).st).toBe(7);
  });

  // Bridge reads `includeExpiredObjects`; NMInboxStatusCountFilter sets `includeExpired`.
  it.skip('the count carries Include expired [bridge bug]', async () => {
    const after = await stub.requestCount();
    await openInbox();

    jestExpect((await bodyOf(COUNT, after)).ie).toBe(true);
  });

  // RN Android maps `prms` without a null check; the server always sends one today.
  it.skip('a message without custom JSON is listed [bridge bug, Android]', async () => {
    await stub.respond(FETCH, {
      msgs: [{pid: 'pid-1', piid: pushInstanceId(1), sts: 0, st: 2}],
      cnts: {},
    });
    await openInbox();

    await waitFor(element(by.id('inbox.list.cell.0')))
      .toExist()
      .withTimeout(10000);
  });

  it('the Unread chip fetches unread messages', async () => {
    await openInbox();
    const after = await stub.requestCount();
    await tap('inbox.list.chip.Unread');

    jestExpect((await bodyOf(FETCH, after)).st).toBe(2);
  });

  it('a category chip sends the category to fetch', async () => {
    await stub.respond('user/getCategoryPreferences', GENERAL_PREFERENCE);
    await openInbox();
    await waitFor(element(by.id('inbox.list.chip.General')))
      .toExist()
      .withTimeout(10000);
    const after = await stub.requestCount();
    await tap('inbox.list.chip.General');

    jestExpect((await bodyOf(FETCH, after)).cats).toEqual(['General']);
  });

  // `categoryList` is typed as numbers: Android sends ids, iOS drops non-strings.
  it.skip('a category chip sends the category to count [bridge bug]', async () => {
    await stub.respond('user/getCategoryPreferences', GENERAL_PREFERENCE);
    await openInbox();
    await waitFor(element(by.id('inbox.list.chip.General')))
      .toExist()
      .withTimeout(10000);
    const after = await stub.requestCount();
    await tap('inbox.list.chip.General');

    jestExpect((await bodyOf(COUNT, after)).cats).toEqual(['General']);
  });

  it('Show deleted messages fetches every status', async () => {
    await openInbox();
    const after = await stub.requestCount();
    await chooseMenuItem('showDeleted');

    jestExpect((await bodyOf(FETCH, after)).st).toBe(7);
  });

  it('Include expired off is sent to fetch', async () => {
    await openInbox();
    const after = await stub.requestCount();
    await chooseMenuItem('includeExpired');

    jestExpect((await bodyOf(FETCH, after)).ie).toBe(false);
  });

  it('Load next page fetches again', async () => {
    await stub.respond(FETCH, {...messages(1), ...HAS_NEXT_PAGE});
    await openInbox();
    const after = await stub.requestCount();
    await chooseMenuItem('loadNextPage');

    await stub.waitForRequest(FETCH, {after, bodyContains: '"nId"'});
  });

  it.each([
    ['markAllRead', 1],
    ['markAllUnread', 2],
  ])('%s updates every message', async (menuItem, status) => {
    await openInbox();
    const after = await stub.requestCount();
    await chooseMenuItem(menuItem);

    const body = await bodyOf(SET, after);
    jestExpect(body.st).toBe(status);
    jestExpect(body.all).toBe(true);
  });

  it('Delete all deletes every message after confirming', async () => {
    await openInbox();
    const after = await stub.requestCount();
    await chooseMenuItem('deleteAll');
    await element(by.text('Delete')).tap();

    const body = await bodyOf(SET, after);
    jestExpect(body.st).toBe(4);
    jestExpect(body.all).toBe(true);
  });

  // iOS bridge expects (categoryNames, status); TS sends (fromIndex, toIndex, status).
  (device.getPlatform() === 'ios' ? it.skip : it)(
    'Mark all as read on a category chip updates that category [bridge bug on iOS]',
    async () => {
      await stub.respond('user/getCategoryPreferences', GENERAL_PREFERENCE);
      await stub.respond(CATEGORY_COUNT, GENERAL_WITH_UNREAD);
      await openInbox();
      await waitFor(element(by.id('inbox.list.chip.General')))
        .toExist()
        .withTimeout(10000);
      let after = await stub.requestCount();
      await tap('inbox.list.chip.General');
      await stub.waitForRequest(CATEGORY_COUNT, {after});
      after = await stub.requestCount();
      await chooseMenuItem('markAllRead');

      const body = await bodyOf(SET, after);
      jestExpect(body.st).toBe(1);
      jestExpect(body.cats).toEqual(['General']);
      jestExpect(body.all).toBe(false);
    },
  );

  it('two selected rows are marked read together', async () => {
    await stub.respond(FETCH, messages(2));
    await openInbox();
    await element(by.id('inbox.list.cell.0')).longPress();
    await tap('inbox.list.cell.1');
    const after = await stub.requestCount();
    await tap('inbox.list.selection.read');

    const body = await bodyOf(SET, after);
    jestExpect(body.st).toBe(1);
    jestExpect([...body.piids].sort()).toEqual([pushInstanceId(1), pushInstanceId(2)]);
  });

  it('opening an unread message marks it read', async () => {
    await stub.respond(FETCH, messages(1));
    await openInbox();
    const after = await stub.requestCount();
    await tap('inbox.list.cell.0');

    const body = await bodyOf(SET, after);
    jestExpect(body.st).toBe(1);
    jestExpect(body.piids).toEqual([pushInstanceId(1)]);
    await waitFor(element(by.id('inbox.detail')))
      .toExist()
      .withTimeout(10000);
  });

  it('Delete in the message detail deletes that message', async () => {
    await stub.respond(FETCH, messages(1));
    await openInbox();
    let after = await stub.requestCount();
    await tap('inbox.list.cell.0');
    await stub.waitForRequest(SET, {after});
    after = await stub.requestCount();
    await tap('inbox.detail.delete');

    const body = await bodyOf(SET, after);
    jestExpect(body.st).toBe(4);
    jestExpect(body.piids).toEqual([pushInstanceId(1)]);
  });

  // Updates go by index; marking read drops the message from the Unread list and shifts it.
  it.skip('Delete in the detail of an Unread chip message deletes that message [bridge bug]', async () => {
    await stub.respond(FETCH, messages(2));
    await openInbox();
    let after = await stub.requestCount();
    await tap('inbox.list.chip.Unread');
    await stub.waitForRequest(FETCH, {after});
    after = await stub.requestCount();
    await tap('inbox.list.cell.0');
    await stub.waitForRequest(SET, {after});
    after = await stub.requestCount();
    await tap('inbox.detail.delete');

    const body = await bodyOf(SET, after);
    jestExpect(body.st).toBe(4);
    jestExpect(body.piids).toEqual([pushInstanceId(1)]);
  });

  // Same index shift: the first delete drops a row, so the second range points past it.
  it.skip('deleting two separate selected rows deletes exactly those messages [bridge bug]', async () => {
    await stub.respond(FETCH, messages(3));
    await openInbox();
    await element(by.id('inbox.list.cell.0')).longPress();
    await tap('inbox.list.cell.2');
    const after = await stub.requestCount();
    await tap('inbox.list.selection.delete');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const deleted = (await stub.requests())
      .slice(after)
      .filter(request => request.path.includes(SET))
      .flatMap(request => JSON.parse(request.body).piids);
    jestExpect(deleted.sort()).toEqual([pushInstanceId(1), pushInstanceId(3)]);
  });

  it('opening the inbox fetches the category summary', async () => {
    const after = await stub.requestCount();
    await openInbox();

    const body = await bodyOf(CATEGORY_COUNT, after);
    jestExpect(body.st).toBe(3);
    jestExpect(body.ie).toBe(true);
    jestExpect(body.ps).toBe(10);
  });

  it('a category with unread messages shows the count on its chip', async () => {
    await stub.respond(CATEGORY_COUNT, GENERAL_WITH_UNREAD);
    await openInbox();

    await waitFor(element(by.text('General · 3')))
      .toExist()
      .withTimeout(10000);
  });

  it('category summary paging stops once no new category arrives', async () => {
    await stub.respond(CATEGORY_COUNT, {
      ...HAS_NEXT_PAGE,
      ...GENERAL_WITH_UNREAD,
    });
    const after = await stub.requestCount();
    await openInbox();
    await stub.waitForRequest(CATEGORY_COUNT, {after});
    await new Promise(resolve => setTimeout(resolve, 4000));

    const pages = (await stub.requests())
      .slice(after)
      .filter(request => request.path.includes(CATEGORY_COUNT)).length;
    jestExpect(pages).toBeGreaterThanOrEqual(2);
    jestExpect(pages).toBeLessThan(5);
  });

  it('Show deleted messages asks the category summary for every status', async () => {
    await openInbox();
    const after = await stub.requestCount();
    await chooseMenuItem('showDeleted');

    jestExpect((await bodyOf(CATEGORY_COUNT, after)).st).toBe(7);
  });
});
