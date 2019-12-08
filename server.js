const express                      = require("express"),
      app                          = express(),
      opn                          = require("better-opn"),
      webpack                      = require("webpack"),
      webpackDevMiddleWare         = require("webpack-dev-middleware"),
      webpackHotMiddleWare         = require("webpack-hot-middleware"),
      {port}                       = require("./productInfo/index"),
      {CONFIG, progressBarOptions} = require("./webpack.config")(true),
      ProgressBar                  = require("progress-bar-webpack-plugin");
let compiler = webpack(CONFIG); // webpack编译项目
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
