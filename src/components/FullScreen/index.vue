<template>
  <div>
    <i class="el-icon-full-screen iconFont" @click="toggleFull"></i>
  </div>
</template>

<script>
import screenfull from "screenfull";
export default {
  methods: {
    toggleFull() {
      if (!screenfull.isEnabled) {
        this.$message({
          type: "warning",
          message: "嘿嘿,该浏览器不支持哦~"
        });
        return false;
      }
      screenfull.toggle();
    }
  }
};
</script>
