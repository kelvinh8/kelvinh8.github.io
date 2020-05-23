const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common,{
    mode:'development',
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test: /\.(svg|eot|woff|woff2|ttf)$/,
                use: [
                    {
                        loader:'file-loader',
                        options:{
                          name:"[name].[ext]",
                        }
                    }
                ]
            }
        ]
    }
})