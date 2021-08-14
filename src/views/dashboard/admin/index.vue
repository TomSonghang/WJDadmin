<template>
  <div class="dashbord">
    <!-- <el-button v-permission='"song"'>按钮</el-button> -->
    <!-- <p class="titleTop">今日新增</p> -->
    <el-row class="infoCrads">
      <el-col :span="4" v-for="(item, index) in todayAddNum" :key="index">
        <div class="cardItem">
          <div class="cardItem_txt">
            <div>
              <count-to class="cardItem_p0" :class="item.color" :startVal="item.startVal" :endVal="item.vistors" :duration="2000"></count-to>
              <span class="zuori"> / {{ item.yesterday }}</span>
            </div>
            <p class="cardItem_p1">{{ item.text }}</p>
          </div>
          <div class="cardItem_icon">
            <i class="color-green1" :class="[item.icon, item.color]"></i>
          </div>
        </div>
      </el-col>
    </el-row>
    <line-charts class="lCharts" :lineChartData="lineChartData"></line-charts>
    <p class="titleTop mtop">基本数据</p>
    <table-show :tableData="tableData"></table-show>
    <!-- <div>
      <dynamic-form :field-map="fieldMap" :form-data="formData" />
    </div> -->
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import LineCharts from "./components/LineCharts";
import TableShow from "./components/TableShow";
// import DynamicForm from "./components/child";
// import child from '../components/tableShow';
import { GetHomePage } from "@/api/dashboard";
import Code from "@/api/statusCode";
export default {
  data() {
    return {
      formData: {
        name: "",
        sex: 1
      },
      fieldMap: {
        name: {
          name: "name",
          label: "名称",
          type: "text",
          placeholder: "请输入名称"
        },
        sex: {
          name: "sex",
          label: "性别",
          type: "select",
          options: {
            list: [
              {
                label: "男",
                value: 0
              },
              {
                label: "女",
                value: 1
              }
            ]
          }
        }
      },
      isShow: false,
      lineChartData: {
        userData: [125, 196, 91, 61, 286, 34, 147],
        productData: [820, 932, 901, 934, 1290, 1330, 1320],
        orderData: [23, 75, 98, 124, 57, 56, 98],
        incomeData: [1120, 699, 245, 745, 635, 698, 855],
        activeData: [258, 865, 635, 247, 587, 1221, 354],
        xname: []
      },
      tableData: [
        {
          title: "本月新增",
          user: 0,
          product: 652,
          order: 415,
          income: 5242
        },
        {
          title: "今年新增",
          user: 0,
          product: 1652,
          order: 5415,
          income: 15242
        },
        {
          title: "所有新增",
          user: 0,
          product: 4652,
          order: 15415,
          income: 75242
        }
      ],
      todayAddNum: [
        {
          startVal: 0,
          vistors: 0,
          yesterday: 0,
          text: "今/昨日新增用户数",
          icon: "el-icon-user",
          color: "color-green1"
        },
        {
          startVal: 0,
          vistors: 0,
          yesterday: 0,
          text: "今/昨日新增产品数",
          icon: "el-icon-present",
          color: "color-blue"
        },
        {
          startVal: 0,
          vistors: 0,
          yesterday: 0,
          text: "今/昨日订单数",
          icon: "el-icon-document",
          color: "color-red"
        },
        {
          startVal: 0,
          vistors: 0,
          yesterday: 0,
          text: "今/昨日交易金额",
          icon: "el-icon-bank-card",
          color: "color-green2"
        },
        {
          startVal: 0,
          vistors: 0,
          yesterday: 0,
          text: "今/昨日活跃用户数",
          icon: "el-icon-user",
          color: "color-orange"
        },
        {
          startVal: 0,
          vistors: 0,
          yesterday: 0,
          text: "待处理反馈建议",
          icon: "el-icon-mic",
          color: "color-red"
        }
      ]
    };
  },
  mounted() {
    this._GetHomePage();
  },
  methods: {
    // setCookie(c_name, value, date) {
    //   let oDate = new Date();
    //   oDate.setDate(oDate.getDate() + date);
    //   let str = `${encodeURI(c_name)}=${encodeURI(
    //     value
    //   )}; expires=${oDate.toGMTString()}; HttpOnly;`;
    //   debugger;

    //   document.cookie = str;
    // },
    // getCookie(key) {
    //   let arr = decodeURI(document.cookie).split("; ");
    //   let val = "";
    //   arr.map(item => {
    //     let arr1 = item.split("=");
    //     if (key === arr1[0]) {
    //       val = arr1[1];
    //     }
    //   });
    //   return val;
    // },
    // show() {
    //   this.isShow = true;
    // },
    // father(e) {
    //   this.isShow = e;
    // },
    _GetHomePage() {
      GetHomePage().then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          let baseData = res.data.baseData;
          this.todayAddNum[0].vistors = baseData.DayUser;
          this.todayAddNum[1].vistors = baseData.DayProduct;
          this.todayAddNum[2].vistors = baseData.DayOrder;
          this.todayAddNum[3].vistors = baseData.DayIncome;
          this.todayAddNum[4].vistors = baseData.DayActive;
          this.todayAddNum[5].vistors = baseData.DayFeedBack;
          //今日新增
          this.todayAddNum[0].yesterday = baseData.YesterdayUser;
          this.todayAddNum[1].yesterday = baseData.YesterdayProduct;
          this.todayAddNum[2].yesterday = baseData.YesterdayOrder;
          this.todayAddNum[3].yesterday = baseData.YesterdayIncome;
          this.todayAddNum[4].yesterday = baseData.YesterdayActive;
          this.todayAddNum[5].yesterday = baseData.YesterdayFeedBack;
          debugger
          //昨日新增

          //本月
          this.tableData[0].user = baseData.MonthUser;
          this.tableData[0].product = baseData.MonthProduct;
          this.tableData[0].order = baseData.MonthOrder;
          this.tableData[0].income = baseData.MonthIncome;

          //今年
          this.tableData[1].user = baseData.YearUser;
          this.tableData[1].product = baseData.YearProduct;
          this.tableData[1].order = baseData.YearOrder;
          this.tableData[1].income = baseData.YearIncome;

          //所有
          this.tableData[2].user = baseData.AllUser;
          this.tableData[2].product = baseData.AllProduct;
          this.tableData[2].order = baseData.AllOrder;
          this.tableData[2].income = baseData.AllIncome;

          this.lineChartData.userData = res.data.user; //用户
          this.lineChartData.productData = res.data.product; //产品
          this.lineChartData.orderData = res.data.order; //订单
          this.lineChartData.incomeData = res.data.income; //收入
          this.lineChartData.activeData = res.data.active; //活跃用户
          this.lineChartData.xname = res.data.xName; //星期
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    }
  },
  components: {
    CountTo,
    LineCharts,
    TableShow
    // DynamicForm,
  }
};
</script>
<style scoped lang="less">
@mgTop: 30px;
.shadow {
  box-shadow: 0 0 10px #e2e2e2;
}
.zuori {
  font-size: 14px;
  color: #999;
}
.titleTop {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  padding-bottom: 20px;
}
.color-orange {
  color: #e7a01b !important;
}
.color-green1 {
  color: #40c9c6 !important;
}
.color-blue {
  color: #36a3f7 !important;
}
.color-red {
  color: #f4516c !important;
}
.color-green2 {
  color: #34bfa3 !important;
}
.dashbord {
  background-color: #f0f3f4;
}
.infoCrads {
  margin: 0 -20px 0 -20px;
  .el-col {
    padding: 0 20px;
    .cardItem {
      height: 108px;
      background: #fff;
    }
  }
}
.cardItem {
  color: #666;
  .shadow();
  .cardItem_txt {
    float: left;
    margin: 26px 0 0 20px;
    .cardItem_p0 {
      font-size: 20px;
      font-weight: bold;
    }
    .cardItem_p1 {
      font-weight: bold;
      font-size: 15px;
      color: #999;
      padding-top: 10px;
    }
  }
  .cardItem_icon {
    float: right;
    margin: 24px 20px 0 0;
    i {
      font-size: 50px;
    }
  }
}
.lCharts {
  background: #fff;
  margin-top: @mgTop;
  padding: 30px 0;
  .shadow();
}
.barCharts {
  background: #fff;
  margin-top: @mgTop;
  padding: 30px 0;
  .shadow();
}
.pieCharts {
  background: #fff;
  padding: 20px 0;
  .shadow();
}
.tableChart {
  margin-top: @mgTop;
}
</style>
