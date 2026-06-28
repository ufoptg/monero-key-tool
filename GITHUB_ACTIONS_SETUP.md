# GitHub Actions: build & sign the APK

This repo includes `.github/workflows/build-apk.yml`. On every push to `main`
(or a `v*` tag, or manual run) GitHub will build the APK on an x86_64 runner
(no aapt2 workaround needed there) and sign it.

## 1. Push the project to your repo
The repo root must contain `package.json`, `capacitor.config.json`, `www/`, `android/`
and `.github/`. From the extracted `keytool-app/` folder:
```bash
cd keytool-app
git init
git remote add origin https://github.com/ufoptg/monero-key-tool.git
git add .
git commit -m "Monero key tool + CI"
git branch -M main
git push -u origin main
```

## 2. Create a signing keystore (once, on your machine)
```bash
keytool -genkeypair -v -keystore release.jks -alias monerokeytool \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass "YOUR_STORE_PASS" -keypass "YOUR_KEY_PASS" \
  -dname "CN=Monero Key Tool, O=ufoptg, C=US"
```
Then base64-encode it for the secret:
```bash
base64 -w0 release.jks > release.jks.b64    # Linux
# macOS:  base64 -i release.jks -o release.jks.b64
```

## 3. Add repo secrets
GitHub → your repo → **Settings → Secrets and variables → Actions → New repository secret**.
Add these four:

| Secret name        | Value                                   |
|--------------------|-----------------------------------------|
| `KEYSTORE_BASE64`  | contents of `release.jks.b64`           |
| `KEYSTORE_PASSWORD`| your `YOUR_STORE_PASS`                   |
| `KEY_ALIAS`        | `monerokeytool`                         |
| `KEY_PASSWORD`     | your `YOUR_KEY_PASS`                     |

> If you skip the secrets, the workflow still runs and produces a **debug-signed**
> APK so you always get a build — but add the secrets for a proper release-signed one.

## 4. Get the APK
- **Actions tab** → latest run → **Artifacts → `monero-key-tool-apk`** (download `monero-key-tool.apk`).
- Or push a tag to also publish it as a Release asset:
  ```bash
  git tag v1.0 && git push origin v1.0
  ```
  → the APK is attached to the `v1.0` release automatically.

## Keep the keystore safe
Back up `release.jks` + its passwords. You need the **same** keystore to ship
future updates (Android requires updates to be signed by the same key).
Never commit `release.jks` to the repo — it lives only in Secrets.
