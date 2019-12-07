const {htmlTitle}          = require("./productInfo/index"),
      HtmlWebpackPlugin    = require("html-webpack-plugin"),
      DashboardPlugin      = require("webpack-dashboard/plugin"),
      {CleanWebpackPlugin} = require('clean-webpack-plugin'),
      BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
      ProgressBar          = require("progress-bar-webpack-plugin"),
      chalk                = require("chalk"),
      path                 = require("path");
let progressBarOptions = {
    format: chalk.magentaBright('  Progressing ') + chalk.magenta.bgMagenta.bold(' [:bar] ') + chalk.magentaBright(' :percent ') + chalk.greenBright(' (:elapsed seconds) '),
    clear: false
};

let getConfig = (isDev = false) => {
    const CONFIG = {
        mode: isDev ? "development" : "production",
        entry: "./src/index",
        output: {
            publicPath: isDev ? "/" : "", // 线上地址
            path: path.resolve(__dirname, "./dist"),
            filename: isDev ? "js/[name].js" : "js/[name].[hash].js"
        },
        module: {
            rules: [{
                test: /\.js$/i,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: "babel-loader"
                }]
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: htmlTitle,
                template: "./layout/index.html",
                minify: {
                    collapseWhitespace: !isDev
                },
                inject: true,
                // favicon: "./favicon.ico",
            }),
            new DashboardPlugin(),
            // new BundleAnalyzerPlugin(), // 测试打包模块情况时候用
            new CleanWebpackPlugin(),
        ]
    };
    if (!isDev) {
        CONFIG.plugins.push(new ProgressBar(progressBarOptions));
        return CONFIG;
    } else {
        return {
            CONFIG,
            progressBarOptions
        }
    }
};
module.exports = getConfig;
