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
      debugger
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
