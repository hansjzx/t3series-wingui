const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { ESBuildPlugin } = require('esbuild-loader')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'js/bundle/[name].js',
    chunkFilename: 'js/bundle/[name].bundle.js',
    sourceMapFilename: 'js/bundle/[name].js.map',
    libraryTarget: 'window',
    path: path.resolve(__dirname, '../../src/main/webapp')
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]((?!(realgrid)).*)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        commons: {
          name: 'commons',
          minChunks: 1,
          chunks: 'initial',
        }
      }
    }
  },
  plugins: [new ESBuildPlugin()],
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)?$/,
        exclude: /[\\/]node_modules[\\/]((?!(@zionex)).*)[\\/]/,
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx',
          target: 'es2015'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader",]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader",]
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.scss'],
    modules: ['node_modules'],
    alias: {
      request$: 'xhr',
      '@wingui': path.resolve(__dirname, 'src/')
    }
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    open: true,
    proxy: {
      '*': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
};
