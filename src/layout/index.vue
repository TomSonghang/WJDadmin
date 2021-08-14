<template>
  <div class="wrapper" :class="{ closeBar: opened }">
    <m-heared></m-heared>
    <div class="wrapper_con">
      <side-bar></side-bar>
      <page-main></page-main>
    </div>
  </div>
</template>

<script>
import SideBar from "./components/sideBar";
import MHeared from "./components/header";
import PageMain from "./components/pageMain";
import { mapGetters } from "vuex";
import driver from "@/mixins/useDriver";

export default {
  name: "layout",
  mixins: [driver],
  components: {
    MHeared,
    SideBar,
    PageMain
  },
  mounted() {
    if (this.showDriver === "yes") {
      console.log(this.showDriver);
      this.guide();
      this.$store.commit("app/SET_DRIVER", "no");
    }
  },
  computed: {
    ...mapGetters(["opened", "msgIsShow", "showDriver"])
  }
};
</script>
