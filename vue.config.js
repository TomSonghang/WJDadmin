const path = require("path");
const resolve = function(dir) {
  return path.join(__dirname, dir);
};

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: true, // 是否开启eslint保存检测
  productionSourceMap: false, // 是否在构建生产包时生成sourcdeMap
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("views", resolve("src/views"));
    config.optimization.runtimeChunk("single");
  },
  devServer: {
    https: false,
    host: "localhost",
    port: "8090",
    hot: true,
    open: true,
    overlay: {
      warning: false,
      error: true
    },
    proxy: {
      //代理
      [process.env.VUE_APP_BASE_API]: {
        //key表示需要匹配的字符
        target: process.env.VUE_APP_BASE_API, //如果匹配到了,就会被代理到target+pathRewrite
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          //重写
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      }
    }
  }
};
