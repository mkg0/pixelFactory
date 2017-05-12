const webpack = require("webpack");
const prod = 0 <= process.argv.indexOf("-p");
const path = require("path");

module.exports = {
  entry: {
    main: hotInject("./app/index.js")
  },
  output: {
    path: path.join(__dirname, "docs"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|es6)$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader?importLoaders=1", "postcss-loader"]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "file-loader",
            query: {
              // publicPath: prod ? "/docs/" : "/",
              hash: "sha512",
              name: "[hash].[ext]"
            }
          },
          {
            loader: "image-webpack-loader",
            query: {
              bypassOnDebug: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [path.resolve("./node_modules"), path.resolve("./app")]
  },
  context: __dirname,
  devtool: prod ? "source-map" : "eval-source-map",
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, "docs"),
    publicPath: "/docs/",
    historyApiFallback: true,
    port: 8080,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  plugins: prod
    ? [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new webpack.optimize.MinChunkSizePlugin({
          minChunkSize: 10000
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          output: {
            comments: false
          },
          sourceMap: true
        }),
        new webpack.optimize.AggressiveMergingPlugin()
      ]
    : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
      ]
};

function hotInject(path) {
  return prod
    ? [path]
    : [
        "react-hot-loader/patch",
        "webpack-dev-server/client?http://localhost:8080",
        "webpack/hot/only-dev-server",
        path.replace(/\.js/, ".dev.js")
      ];
}
