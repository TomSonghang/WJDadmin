import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "./store";

// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// Vue.use(ElementUI);

import animated from "animate.css";
import "./plugins/element.js";
import "@/style/index.less";
import "normalize.css";

import * as filter from "@/utils/filter.js";
// import "element-ui/lib/theme-chalk/index";

import { hasPermission, enterNumber } from "@/utils/directive.js";
hasPermission();
enterNumber();

Object.keys(filter).forEach((key) => {
  Vue.filter(key, filter[key]);
});

Vue.use(animated);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
//测试git SSH协议
