<template>
  <div
    class="lineCharts"
    :style="{ width: width, height: height }"
    ref="myCharts"
  ></div>
</template>

<script>
import echarts from "echarts";
import resize from "@/mixins/resize";
require("echarts/theme/macarons");
export default {
  mixins: [resize],
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "350px"
    },
    lineChartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mycharts: null
    };
  },
  mounted() {
    this.$nextTick().then(() => {
      this.initEcharts();
    });
  },
  watch: {
    lineChartData: {
      deep: true,
      handler(val) {
        this._setOption(
          val.userData,
          val.productData,
          val.orderData,
          val.incomeData,
          val.activeData,
          val.xname
        );
      }
    }
  },
  methods: {
    initEcharts() {
      this.mycharts = echarts.init(this.$refs.myCharts, "macarons");
      if (Object.keys(this.lineChartData).length > 0) {
        this._setOption(
          this.lineChartData.userData,
          this.lineChartData.productData,
          this.lineChartData.orderData,
          this.lineChartData.incomeData,
          this.lineChartData.activeData,
          this.lineChartData.xname
        );
      }
    },
    _setOption(
      userData = [],
      productData = [],
      orderData = [],
      incomeData = [],
      activeData = [],
      xname = []
    ) {
      this.mycharts.setOption({
        title: {
          text: "一周基本数据",
          left: "16"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              background: "#13b5b1"
            }
          }
        },
        legend: {
          data: ["用户数", "产品数", "订单数", "交易金额", "活跃用户数"]
        },
        grid: {
          left: "20",
          right: "20",
          bottom: "3",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xname
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "用户数",
            type: "line",
            itemStyle: {
              color: "#f4516c"
            },
            lineStyle: {
              color: "#f4516c"
            },
            smooth: true,
            data: userData,
            animationDuration: 2800,
            animationEasing: "quadraticOut"
          },
          {
            name: "产品数",
            type: "line",
            itemStyle: {
              color: "#55a8fd"
            },
            lineStyle: {
              color: "#55a8fd"
            },
            smooth: true,
            data: productData,
            animationDuration: 2800,
            animationEasing: "quadraticOut"
          },
          {
            name: "订单数",
            type: "line",
            itemStyle: {
              color: "#13b5b1"
            },
            lineStyle: {
              color: "#13b5b1"
            },
            smooth: true,
            data: orderData,
            animationDuration: 2800,
            animationEasing: "quadraticOut"
          },
          {
            name: "交易金额",
            type: "line",
            itemStyle: {
              color: "orange"
            },
            lineStyle: {
              color: "orange"
            },
            smooth: true,
            data: incomeData,
            animationDuration: 2800,
            animationEasing: "quadraticOut"
          },
          {
            name: "活跃用户数",
            type: "line",
            itemStyle: {
              color: "blue"
            },
            lineStyle: {
              color: "blue"
            },
            smooth: true,
            data: activeData,
            animationDuration: 2800,
            animationEasing: "quadraticOut"
          }
        ]
      });
    }
  }
};
</script>
