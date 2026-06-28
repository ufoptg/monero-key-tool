const path = require('path')

module.exports = {
  mode: 'production',
  target: 'web',
  entry: './keytool_entry.js',
  output: {
    path: path.resolve(__dirname, 'keytool_dist'),
    filename: 'keytool.bundle.js'
  },
  resolve: {
    fallback: {
      fs: false,
      path: false,
      crypto: false,
      worker_threads: false
    }
  },
  node: {
    __dirname: false,
    __filename: false
  },
  performance: { hints: false }
}
