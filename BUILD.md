# Monero Key Tool — build from source

Capacitor app that wraps the offline "seed → keys" web tool into an Android APK.

## Layout
- `www/index.html`          – the UI
- `www/keytool.bundle.js`   – prebuilt web bundle (mymonero-core WASM embedded as base64)
- `android/`                – the native Android project (compiles to the APK)
- `web-src/`                – source used to (re)generate `www/keytool.bundle.js`

## Prerequisites
- Node 18/20 + npm
- JDK 17
- Android SDK (cmdline-tools) with: platform-tools, `platforms;android-30`, `build-tools;30.0.3`
- Gradle is provided by the wrapper (`./gradlew`, version 7.6.4)

## A) Rebuild the APK (web bundle already included)
```bash
npm install
npx cap sync android
cd android
echo "sdk.dir=/path/to/Android/sdk" > local.properties
./gradlew assembleDebug
# APK -> android/app/build/outputs/apk/debug/app-debug.apk
```
> Building on a normal **x86_64** PC/Mac just works.
> On **aarch64** Linux, Google ships only x86_64 `aapt2`, so add an aarch64 aapt2 and pass:
> `./gradlew assembleDebug -Pandroid.aapt2FromMavenOverride=/path/to/aarch64/aapt2`
> (aarch64 build-tools: https://github.com/lzhiyong/android-sdk-tools/releases)

## B) Sign the APK (so it installs cleanly)
```bash
keytool -genkeypair -v -keystore my.jks -alias k -keyalg RSA -keysize 2048 \
  -validity 10000 -storepass YOURPASS -keypass YOURPASS -dname "CN=Monero Key Tool"
zipalign -f -p 4 app-debug.apk aligned.apk
apksigner sign --ks my.jks --ks-key-alias k --ks-pass pass:YOURPASS --key-pass pass:YOURPASS \
  --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true \
  --min-sdk-version 22 --out monero-key-tool.apk aligned.apk
apksigner verify --verbose monero-key-tool.apk
```

## C) (Optional) Rebuild the web bundle in web-src/
`www/keytool.bundle.js` is generated from `web-src/keytool_entry.js` and the
`@mymonero/mymonero-app-bridge` npm package (which ships the WASM core). To regenerate:
1. In a project that has `@mymonero/mymonero-app-bridge` installed, copy in `web-src/*`.
2. Generate `keytool_wasm_base64.js` from the package's `MyMoneroLibAppCpp_WASM.wasm`:
   `python3 -c "import base64;open('keytool_wasm_base64.js','w').write('module.exports=\"'+base64.b64encode(open('.../MyMoneroLibAppCpp_WASM.wasm','rb').read()).decode()+'\";')"`
3. `webpack --config webpack.keytool.js`  → outputs `keytool_dist/keytool.bundle.js`
4. Copy that to `www/keytool.bundle.js`.

## Notes
- Native gotchas already applied in this project: AGP 7.1.3, Gradle 7.6.4 (JDK 17 compat),
  repositories switched from dead jcenter → mavenCentral, cordova framework 7.0.0 → 10.1.2,
  minSdk 21 → 22.
- appId: `com.offline.monerokeytool`. Change it in `capacitor.config.json` +
  `android/app/build.gradle` (applicationId) if you want.
