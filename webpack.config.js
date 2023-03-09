// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'index.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 5000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
        options: {
          configFile: path.resolve(__dirname, "tsconfig.json"),
        },
      },
      {
        test: /\.css$/i,
        use: [
          stylesHandler,
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          stylesHandler,
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".css", ".scss", ".sass", "..."],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/, //匹配min.js结尾的文件进行压缩
      }),
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
