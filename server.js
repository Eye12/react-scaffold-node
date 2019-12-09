const express                      = require("express"),
      app                          = express(),
      opn                          = require("better-opn"),
      webpack                      = require("webpack"),
      webpackDevMiddleWare         = require("webpack-dev-middleware"),
      webpackHotMiddleWare         = require("webpack-hot-middleware"),
      historyApiFallback           = require("connect-history-api-fallback"),
      {port}                       = require("./productInfo/index"),
      {CONFIG, progressBarOptions} = require("./webpack.config")(true),
      ProgressBar                  = require("progress-bar-webpack-plugin");
let compiler = webpack(CONFIG); // webpack编译项目
app.use(historyApiFallback({
    htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
    rewrites: [{
        from: /^\/([a-zA-Z0-9]+\/?)([a-zA-Z0-9]+)/,
        to: function(context) {
            console.log("=========>>>", context.match);
            return '/';
        }
        // to: (context) => {
        //     return "/" + context.match[1] + context.match[2] + ".html"
        // }
    }]
})); // 重定向
app.use(webpackDevMiddleWare(compiler, {
    publicPath: CONFIG.output.publicPath
}));
app.use(webpackHotMiddleWare(compiler, {
    log: false,
    heartbeat: 2000,
})); // 热更新
new ProgressBar(progressBarOptions).apply(compiler);
let server = app.listen(port, () => {
    let {port} = server.address();
    console.log("server is running successfully at http://localhost:%s", port);
    opn(`http://localhost:${port}`);
});
