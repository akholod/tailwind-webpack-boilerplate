/* eslint-disable */
const path = require("path");
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
  return files_.map(file => file.replace(pagesPath, '').slice(1)).filter(f => f);
}
const htmlPages = getHtmlFiles('src/pages');
console.log('htmlPages :', htmlPages);

module.exports = {
  devtool: "inline-source-map",
  devServer: {
    publicPath: "/",
    port: 9000,
    contentBase: path.join(process.cwd(), "src"),
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
          loader: 'html-loader?interpolate=require',
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
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
      template: "src/pages/index.html",
      filename: 'index.html'
    }),
    ...htmlPages.map((page) => new HtmlWebpackPlugin({
      template: `src/pages/${page}/index.html`,
      filename: `${page}/index.html`
    })),

    new CleanWebpackPlugin(),
  ]
};
