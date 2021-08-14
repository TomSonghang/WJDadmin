const state = {
  opened: sessionStorage.getItem("open")
    ? sessionStorage.getItem("open")
    : "false",
  msgIsShow: false,
  showDriver: localStorage.getItem("driver")
    ? localStorage.getItem("driver")
    : "yes"
};

const mutations = {
  SET_OPENED(state, payload) {
    //设置opened的值
    state.opened = String(payload);
    sessionStorage.setItem("open", payload); //非持续性缓存
  },
  SET_MSGISOPEN(state) {
    //设置消息是否打开
    state.msgIsShow = !state.msgIsShow;
  },
  SET_DRIVER(state, payload) {
    state.showDriver = payload;
    localStorage.setItem("driver", payload); //持续性的缓存,关闭浏览器或者页面不会清除缓存
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
