/* eslint-disable no-unused-vars */
const path = require('path')

module.exports = {
  reactScriptsVersion: 'react-scripts',

  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: {
        postcssOptions: {
          plugins: [
            require('postcss-flexbugs-fixes'),
            [
              require('postcss-preset-env'),
              {
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
                features: {
                  'custom-properties': false,
                  'nesting-rules': true,
                  'postcss-svgo': false,
                },
              },
            ],
            require('postcss-rtl'),
          ],
        },
      },
    },
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: ['node_modules', 'src/assets']
        }
      }
    },
  },

  webpack: {
    configure: (config) => {
      // 🔥 CRITICAL FIX
      config.output.publicPath = "/";
      return config;
    },
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/@core/assets'),
      '@components': path.resolve(__dirname, 'src/@core/components'),
      '@layouts': path.resolve(__dirname, 'src/@core/layouts'),
      '@store': path.resolve(__dirname, 'src/redux'),
      '@styles': path.resolve(__dirname, 'src/@core/scss'),
      '@configs': path.resolve(__dirname, 'src/configs'),
      '@utils': path.resolve(__dirname, 'src/utility/Utils'),
      '@hooks': path.resolve(__dirname, 'src/utility/hooks')
    }
  },

  eslint: {
    enable: true,
    mode: 'extends',
  },
}
