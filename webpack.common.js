const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const generateHtmlPlugins = templateDir=>{
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    // Create new HTMLWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: `pages/${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject:false
    })
  })
}
const htmlPlugins = generateHtmlPlugins('./src/pages')

module.exports = {
    entry:{
      main:'./src/js/main.js',
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].bundle.js',
    },
    plugins:[
      new webpack.ProvidePlugin({
        $:'jquery'
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template:'./src/index.html',
        filename:'index.html',
      }),
      new CopyWebpackPlugin({
        patterns:[
          {from:path.resolve(__dirname, 'src', 'images/assets'),to:'assets'},
          {from:path.resolve(__dirname,'src','js/push.js')}
        ]
      })
    ]
    .concat(htmlPlugins)
}
