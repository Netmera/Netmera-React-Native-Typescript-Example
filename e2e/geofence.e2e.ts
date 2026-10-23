import {expect as jestExpect} from '@jest/globals';
import {device} from 'detox';
import {
  type Coordinate,
  installAndroidTestLocationProvider,
  installWithLocation,
  moveIosSimulator,
  removeAndroidTestLocationProvider,
  setAndroidTestLocation,
} from './support/location';
import {openMenu} from './support/navigation';
import * as stub from './support/stubClient';

const LOCATION_AUTHORIZATION = 'n:la';
const GEOFENCE_TRANSITION = 'n:gu';
const ENTERED = 0;
const EXITED = 1;

const INSIDE = {latitude: 41.0082, longitude: 28.9784};
// ~2 km north, outside the 150 m region.
const OUTSIDE = {latitude: 41.0262, longitude: 28.9784};

// Android reports an ENTER only after the 20 s DWELL loitering delay.
const TRANSITION_TIMEOUT_MS = 120000;

type SdkEvent = {code: string; ea?: string; eb?: string; fy?: number};

const isIos = () => device.getPlatform() === 'ios';

const geofences = (count: number) =>
  Array.from({length: count}, (_, i) => ({
    id: `e2e-${i}`,
    lt: INSIDE.latitude,
    lng: INSIDE.longitude,
    r: 150,
  }));

async function eventsAfter(after: number): Promise<SdkEvent[]> {
  return (await stub.requests())
    .slice(after)
    .filter(request => request.path.includes('event/fire'))
    .flatMap(request => JSON.parse(request.body).events as SdkEvent[]);
}

async function waitForEvent(
  matches: (event: SdkEvent) => boolean,
  after: number,
  {timeoutMs = 20000, whilePolling = () => {}} = {},
): Promise<SdkEvent> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    whilePolling();
    const match = (await eventsAfter(after)).find(matches);
    if (match) {
      return match;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  const codes = (await eventsAfter(after)).map(event => event.code);
  throw new Error(`No matching event. Received: ${codes.join(', ')}`);
}

const monitoringStarted = (messageContains: string) => (event: SdkEvent) =>
  event.code === 'n:log' &&
  event.ea === 'geofence' &&
  !!event.eb?.startsWith('Geofence monitoring started.') &&
  event.eb.includes(messageContains);

// The iOS SDK reports geofence monitoring as an n:log diagnostic; Android only logs it locally.
// Monitoring needs location permission, and a reinstall clears the diagnostic the SDK last reported.
describe('Geofence monitoring', () => {
  beforeEach(async () => {
    await stub.reset();
  });

  (isIos() ? it : it.skip)('configured geofences are reported as monitored', async () => {
    await stub.respond('session/init', {cfg: {geofs: geofences(2)}});
    await installWithLocation('always');

    const {eb} = await waitForEvent(monitoringStarted('configured=2'), 0);

    jestExpect(eb).toContain('monitoring=2');
    jestExpect(eb).toContain('controllerRegion=false');
  });

  (isIos() ? it : it.skip)(
    'Set Max Active Region below the configured count switches to a controller region',
    async () => {
      await stub.respond('session/init', {cfg: {geofs: geofences(12)}});
      await installWithLocation('always');
      await waitForEvent(monitoringStarted('configured=12'), 0);

      await openMenu(['home.menu.location']);
      const after = await stub.requestCount();
      await openMenu(['location.menu.setMaxActiveRegion']);

      const {eb} = await waitForEvent(monitoringStarted('controllerRegion=true'), after);
      jestExpect(eb).toContain('limit=10');
      // The exact count depends on SDK timing; native test_12 checks the same range.
      const monitoring = Number(/monitoring=(\d+)/.exec(eb ?? '')?.[1]);
      jestExpect(monitoring).toBeGreaterThanOrEqual(1);
      jestExpect(monitoring).toBeLessThan(12);
    },
  );

  (isIos() ? it : it.skip)('no geofences send no monitoring diagnostic', async () => {
    await installWithLocation('always');
    // Starts the negative window after the launch-time location report, not just session/init.
    await waitForEvent(event => event.code === LOCATION_AUTHORIZATION, 0);

    await stub.expectNoRequest('event/fire', {bodyContains: '"geofence"'});
  });
});

describe('Geofence transitions', () => {
  const regionId = 'e2e-crossing';

  // iOS moves along a route; GMS samples the location only every few seconds,
  // so Android re-sends it while waiting.
  const cross = async (from: Coordinate, to: Coordinate, type: number) => {
    const after = await stub.requestCount();
    if (isIos()) {
      moveIosSimulator(from, to);
    }
    return waitForEvent(
      event => event.code === GEOFENCE_TRANSITION && event.fy === type && event.ea === regionId,
      after,
      {
        timeoutMs: TRANSITION_TIMEOUT_MS,
        whilePolling: isIos() ? undefined : () => setAndroidTestLocation(to),
      },
    );
  };

  beforeEach(async () => {
    await stub.reset();
    await stub.respond('session/init', {
      cfg: {geofs: [{id: regionId, lt: INSIDE.latitude, lng: INSIDE.longitude, r: 150}]},
    });
    if (isIos()) {
      await device.setLocation(OUTSIDE.latitude, OUTSIDE.longitude);
    } else {
      installAndroidTestLocationProvider();
      setAndroidTestLocation(OUTSIDE);
    }
    await installWithLocation('always');
  });

  afterEach(() => {
    if (!isIos()) {
      removeAndroidTestLocationProvider();
    }
  });

  it(
    'entering a region sends an enter event',
    async () => {
      await cross(OUTSIDE, INSIDE, ENTERED);
    },
    TRANSITION_TIMEOUT_MS + 60000,
  );

  it(
    'leaving a region sends an exit event',
    async () => {
      // The SDK drops an exit without a prior enter.
      await cross(OUTSIDE, INSIDE, ENTERED);

      await cross(INSIDE, OUTSIDE, EXITED);
    },
    2 * TRANSITION_TIMEOUT_MS + 60000,
  );
});
