module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk" //1.4的老项目用这个"theme-default" ，2.0的用theme-chalk，假设没效果看看官网又把默认的主题改 成那个了 跟着改一下应该就可以
      }
    ]
  ]
};
