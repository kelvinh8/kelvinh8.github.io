const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const {GenerateSW,InjectManifest} = require('workbox-webpack-plugin');

module.exports = merge(common,{
    mode:'production',
    module:{
        rules:[
            {
              test:/\.css$/,
              use:[
                MiniCssExtractPlugin.loader,
                "css-loader"
              ]   
            },
            {
              test: /\.(svg|eot|woff|woff2|ttf)$/,
              use: [
                  {
                      loader:'file-loader',
                      options:{
                        outputPath:url=>{
                          if(url.indexOf("MaterialIcons") > -1){
                            return `/MaterialIcons/${url}`
                          }else{
                            return `${url}`
                          }
                        },
                        name:"[name].[ext]",
                      }
                  }
              ]
          }
        ]
    },
    plugins:[
      new MiniCssExtractPlugin(),
      new WebpackPwaManifest({
        name: 'Submission 2 Football PWA',
        short_name: 'Football PWA',
        description: 'TUGAS SUBMISSION 2',
        background_color: '#ACA7A7',
        theme_color: "#FFFFFF",
        start_url: '/index.html',
        display: "standalone",
        gcm_sender_id:"377328385962",
        icons: [
          {
            "src": "./src/images/icons/icon-72x72.png",
            "type": "image/png",
            "sizes": "72x72",
            "destination":"/icons/"
          },
          {
            "src": "./src/images/icons/icon-96x96.png",
            "type": "image/png",
            "sizes": "96x96",
            "destination":"/icons/"
          },
          {
            "src": "./src/images/icons/icon-128x128.png",
            "type": "image/png",
            "sizes": "128x128",
            "destination":"/icons/"
          },
          {
            "src": "./src/images/icons/icon-144x144.png",
            "type": "image/png",
            "sizes": "144x144",
            "destination":"/icons/"
          },
          {
            "src": "./src/images/icons/icon-192x192.png",
            "type": "image/png",
            "sizes": "192x192",
            "destination":"/icons/"
          },
          {
            "src": "./src/images/icons/icon-256x256.png",
            "type": "image/png",
            "sizes": "256x256",
            "destination":"/icons/"
          },
          {
            "src": "./src/images/icons/icon-384x384.png",
            "type": "image/png",
            "sizes": "384x384",
            "destination":"/icons/"
          },
          {
            "src": "./src/images/icons/icon-512x512.png",
            "type": "image/png",
            "sizes": "512x512",
            "destination":"/icons/"
          }
        ]
      }),
      // new GenerateSW({
      //   swDest: 'sw.js',
      //   clientsClaim: true,
      //   skipWaiting: true,
      //   exclude: [new RegExp('/icons/icon_')],
      //   runtimeCaching: [{
      //     urlPattern: new RegExp('https://'),
      //     handler: 'StaleWhileRevalidate',
      //     options:{
      //       cacheName:'football-api-request',
      //       expiration:{
      //         maxEntries:50,
      //         maxAgeSeconds:30 * 24 * 60 * 60
      //       }
      //     }
      //   }]
      // })
      new InjectManifest({
        swSrc: './src/sw.js',
        swDest: 'sw.js',
        exclude: [new RegExp('/icons/icon_')]
      })
    ]
})