// webpack.config.server.js
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  name: 'server',
  entry: {
    server: path.resolve(__dirname, 'src/server/server.ts'),
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  externals: [nodeExternals()],
  target: 'node',
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.server.json',
        },
      },
      {
        test: /\.(glb|gltf)$/,
        use:
          [
            {
              loader: 'file-loader',
              options:
              {
                outputPath: 'assets/models/'
              }
            }
          ]
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { context: 'src/server', from: 'views', to: 'views' },
        { context: 'src/server', from: 'public', to: 'static/assets' }
      ],
    }),
  ],
}