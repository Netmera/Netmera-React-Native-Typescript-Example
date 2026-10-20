import {expect as jestExpect} from '@jest/globals';
import {device} from 'detox';
import {launchAppWithStub} from './support/launchApp';
import {
  answerIosLocationPrompt,
  grantLocationAlwaysOnIosWhileRunning,
  installWithLocation,
  relaunchWithLocationDenied,
} from './support/location';
import {openMenu} from './support/navigation';
import * as stub from './support/stubClient';

const LOCATION_AUTHORIZATION = 'n:la';
const BACKGROUND_PERMISSION_MISSING = 'n:blp';
const LOCATION_UPDATE = 'n:lu';

const NOT_DETERMINED = 0;
const DENIED = 2;
const ALWAYS = 3;
const WHEN_IN_USE = 4;

const ISTANBUL = {latitude: 41.0082, longitude: 28.9784};

const isIos = () => device.getPlatform() === 'ios';

async function waitForEvent(code: string, after: number, timeoutMs?: number) {
  const request = await stub.waitForRequest('event/fire', {
    after,
    bodyContains: `"${code}"`,
    timeoutMs,
  });
  return JSON.parse(request.body).events.find((event: {code: string}) => event.code === code);
}

describe('Location', () => {
  beforeEach(async () => {
    await stub.reset();
  });

  it('an Always permission is reported as Always', async () => {
    const after = await stub.requestCount();
    await installWithLocation('always');

    jestExpect((await waitForEvent(LOCATION_AUTHORIZATION, after)).fe).toBe(ALWAYS);
  });

  it('a When In Use permission is reported as When In Use', async () => {
    const after = await stub.requestCount();
    await installWithLocation('inuse');

    jestExpect((await waitForEvent(LOCATION_AUTHORIZATION, after)).fe).toBe(WHEN_IN_USE);
  });

  it('a revoked permission is reported as Denied without the background permission event', async () => {
    await installWithLocation('always');
    jestExpect((await waitForEvent(LOCATION_AUTHORIZATION, 0)).fe).toBe(ALWAYS);
    const after = await stub.requestCount();
    await relaunchWithLocationDenied();

    jestExpect((await waitForEvent(LOCATION_AUTHORIZATION, after)).fe).toBe(DENIED);
    await stub.expectNoRequest('event/fire', {
      after,
      bodyContains: `"${BACKGROUND_PERMISSION_MISSING}"`,
    });
  });

  it('Request Location Authorization reports a missing background permission', async () => {
    if (isIos()) {
      await launchAppWithStub({delete: true, permissions: {location: 'unset'}});
    } else {
      await installWithLocation('inuse');
    }
    await openMenu(['home.menu.location']);
    const after = await stub.requestCount();
    await openMenu(['location.menu.requestLocationAuthorization']);
    if (isIos()) {
      await answerIosLocationPrompt('Allow While Using App');
    }

    await waitForEvent(BACKGROUND_PERMISSION_MISSING, after);
  });

  // Detox answers system prompts on iOS only.
  (isIos() ? it : it.skip)(
    'Allow Once is reported as not determined after a relaunch',
    async () => {
      await launchAppWithStub({delete: true, permissions: {location: 'unset'}});
      await openMenu(['home.menu.location']);
      const afterPrompt = await stub.requestCount();
      await openMenu(['location.menu.requestLocationAuthorization']);
      await answerIosLocationPrompt('Allow Once');
      jestExpect((await waitForEvent(LOCATION_AUTHORIZATION, afterPrompt)).fe).toBe(WHEN_IN_USE);

      const afterRelaunch = await stub.requestCount();
      await launchAppWithStub();

      jestExpect((await waitForEvent(LOCATION_AUTHORIZATION, afterRelaunch)).fe).toBe(
        NOT_DETERMINED,
      );
    },
  );

  it('location history sends location updates', async () => {
    // Android checks location history only when geofences are configured.
    await stub.respond('session/init', {
      cfg: {
        locHist: true,
        geofs: [{id: 'e2e', lt: ISTANBUL.latitude, lng: ISTANBUL.longitude, r: 100}],
      },
    });
    await device.setLocation(ISTANBUL.latitude, ISTANBUL.longitude);
    const after = await stub.requestCount();
    if (isIos()) {
      // iOS starts location updates when the authorization changes while the app runs.
      await launchAppWithStub({delete: true, permissions: {location: 'unset'}});
      grantLocationAlwaysOnIosWhileRunning();
    } else {
      await installWithLocation('always');
    }

    await waitForEvent(LOCATION_UPDATE, after, 30000);
  });
});
