import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

import Layout from "@/layout";
import getTitle from "@/utils/getTitle";
import { Message } from "element-ui";

/**
 * 路由相关属性说明
 * hidden: 当设置hidden为true时，意思不在sideBars侧边栏中显示
 * mete{
 * title: xxx,  设置sideBars侧边栏名称
 * icon: xxx,  设置ideBars侧边栏图标
 * noCache: true  当设置为true时不缓存该路由页面
 * }
 */

export const currencyRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login"),
    meta: { title: "登录页" },
    hidden: true,
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error-page/404.vue"),
    hidden: true,
  },
  {
    path: "/",
    name: "Home",
    component: Layout,
    redirect: "/dashbord",
    children: [
      {
        path: "dashbord",
        name: "Dashbord",
        component: () => import("@/views/dashboard"),
        meta: { title: "首页", icon: "el-icon-s-data" },
      },
    ],
  },
  {
    path: "/personal",
    name: "Personal",
    component: Layout,
    redirect: "/personal/index",
    hidden: true,
    children: [
      {
        path: "index",
        name: "Personal-index",
        component: () => import("@/views/personal"),
        meta: { title: "个人中心" },
      },
    ],
  },
  {
    path: "/driver",
    name: "Driver",
    component: Layout,
    redirect: "/driver/index",
    hidden: true,
    children: [
      {
        path: "index",
        name: "Driver-index",
        component: () => import("@/views/driver-page"),
        meta: { title: "引导指南", icon: "el-icon-s-flag" },
      },
    ],
  },
];

export const asyncRoutes = [
  {
    path: "/userinfo",
    name: "Userinfo",
    component: Layout,
    redirect: "/userinfo/index",
    children: [
      {
        path: "index",
        name: "Userinfo-index",
        component: () => import("@/views/userinfo"),
        meta: { title: "用户信息", icon: "el-icon-user", noCache:true}
      },
    ],
  },
  {
    path: "/productinfo",
    name: "Productinfo",
    component: Layout,
    redirect: "/productinfo/index",
    children: [
      {
        path: "index",
        name: "Productinfo-index",
        component: () => import("@/views/productinfo"),
        meta: { title: "产品信息", icon: "el-icon-takeaway-box", noCache: true},
      },
    ],
  },
  {
    path: "/orderinfo",
    name: "Orderinfo",
    component: Layout,
    redirect: "/orderinfo/index",
    children: [
      {
        path: "index",
        name: "Orderinfo-index",
        component: () => import("@/views/orderinfo/index"),
        meta: { title: "订单信息", icon: "el-icon-receiving", noCache: true},
      },
      {
        path: "orderDetails",
        name: "Order-details",
        component: () => import("@/views/orderinfo/details"),
        meta: { title: "订单信息  /  订单详情" },
        hidden: true,
      },
    ],
  },
  {
    path: "/feedback",
    name: "Feedback",
    component: Layout,
    redirect: "/feedback/index",
    children: [
      {
        path: "index",
        name: "Feedback-index",
        component: () => import("@/views/feedback"),
        meta: { title: "反馈建议", icon: "el-icon-question" },
      },
    ],
  },
  {
    path: "/permission",
    name: "Permission",
    component: Layout,
    redirect: "/permission/page-user",
    //  meta: {
    //    title: "权限许可",
    //    icon: "el-icon-lock",
    //  },
    children: [
      {
        path: "page-user",
        name: "PageUser",
        component: () => import("@/views/permission/page-user"),
        meta: {
          title: "管理账号",
          icon: "el-icon-user",
        },
      },
      //  {
      //    path: "roles",
      //    name: "Roles",
      //    component: () => import("@/views/permission/roles"),
      //    meta: {
      //      title: "角色管理",
      //      icon: "el-icon-user",
      //    },
      //  },
    ],
  },
];
const creatRouter = () => {
  return new VueRouter({
    routes: currencyRoutes,
    scrollBehavior() {
      return {
        x: 0,
        y: 0,
      };
    },
  });
};

//解决addRoute不能删除动态路由问题   //不能理解
export function resetRouter() {
  const reset = creatRouter();
  router.matcher = reset.matcher;
}
const router = creatRouter();
//导航守卫
router.beforeEach(async (to, from, next) => {
  document.title = getTitle(to.meta.title);
  if (to.path === "/login") {
    next();
  } else {
    if (store.getters.token) {
      //是否有token
      const hasRoles = store.getters.roles.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          const roles = await store.dispatch("user/_getInfo");
          const addRoutes = await store.dispatch(
            "permission/getAsyncRoutes",
            roles
          );
          router.addRoutes(addRoutes);
          router.addRoutes(addRoutes); //router.addRoutes是自有api;动态添加更多的路由规则。参数必须是一个符合 routes 选项要求的数组。
          // hack方法，确保addRoutes是完整的
          //设置replace: true，这样导航将不会留下历史记录

          next({ ...to, replace: true });
        } catch (error) {
          console.log("错误");
          Message.error(error);
        }
      }
    } else {
      console.log(to.fullPath);
      console.log("路由赋值");
      next({
        path: "/login",
        query: {
          redirect: to.fullPath,
        },
      });
    }
  }
});
/*
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
*/
export default router;
