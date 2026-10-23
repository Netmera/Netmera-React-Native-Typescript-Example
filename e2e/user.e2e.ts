import {expect as jestExpect} from '@jest/globals';
import {by, element} from 'detox';
import {launchAppWithStub} from './support/launchApp';
import {openMenu, tap, tapInScroll, typeText} from './support/navigation';
import * as stub from './support/stubClient';

const PROFILE_PATH = 'user/update-user-profile';

async function setProfileField(id: string, operation: string, value: string) {
  await tap(`userProfile.${id}.operation.${operation}`);
  await typeText(`userProfile.${id}.value`, value);
  // The keyboard would cover the submit buttons further down the form.
  await element(by.id(`userProfile.${id}.value`)).tapReturnKey();
}

// Matching on the typed value skips profile requests the SDK resends from an earlier test.
async function submitProfile(bodyContains: string, buttonId = 'userProfile.submit') {
  const after = await stub.requestCount();
  await tapInScroll(buttonId, 'userProfile.scroll');
  const request = await stub.waitForRequest(PROFILE_PATH, {after, bodyContains});
  return JSON.parse(request.body).prfl;
}

async function fetchCouponFilter() {
  const after = await stub.requestCount();
  await tap('coupons.fetch');
  const body = JSON.parse((await stub.waitForRequest('coupon/fetch', {after})).body);
  // iOS nests the paging under "filter", Android sends it at the top level.
  return body.filter ?? body;
}

describe('User', () => {
  beforeEach(async () => {
    await stub.reset();
    await launchAppWithStub();
  });

  describe('Identify', () => {
    beforeEach(async () => {
      await openMenu(['home.menu.user', 'user.menu.identify']);
    });

    it('Identify User sends user/update-identify', async () => {
      await typeText('userIdentify.userId', 'ui-test-user');
      const after = await stub.requestCount();
      await tapInScroll('userIdentify.submit', 'userIdentify.scroll');
      await stub.waitForRequest('user/update-identify', {after, bodyContains: 'ui-test-user'});
    });

    it('Identify User With Callback sends user/update-identify', async () => {
      await typeText('userIdentify.email', 'uitest@example.com');
      const after = await stub.requestCount();
      await tapInScroll('userIdentify.submitWithCallback', 'userIdentify.scroll');
      await stub.waitForRequest('user/update-identify', {
        after,
        bodyContains: 'uitest@example.com',
      });
    });
  });

  describe('Update', () => {
    beforeEach(async () => {
      await openMenu(['home.menu.user', 'user.menu.update']);
    });

    it('Name Set is sent as pa SET', async () => {
      await setProfileField('name', 'set', 'Ali');

      const profile = await submitProfile('Ali');
      jestExpect(profile.pa).toEqual([{opr: 'SET', value: 'Ali'}]);
    });

    it('Update User With Callback sends the profile', async () => {
      await setProfileField('name', 'set', 'Test');

      const profile = await submitProfile('Test', 'userProfile.submitWithCallback');
      jestExpect(profile.pa).toEqual([{opr: 'SET', value: 'Test'}]);
    });

    it('an empty name is left out of the profile', async () => {
      await tap('userProfile.name.operation.set');
      // The SDK sends nothing for an empty profile, so another field is set.
      await setProfileField('surname', 'set', 'Doe');

      const profile = await submitProfile('Doe');
      jestExpect(profile.pa).toBeUndefined();
    });

    it('External Segments Add is sent as pc ADD', async () => {
      await setProfileField('externalSegments1', 'add', 'seg1,seg2');

      const profile = await submitProfile('seg2');
      jestExpect(profile.pc).toEqual([{opr: 'ADD', value: ['seg1', 'seg2']}]);
    });

    it('External Segments Remove is sent as pc REMOVE', async () => {
      await setProfileField('externalSegments1', 'remove', 'seg1');

      const profile = await submitProfile('REMOVE');
      jestExpect(profile.pc).toEqual([{opr: 'REMOVE', value: ['seg1']}]);
    });
  });

  describe('Settings', () => {
    it('opening User Settings reads the three permissions', async () => {
      await openMenu(['home.menu.user']);
      const after = await stub.requestCount();
      await openMenu(['user.menu.settings']);

      await stub.waitForRequest('user/getEmailPermission', {after});
      await stub.waitForRequest('user/getSmsPermission', {after});
      await stub.waitForRequest('user/getWhatsAppPermission', {after});
    });

    it.each([
      ['email', 'user/setEmailPermission'],
      ['sms', 'user/setSmsPermission'],
      ['whatsApp', 'user/setWhatsAppPermission'],
    ])('Allow and Disallow %s send %s', async (channel, path) => {
      await openMenu(['home.menu.user', 'user.menu.settings']);

      for (const allowed of [true, false]) {
        const after = await stub.requestCount();
        const action = allowed ? 'allow' : 'disallow';
        await tapInScroll(`userSettings.${channel}.${action}`, 'userSettings.scroll');
        const request = await stub.waitForRequest(path, {after});
        jestExpect(JSON.parse(request.body).allowed).toBe(allowed);
      }
    });
  });

  describe('Coupons', () => {
    beforeEach(async () => {
      await openMenu(['home.menu.user', 'user.menu.coupons']);
    });

    it('Fetch Coupons sends the default page and size', async () => {
      const filter = await fetchCouponFilter();
      jestExpect(filter.page).toBe(0);
      jestExpect(filter.max).toBe(10);
    });

    it('Fetch Coupons sends the typed page and size', async () => {
      await typeText('coupons.page.textField', '2');
      await typeText('coupons.max.textField', '5');

      const filter = await fetchCouponFilter();
      jestExpect(filter.page).toBe(2);
      jestExpect(filter.max).toBe(5);
    });
  });
});
