import Vue from "vue";
import store from "@/store";

const disableClickFn = (event) => {
  event && event.stopImmediatePropagation();
};

export const hasPermission = () => {
  Vue.directive("permission", {
    bind(el, binding) {
      let disable = true;
      console.log(store.getters);

      if (
        store.getters.roles.length &&
        store.getters.roles.includes(binding.value)
      ) {
        disable = false;
      }
      if (disable) {
        el.classList.add("permission-disable");
        el.setAttribute("disabled", "disabled");
        el.addEventListener("click", disableClickFn, true);
      }
    },
    unbind(el) {
      el.removeEventListener("click", disableClickFn);
    },
  });
};

export const enterNumber = () => {
  Vue.directive("enterNumber", {
    //全局方法  限制input输入框只能输入纯数字 组件中调用如（<el-input v-enter-number v-model="number" ></el-input>）
    inserted: function(el) {
      el.addEventListener("keypress", function(e) {
        e = e || window.event;
        let charcode = typeof e.charCode === "number" ? e.charCode : e.keyCode;
        let re = /\d/;
        if (
          !re.test(String.fromCharCode(charcode)) &&
          charcode > 9 &&
          !e.ctrlKey
        ) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      });
    },
  });
};
