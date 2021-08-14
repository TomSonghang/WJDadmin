import { GetSysMenu, GetAccess_token } from "@/api/login";
import { Message } from "element-ui";
import router, { resetRouter } from "@/router";
import Code from "@/api/statusCode";
const state = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : "", //认证凭证
  userName: "",
  userId: "",
  roles: []
};

const mutations = {
  SET_TOKEN(state, val) {
    state.token = val;
    localStorage.setItem("token", val);
  },
  DEL_TOKEN(state) {
  
    state.token = "";
    state.userName = "";
    state.userId = "";
    state.roles = "";
    localStorage.removeItem("token");
  },
  SET_ROLES(state, payload) {
    state.roles = payload;
  },
  SET_NAME(state, payload) {
    state.userName = payload;
  },
  SET_USERID(state, payload) {
    state.userId = payload;
  }
};

const actions = {
  _login({ commit }, formdatas) {
    //登录
    return new Promise((resolve, reject) => {
      GetAccess_token(formdatas)
        .then(res => {
          if (res.status === Code.SUCCESS_CODE) {
            Message.success("登陆成功");
            commit("SET_TOKEN", res.data.access_token); //登录成功,修改全局TOKEN状态
          } else {
            Message.error(res.message);
          }
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  async loginOut({ commit }) {
    commit("DEL_TOKEN");
    resetRouter();
    router.push({
      path: "/login",
      query: {
        redirect: "/"
      }
    });
  },
  _getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      GetSysMenu()
        .then(res => {
          if (res.status === Code.SUCCESS_CODE) {
            const { userName, userId } = res.data.userInfo;

            const rolseList = res.data.menuTreeList;

            // console.log(`menu:${rolseList.toString()}`);
            let roles = [];
            if (rolseList.length > 0) {
              rolseList.forEach(item => {
                switch (item.pageName) {
                  case "Dashbord":
                    roles.push("Home"); //首页
                    break;
                  case "Userinfo-index":
                    roles.push("Userinfo"); //用户信息
                    break;
                  case "Productinfo-index":
                    roles.push("Productinfo"); //产品信息
                    break;
                  case "Orderinfo-index":
                    roles.push("Orderinfo"); //订单信息
                    break;
                  case "Feedback-index": //反馈建议
                    roles.push("Feedback");
                    break;
                  case "PageUser": //管理账号
                    roles.push("Permission");
                    break;
                }
                roles.push(item.pageName);
              });
            } else {
              //如果后台没有返回一个列表,那么就默认显示主页
              roles = ["Dashbord", "Home"];
            }
            //const roles = ["Permission","PageUser","Dashbord","Home","Feedback","Feedback-index"];
            commit("SET_ROLES", roles);
            commit("SET_NAME", userName);
            commit("SET_USERID", userId);

            //commit("SET_INTRODUCE", introduce);
          } else {
            Message.error(res.msg);
          }
          //resolve(res.data);
          resolve(state.roles);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
