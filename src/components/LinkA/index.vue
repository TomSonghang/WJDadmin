<template>
  <router-link
    :to="{ path: url, query: { userId, productId, statu }}"
    class="companyColor"
    @click.native='jump'
  >
    {{val}}
    </router-link>
</template>
<script>
export default {
  props: {
    url: String,
    productId: {
      type: String,
      default: "",
    },
    userId: {
      type: String,
      default: "",
    },
    statu: {
      type: [Number, String],
      default: "",
    },
    val: {
      type: [String, Number],
      default: "",
    },
    selfPage: {
      //是否是当前页面跳转,如果是,那就直接更改ID
      type: Boolean,
      default: false,
    },
  },
  methods: {
    jump() {
      debugger;
      if (this.selfPage) {
        this.$listeners.changeId(this.userId);
      }
      return false;

      // this.$emit("", { id: this.userId });
    },
  },
};
</script>
<style>
.companyColor {
  color: #13b5b1;
}
</style>


