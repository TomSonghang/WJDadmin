import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import steps from "./guide";
export default {
  data() {
    return {
      driver: null
    };
  },
  mounted() {
    this.driver = new Driver({
      doneBtnText: "你毕业了",
      closeBtnText: "关闭",
      nextBtnText: "下一个",
      prevBtnText: "上一个",
      opacity: 0.6,
      onReset: () => {
        document.getElementsByClassName("header")[0].style.position = "fixed";
      }
    });
    // this.guide()
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps);
      document.getElementsByClassName("header")[0].style.position = "absolute"; //解决fixed显示空白bug
      this.driver.start();
    }
  }
};
