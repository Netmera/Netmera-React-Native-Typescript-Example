/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 180000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/NetmeraTSExample.app',
      build:
        'xcodebuild -workspace ios/NetmeraTSExample.xcworkspace -scheme NetmeraTSExample -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew :app:assembleDebug :app:assembleAndroidTest -DtestBuildType=debug',
      reversePorts: [8081, 8089],
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {type: 'iPhone 17 Pro'},
    },
    emulator: {
      type: 'android.emulator',
      device: {avdName: 'Pixel_8'},
    },
  },
  configurations: {
    'ios.sim.debug': {device: 'simulator', app: 'ios.debug'},
    'android.emu.debug': {device: 'emulator', app: 'android.debug'},
  },
};
