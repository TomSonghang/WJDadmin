export default {
  methods: {
    enterPage(url, id, statu) {     //地址,key,状态
      this.$router.push({ name: url, params: { id, statu } });
    },
  },
};
