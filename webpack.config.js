const {htmlTitle, entryFileName} = require("./productInfo/index"),
      HtmlWebpackPlugin          = require("html-webpack-plugin"),
      DashboardPlugin            = require("webpack-dashboard/plugin"),
      {CleanWebpackPlugin}       = require('clean-webpack-plugin'),
      {BundleAnalyzerPlugin}     = require('webpack-bundle-analyzer'), // 测试打包模块情况时候用
      MiniCssExtractPlugin       = require("mini-css-extract-plugin"),
      webpack                    = require("webpack"),
      PurgecssPlugin             = require('purgecss-webpack-plugin'),
      glob                       = require("glob"),
      ProgressBar                = require("progress-bar-webpack-plugin"),
      HappyPack                  = require("happypack"), // 开启多进程打包
      os                         = require("os"),
      OptimizeCss                = require("optimize-css-assets-webpack-plugin"),
      TerserWebpackPlugin        = require("terser-webpack-plugin"), // 与optimize.minimize一起使用，压缩JS
      chalk                      = require("chalk"),
      path                       = require("path"),
      happyThreadPool            = HappyPack.ThreadPool({size: os.cpus().length});

let progressBarOptions = {
        format: chalk.magentaBright('  Progressing ') + chalk.magenta.bgMagenta.bold(' [:bar] ') + chalk.magentaBright(' :percent ') + chalk.greenBright(' (:elapsed seconds) '),
        clear: false
    },
    entry              = "./src/" + entryFileName,
    getConfig          = (isDev = false) => {
        const CONFIG = {
            mode: isDev ? "development" : "production",
            entry: isDev ? ["webpack-hot-middleware/client?noInfo=true&reload=true", entry] : entry,
            output: {
                publicPath: isDev ? "/" : "", // 线上地址
                path: path.resolve(__dirname, "./dist"),
                filename: isDev ? "js/[name].js" : "js/[name].[hash].js"
            },
            resolve: {
                extensions: ["tsx", "ts", ".jsx", ".js"],
                // alias: {
                //     "images": path.resolve(__dirname, "assets/images"),
                //     "audios": path.resolve(__dirname, "assets/audios"),
                //     "fonts": path.resolve(__dirname, "assets/fonts"),
                //     "styles": path.resolve(__dirname, "src/styles"),
                //     "@": path.resolve(__dirname)
                // }
            },
            // externals: {
            //     react: "react"
            // },
            devtool: isDev ? "cheap-module-inline-source-map" : "cheap-module-source-map",
            // devtool: isDev ? "cheap-module-eval-source-map" : "cheap-module-source-map",
            optimization: {
                removeAvailableModules: true, // 在所有父级块组中已经可用的模块都会被从块中移除
                runtimeChunk: {
                    name: entrypoint => `runtime~${entrypoint.name}`
                }, // 单独提取包含chunks映射关系的list
                usedExports: true, // 清楚无用死代码
                minimize: !isDev,
                minimizer: isDev ? [] : [new TerserWebpackPlugin({}), new OptimizeCss({})],
                splitChunks: {
                    chunks: "all", // 默认作用于异步chunk，值为all/initial/async/function(chunk) sync异步代码分割 initial同步代码分割 all同步异步分割都开启
                    minSize: 30000,  // 表示在压缩前的最小模块大小,默认值是30kb
                    // maxSize: 50000,  // 50kb，尝试将大于50kb的文件拆分成n个50kb的文件
                    minChunks: 1, // 表示被引用次数，默认为1；
                    maxAsyncRequests: 5, // 所有异步请求不得超过5个
                    maxInitialRequests: 3, // 初始话并行请求不得超过3个
                    automaticNameDelimiter: '~', // 名称分隔符，默认是~
                    name: true,  // 打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔
                    cacheGroups: { // 缓存组，将所有加载模块放在缓存里面一起分割打包
                        vendors: {
                            name: 'vendors',
                            chunks: 'initial', // 入口处提取
                            // test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                            test: /[\\/]node_modules[\\/]/,
                            minSize: 0,
                            minChunks: 1,
                            priority: -10 // 该配置项是设置处理的优先级，数值越大越优先处理
                        },
                        commons: {
                            name: "comomns",
                            test: /[\\/]src[\\/]/,
                            // test: /[\\/]src[\\/]common[\\/]/,
                            // test: path.resolve("src/commons"), // 如果你想单独打包src/common
                            // reuseExistingChunk: true, // 模块嵌套引入时，判断是否复用已经被打包的模块
                            minChunks: 2, // 最小共用次数
                            minSize: 0, // 代码最小多大，进行抽离
                            priority: -20, // 该配置项是设置处理的优先级，数值越大越优先处理
                        }
                    }
                }
            },
            module: {
                rules: [
                    {
                        enforce: "pre",
                        test: /\.jsx?$/i,
                        exclude: /(node_modules|bower_components)/,
                        use: "happypack/loader?id=eslint-js"
                    }, {
                        test: /\.jsx?$/i,
                        exclude: /(node_modules|bower_components)/,
                        use: "happypack/loader?id=babel-js"
                    },
                    // {
                    //     enforce: "pre",
                    //     test: /\.tsx?$/i,
                    //     exclude: /(node_modules|bower_components)/,
                    //     use: [{
                    //         loader: "tslint-loader"
                    //     }]
                    // }, {
                    //     enforce: "pre",
                    //     test: /\.tsx?$/i,
                    //     exclude: /(node_modules|bower_components)/,
                    //     use: [{
                    //         loader: "babel-loader?cacheDirectory=true" // cacheDirectory对于rebuild有很大提升
                    //     }, {
                    //         loader: "ts-loader"
                    //     }]
                    // },
                    {
                        test: /\.(c|s[ac]ss)$/i,
                        exclude: /(node_modules|bower_components)/,
                        use: [
                            isDev ? {loader: "style-loader"} : {loader: MiniCssExtractPlugin.loader},
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: isDev,
                                }
                            },
                            {
                                loader: "postcss-loader", // 主要使用两个插件
                                options: {
                                    sourceMap: isDev,
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
                                    sourceMap: isDev,
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
                    }, {
                        test: /\.(ttf|svg|woff2?|eot)|(mp3)$/i,
                        exclude: /node_modules/,
                        use: {
                            loader: "url-loader",
                            query: {
                                name: isDev ? "[name].[ext]" : "[name][hash].[ext]",
                                limit: 0,
                                fallback: "file-loader",
                                outputPath: "./assets/fonts", // 相对于当前配置文件的
                                publicPath: "../assets/fonts", // 打包出来的css url前面添加的公共路径
                            }
                        }
                    }, {
                        test: /\.(mtl|obj|stl)$/i,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: "[name].[ext]",
                                    outputPath: "./assets/dateFile",
                                    // publicPath: "../dist/assets/dateFile"
                                },
                            },
                        ],
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
                // new MiniCssExtractPlugin({
                //     filename: isDev ? "styles/[name].css" : "styles/[name].[hash].css",
                //     chunkFilename: isDev ? "styles/[id].css" : "styles/[id].[hash].css",
                //     ignoreOrder: false, // Enable to remove warnings about conflicting order
                // }),
                // new webpack.ProvidePlugin({
                //     "React": "react",
                //     "$": "jquery",
                //     "xxx": "react-router-dom",
                //     "ReactDOM": "react-dom",
                // }),
                // new webpack.ProgressPlugin({
                //     GG: "xxx"
                // }),
                new PurgecssPlugin({
                    paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, {nodir: true}),
                }),
                new HappyPack({
                    id: 'babel-js',
                    // threads: 2,
                    threadPool: happyThreadPool, // 共享进程池
                    verbose: true, // 允许 HappyPack 输出日志
                    loaders: [{
                        loader: "babel-loader?cacheDirectory=true" // cacheDirectory对于rebuild有很大提升
                    }]
                }),
                new HappyPack({
                    id: 'eslint-js',
                    // threads: 2,
                    threadPool: happyThreadPool, // 共享进程池
                    verbose: true, // 允许 HappyPack 输出日志
                    loaders: [{
                        loader: "eslint-loader",
                        options: {
                            formatter: require("eslint-friendly-formatter")
                        }
                    }]
                }),
                new DashboardPlugin(),
                new CleanWebpackPlugin(),
            ]
        };
        if (!isDev) {
            CONFIG.plugins.push(new ProgressBar(progressBarOptions), new BundleAnalyzerPlugin());
            // CONFIG.plugins.push(new ProgressBar(progressBarOptions));
            return CONFIG;
        } else {
            CONFIG.plugins.push(new webpack.HotModuleReplacementPlugin());
            return {
                CONFIG,
                progressBarOptions
            }
        }
    };

module.exports = getConfig;
