<template>
  <div class="breadDiv" id="domBread">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadList"
        :to="item.path"
        :key="index"
        >{{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  data() {
    return {
      breadList: []
    };
  },
  watch: {
    $route: {
      handler(route) {
        let allList = route.matched.filter(item => {
          if (item.meta && item.meta.title) {
            if (item.redirect) {
              item.path = "";
            }
            return true;
          }
        });
        if (allList[0].path !== "/" && allList[0].path !== "/dashbord") {
          allList.unshift({ path: "/", meta: { title: "首页" } });
        }
        this.breadList = allList;
      },
      immediate: true //immediate设为true后，则监听的这个对象会立即输出，也就是说一刷新页面就会在控制台输出，当然此时页面上的数据我们还没来得及手动让其发生变化，所以在控制台输出的newValue为我们在代码中默认设置的值，oldValue输出为“undefined”。
    }
  }
};
</script>
