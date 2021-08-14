import { asyncRoutes, currencyRoutes } from "@/router";

const state = {
  routes: [],
  addRoutes: []
};
const mutations = {
  SET_ROUTES(state, payload) {
    state.routes = [...currencyRoutes, ...payload];
    state.addRoutes = payload;
  }
};

//遍历asyncRoutes动态路由

function forSearchArr(route, roles) {
  let arrNew = [];
  for (let item of route) {
    let itemNew = { ...item };
    if (roles.includes(itemNew.name)) {
      //查找是否包含该字符串
      if (itemNew.children) {
        itemNew.children = forSearchArr(itemNew.children, roles);
      }
      arrNew.push(itemNew);
    }
  }
  return arrNew;
}

const actions = {
  getAsyncRoutes({ commit, rootGetters }, roles) {
    return new Promise(resolve => {
      let routes = [];
      if (rootGetters.userId === "admin") {
        //如果用户是admin的话就全给
        routes = asyncRoutes || "";
      } else {
        routes = forSearchArr(asyncRoutes, roles);
      }
      commit("SET_ROUTES", routes);
      resolve(routes);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};