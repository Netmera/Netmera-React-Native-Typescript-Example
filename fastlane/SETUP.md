# Fastlane Setup

## Prerequisites

### 1. Install dependencies

```bash
bundle install
bundle exec fastlane install_plugins
```

### 2. Secret files (gitignored — must be added manually)

**`fastlane/.env`**
Environment variables for all sensitive configuration. Create `fastlane/.env` and fill in the values:

```bash
APPLE_ID=your.email@netmera.com
APPLE_TEAM_ID=XXXXXXXXXX         # Apple Developer Portal Team ID
ITC_TEAM_ID=XXXXXXXXX            # App Store Connect Team ID
ASC_KEY_ID=XXXXXXXXXX            # App Store Connect API Key ID
ASC_ISSUER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MATCH_PASSWORD=                  # Passphrase for certs repo encryption
MATCH_GIT_URL=git@github.com:Netmera/netmera-ios-certs.git
```

**`fastlane/Netmera_Auth_Key.p8`**
App Store Connect API key used for TestFlight upload.
Ask a team member or re-download from App Store Connect → Users & Access → Integrations → App Store Connect API.

**`fastlane/netmera-cross-examples-firebase-adminsdk.json`**
Firebase service account used for Android App Distribution authentication.
Ask a team member or download from Firebase Console → `netmera-cross-examples` → Project Settings → Service Accounts → Generate new private key.

### 3. SSH access

Make sure your SSH key has access to the certs repo defined in `MATCH_GIT_URL`.
Run once to confirm the fingerprint:

```bash
ssh -T git@github.com
```

---

## Usage

```bash
# iOS → TestFlight
bundle exec fastlane ios release

# Android → Firebase App Distribution
bundle exec fastlane android release

# With release notes
bundle exec fastlane ios release notes:"2.1.0-beta03 release"
bundle exec fastlane android release notes:"2.1.0-beta03 release"
```

Or via npm scripts:

```bash
npm run release:ios
npm run release:android
npm run release   # both platforms
```

---

## Version number logic

Version is read automatically from `react-native-netmera` in `package.json`:

| package.json | iOS Version | iOS Build | Android versionName | Android versionCode |
|---|---|---|---|---|
| `2.1.0-beta03` | `2.1.0` | `3` | `2.1.0-beta03` | `1` |
| `2.1.0-alpha01` | `2.1.0` | `1` | `2.1.0-alpha01` | `1` |
| `2.1.0` | `2.1.0` | `1` | `2.1.0` | `1` |

---

## Available Actions

### `ios release`

```sh
bundle exec fastlane ios release
```

Syncs provisioning profiles (match), bumps version/build, builds IPA, uploads to TestFlight.

### `android release`

```sh
bundle exec fastlane android release
```

Updates `versionName`/`versionCode` in `build.gradle`, builds release APK, uploads to Firebase App Distribution → `netmera-testers` group.
