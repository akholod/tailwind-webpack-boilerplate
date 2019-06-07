/* eslint-disable */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require('fs');

function getHtmlFiles(pagesPath = 'src/pages', files_ = []) {
  const files = fs.readdirSync(path.resolve(__dirname, pagesPath));
  files.forEach(filename => {
    const filepath = path.resolve(__dirname, pagesPath, filename);
    if(fs.statSync(filepath).isDirectory()) {
      getHtmlFiles(`${pagesPath}/${filename}`, files_);
    } else {
      files_.push(pagesPath);
    }
  });
  return files_.map(file => file.replace(pagesPath, '').slice(1));
}
const htmlPages = getHtmlFiles('src/pages');

module.exports = {
  devtool: "inline-source-map",
  devServer: {
    publicPath: "/",
    port: 9000,
    contentBase: path.join(process.cwd(), "dist"),
    host: "localhost",
    historyApiFallback: true,
    noInfo: false,
    stats: "minimal",
    hot: true
  },
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, "src")],
        loader: "babel-loader",
        test: /\.js$/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",

            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
          }
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        ]
      }
    ]
  },

  output: {
    chunkFilename: "[name].[hash].js",
    filename: "[name].[hash].js"
  },

  mode: "development",

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: "async",
      minChunks: 1,
      minSize: 30000,
      name: true
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: 'index.html'
    }),
    ...htmlPages.map((page) => new HtmlWebpackPlugin({
      template: `src/pages/${page}/index.html`,
      filename: `${page}/index.html`
    }))
  ]
};
