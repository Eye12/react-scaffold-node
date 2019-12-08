const {htmlTitle}          = require("./productInfo/index"),
      HtmlWebpackPlugin    = require("html-webpack-plugin"),
      DashboardPlugin      = require("webpack-dashboard/plugin"),
      {CleanWebpackPlugin} = require('clean-webpack-plugin'),
      BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
      MiniCssExtractPlugin = require("mini-css-extract-plugin"),
      PurgecssPlugin = require('purgecss-webpack-plugin'),
      glob                 = require("glob"),
      ProgressBar          = require("progress-bar-webpack-plugin"),
      HappyPack            = require("happypack"), // 开启多进程打包
      os                   = require("os"),
      OptimizeCss          = require("optimize-css-assets-webpack-plugin"),
      chalk                = require("chalk"),
      path                 = require("path"),
      happyThreadPool      = HappyPack.ThreadPool({size: os.cpus().length});
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
        resolve: {
            extensions: [".jsx", ".js"],
            // alias: {
            //     "images": path.resolve(__dirname, "assets/images"),
            //     "audios": path.resolve(__dirname, "assets/audios"),
            //     "fonts": path.resolve(__dirname, "assets/fonts"),
            //     "styles": path.resolve(__dirname, "src/styles"),
            //     "@": path.resolve(__dirname)
            // }
        },
        devtool: isDev ? "cheap-module-inline-source-map" : "cheap-module-source-map",
        // devtool: isDevMode ? "cheap-module-eval-source-map" : "cheap-module-source-map",
        optimization: {
            minimize: true,
            minimizer: [new OptimizeCss({})]
        },
        module: {
            rules: [{
                test: /\.jsx?$/i,
                exclude: /(node_modules|bower_components)/,
                use: "happypack/loader?id=babel"
            }, {
                test: /\.(c|s[ac]ss)$/i,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, // 提取压缩CSS
                        options: {
                            hrm: isDev,
                            reloadAll: isDev
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: isDev
                        }
                    },
                    {
                        loader: "postcss-loader", // 主要使用两个插件
                        options: {
                            plugins: [
                                require("postcss-sprites")({ // 用于合成雪碧图
                                    spritePath: "./dist/assets/images",
                                    retina: true
                                }),
                                require("autoprefixer")() // 添加浏览器内核前缀
                            ]
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            implementation: require("node-sass"),
                            sassOptions: {
                                fiber: false
                            }
                        }
                    }]
            }, {
                test: /\.(png|jpg|gif)$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: "[name].[ext]",
                            limit: 8192,
                            fallback: 'responsive-loader',
                            quality: 85,
                            outputPath: "./assets/images", // 相对于当前配置文件的
                            // publicPath: "../assets/images" // 打包出来的css url前面添加的公共路径
                        },
                    },
                ],
            },]
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
            new MiniCssExtractPlugin({
                filename: isDev ? "styles/[name].css" : "styles/[name].[hash].css",
                chunkFilename: isDev ? "styles/[id].css" : "styles/[id].[hash].css",
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            }),
            new PurgecssPlugin({
                paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`,  { nodir: true }),
            }),
            new HappyPack({
                id: 'babel',
                // threads: 2,
                threadPool: happyThreadPool, // 共享进程池
                verbose: true, // 允许 HappyPack 输出日志
                loaders: [{
                    loader: "babel-loader?cacheDirectory=true" // cacheDirectory对于rebuild有很大提升
                }]
            }),
            // new BundleAnalyzerPlugin(), // 测试打包模块情况时候用
            new DashboardPlugin(),
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
