<template>
  <div class="sideBar" id="domSideBar">
    <el-scrollbar>
      <el-menu
        class="el-menu-vertical-demo"
        mode="vertical"
        :default-active="activeMenu"
        background-color="#3a3f51"
        text-color="#b5b6bd"
        active-text-color="#13b5b1"
        :collapse="opened"
        :collapse-transition="false"
      >
        <sidebar-item
          v-for="item in routes"
          :key="item.path"
          :item="item"
          :basePath="item.path"
        >
        </sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from "./SideBarItem";
import { mapGetters } from "vuex";
export default {
  components: {
    SidebarItem
  },
  mounted() {},
  computed: {
    ...mapGetters(["routes", "opened"]),
    activeMenu() {
      return this.$route.path;
    }
  }
};
</script>
