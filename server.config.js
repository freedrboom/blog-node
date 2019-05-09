const path = require("path")
const webpack = require("webpack")
var json = require("./package.json")

module.exports = {
  entry: {
    app: path.resolve(__dirname, "src/app.js"),
    testData: path.resolve(__dirname, "src/db-init.js")
    //main: ["babel-polyfill", "./src/main.js"],
    //testData: path.resolve(__dirname, 'src/getTest/index.js')
    //polyfill: "babel-polyfill"
    //vendor: Object.keys(json.dependencies) // 将 第三方依赖 单独打包
  }, //['babel-polyfill', './src/app.js'],
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js", //[chunkhash]
    libraryTarget: "commonjs"
  },
  target: "node",
  resolve: {
    extensions: ['.mjs',".js"]
  },
  //externals: Object.keys(json.dependencies), //只打包自己的代碼
  module: {
    rules: [
      {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread']
            }
          }
      }
    ]
  },
  mode: "development" //production development
}
