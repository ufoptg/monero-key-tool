const MyMoneroLibAppBridgeClass = require('@mymonero/mymonero-app-bridge/MyMoneroLibAppBridgeClass')
const wasmFactory = require('@mymonero/mymonero-app-bridge/MyMoneroLibAppCpp_WASM')
const wasmB64 = require('./keytool_wasm_base64.js')

function b64ToBytes (b64) {
  const bin = atob(b64)
  const len = bin.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

window.__coreReady = wasmFactory({ wasmBinary: b64ToBytes(wasmB64) }).then(function (mod) {
  return new MyMoneroLibAppBridgeClass(mod)
})

// nettype: 0 = MAINNET, 1 = TESTNET, 2 = STAGENET
window.deriveFromMnemonic = async function (mnemonic, nettype) {
  const core = await window.__coreReady
  const clean = String(mnemonic).trim().replace(/\s+/g, ' ')
  return core.seed_and_keys_from_mnemonic(clean, typeof nettype === 'number' ? nettype : 0)
}
