# Monero Seed → Keys (offline tool)

Paste a **13-word (MyMonero)** or **25-word** Monero mnemonic and get back the
**private spend key, private view key, public spend/view keys, and the public address** —
so you can import the wallet into anything "by keys".

Runs 100% locally. No network calls. Uses the same audited **mymonero-core** WebAssembly
engine the MyMonero app uses (verified: derived address/keys round-trip correctly).

## Two versions in this folder

### 1. `monero-key-tool.html`  — desktop / any browser
- Single self-contained file (the WASM is embedded as base64, nothing to fetch).
- Just **double-click it** / open in any browser. Works with no internet.
- Tip: for max safety, disconnect Wi-Fi before pasting a seed.

### 2. `monero-key-tool.apk`  — Android
- Package: `com.offline.monerokeytool`  ·  label "Monero Key Tool"
- Signed (v1+v2+v3), minSdk 22 (Android 5.1+).
- SHA-256: `f47c9f880b06f7576f2ab2b9ba43748eb1b9423b42f61f43fe487c45c54ce662`
- Install: enable "Install unknown apps" → tap the APK → "Install anyway" on the
  Play Protect prompt. It's its own app (no conflict with anything else).

## How to use
1. Open the tool (HTML or app).
2. Pick the network (Mainnet is default).
3. Paste your seed phrase (13 or 25 words).
4. Tap **Derive keys**.
5. Copy the keys/address. Import into Cake Wallet / Feather / Monerujo / etc.
   ("Restore from keys": use the **address + private view key + private spend key**).

## Safety
- The **private spend key** controls your funds — never share it or paste it into any
  website you don't fully trust. This tool keeps everything on-device, but treat the
  output like cash.
- Best practice: run it on an offline device, then move funds to a fresh wallet.

## Build provenance
- Web engine: `@mymonero/mymonero-app-bridge` WASM (`seed_and_keys_from_mnemonic`, nettype 0=mainnet).
- APK: Capacitor 3 wrapper around the same web build; built on aarch64 with an
  aarch64 `aapt2` override, Gradle 7.6.4 + JDK 17, AGP 7.1.3, compileSdk 30.
