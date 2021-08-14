import axios from "axios";
import Qs from "qs";
import store from "@/store";
import router from "@/router";
import Vue from "vue";
import { Loading, Message } from "element-ui"; // 引用element-ui的加载和消息提示组件

const $axios = axios.create({
  timeout: 30000, //超时时间
  baseURL: process.env.VUE_APP_BASE_API,
});

Vue.prototype.$http = axios; //并发请求

let loading = null;
//请求拦截

$axios.interceptors.request.use(
  (config) => {
    loading = Loading.service({ text: "拼命加载中" });
    const token = store.getters.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; //请求头添加TOKEN
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截器
$axios.interceptors.response.use(
  (response) => {
    if (loading) {
      loading.close();
    }
    const code = response.status;
    if ((code >= 200 && code < 300) || code === 304) {
      if (
        //token过期了
        response.data.status == 1004 ||
        response.data.status == 1005 ||
        response.data.status == 1006
      ) {
        Message.error(response.data.message);
        store.dispatch("user/loginOut");
      } else {
        return Promise.resolve(response.data);
      }
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (loading) {
      loading.close;
    }
    console.log(error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          //返回401 清除token信息并跳转到登录页
          store.commit("DEL_TOKEN");
          router.replace({
            path: "/login",
            query: {
              redirect: router.currentRouter.fullPath,
            },
          });
          break;
        default:
          Message.error(error.response.data.message);
      }
    } else {
      //请求超时或者网络问题
      if (error.message.includes("timeout")) {
        Message.error("请求超时!请检查网咯是否正常");
      } else {
        Message.error("请求失败,请检查网络是否已连接");
      }
    }
    return Promise.reject(error);
  }
);

//get,post请求方法
export default {
  post(url, data) {
    return $axios({
      method: "post",
      url,
      data: Qs.stringify(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });
  },
  get(url, params) {
    return $axios({
      method: "get",
      url,
      params,
    });
  },
};
