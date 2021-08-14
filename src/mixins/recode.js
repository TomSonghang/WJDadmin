export default {
  data() {
    return {
      recodePage: 1, //处理记录页
      totalCode: 0, //处理记录总数据
      diaIsShowTable: false, //弹窗
      CodeTable: [], //弹窗记录表数据
      arrayData: [
        //梳理记录的表头和数据
        {
          name: "操作员ID",
          prop: "operatorId"
        },
        {
          name: "操作员姓名",
          prop: "operatorName"
        },
        {
          name: "操作时间",
          prop: "createDateTime"
        },
        {
          name: "理由",
          prop: "operationReason"
        },
        {
          name: "内容",
          prop: "operationContent"
        }
      ]
    };
  },
  methods: {
    closeRecode(e) {
      //关闭记录的弹窗
      this.diaIsShowTable = e;
    }
  }
};
