<template>
  <div>
    <el-card>

      <div>
        <div class="searchDiv">
          <el-input v-model="topID" v-enter-number placeholder="订单ID" class="orderInput"></el-input>
          <el-input v-model="topSeller" placeholder="卖家ID/昵称" class="orderInput"></el-input>
          <el-date-picker v-model="topTime" type="date" value-format="yyyy-MM-dd" class="productSelect" placeholder="交易日期">
          </el-date-picker>

          <el-select v-model="topStayus" placeholder="交易类型" class="productSelect">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

          <el-button type="primary" icon="el-icon-search" class='searchBtn' size="medium" @click="searchBtn">查询</el-button>
        </div>
        <div>
          <el-table :data="newArr" max-height="700" border :header-cell-style="rowClass">
            <el-table-column prop="id" label="结算ID" width="80" align="center">
              <template slot-scope="scope">
                {{scope.row.id}}

              </template>
            </el-table-column>
            <el-table-column prop="" label="结算账户" align="center">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.realName}}</span>
                  <span v-show="scope.row.wxName">({{scope.row.wxName}})</span>
                </div>
                <div>
                  <span>{{scope.row.iDCard}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="wxOpenId" label="OPEN ID" width="150" align="center">
            </el-table-column>
            <!--StatusText TypeCodeName-->
            <el-table-column prop="nickname" label="卖家昵称" width="120" align="center">
              <template slot-scope="scope">
                <el-button type="text" @mousedown.native="codeIn($event)" :data-skipid="'param='+scope.row.UserId" class="companyColor" :data-url="scope.row.UserType==0?'personalUserManage.aspx':'enterpriseUsersManage.aspx'">
                  {{scope.row.Nickname}}
                </el-button>
              </template>
            </el-table-column>

            <el-table-column prop="createDateTime" label="完成交易日期" width="220" align="center">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.beginTime}}</span> 至
                  <span>{{scope.row.endTime}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="receiptCount" label="收款" width="80" align="center">
              <template slot-scope="scope">
                <div>{{scope.row.receiptCount}}笔</div>
              </template>
            </el-table-column>
            <el-table-column prop="refundCount" label="退款" align="center" width="90">
              <template slot-scope="scope">
                <div>{{scope.row.refundCount}}笔</div>
              </template>
            </el-table-column>
            <el-table-column prop="settleMoney" label="结算金额" align="center" width="90">
            </el-table-column>
            <el-table-column prop="settleStatus" label="结算状态" align="center" width="90">
              <template slot-scope="scope">
                <span>{{scope.row.settleStatus | status}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="settleSysId" label="结算人账号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.settleSysId}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="SettleTime" label="结算日期" width="180" align="center">
            </el-table-column>
            <el-table-column prop="operation" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="warning" size="mini" class="companyBg" @click="editBtn(scope.row.id,scope.row.settleStatus)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--结束-->
      <el-dialog title="修改" :visible.sync="dialogFormVisible1" center>
        <el-form :model="form">
          <el-form-item label="结算状态" :label-width="formLabelWidth">
            <el-select v-model="form.platfromInStatus" placeholder="结算状态">
              <el-option v-for="item in getStatuData" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作备注" :label-width="formLabelWidth">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入操作原因" v-model="form.textarea">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="formTrue">确 定</el-button>
        </div>
      </el-dialog>
      <!--处理记录-->
      <p class="title">结算单明细 </p>
      <div>
        <div class="tableBox">
          <el-table :data="listTotal" max-height="700" border :header-cell-style="rowClass">
            <el-table-column prop="orderId" label="订单ID" align="center" width="150">
              <template slot-scope="scope">
                <link-a url='/orderinfo/index' :orderSn='scope.row.orderSn' :val='scope.row.orderId' />
              </template>
            </el-table-column>

            <el-table-column prop="orderSn" label="订单编号" align="center" width="250">
            </el-table-column>
            <el-table-column prop="totalQuantity" label="订单件数" width="200" align="center">
            </el-table-column>
            <el-table-column prop="userId" label="买家ID" width="200" align="center">
              <template slot-scope="scope">
                <link-a url='/userinfo/index' :userId='scope.row.userId' :val='scope.row.nickname' />
              </template>
            </el-table-column>
            <el-table-column prop="createDateTime" label="交易日期" width="200" align="center">
            </el-table-column>
            <el-table-column prop="type" label="交易类型" width="120" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.Type=='2'?'orange':'blue'">
                  {{scope.row.type | type}}
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="payMoney" label="交易金额" align="center">
              <template slot-scope="scope">
                <div :class="scope.row.Type=='2'?'orange':'blue'">
                  {{scope.row.payMoney}}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="divFoot">
          <div class="footBox">
            <p>
              <span> 收款总金额</span>
              <span>¥{{topData.receiptMoney}}</span>
            </p>
            <p>
              <span> 退款总金额</span>
              <span>¥{{topData.refundMoney}}</span>
            </p>
            <p>
              <span> 手续费</span>
              <span>¥{{topData.commission}}</span>
            </p>
          </div>
          <div class="footBottom">
            <p>
              <span>结算金额</span>
              <span class="redColor">¥{{topData.settleMoney}}</span>
            </p>
          </div>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
import {
  GetSettleBillManageDetail,
  SupplierSettleBill,
} from "@/api/settleAccounts";
import Code from "@/api/statusCode";
import LinkA from "@/components/LinkA/index";

export default {
  name: "SettleDetails",
  data: function() {
    return {
      jsonData: "", //总数据
      listTotal: [], //表格列表数据
      topData: "",
      bottomData: "",

      orderId: "", //订单ID
      flow: "", //进度条
      sellerData: "", //卖家信息
      buyerData: "", //买家信息
      order: "", //售后信息
      negotiationHistory: "", //协商历史
      loading: true,
      flowActive: 0, //这个是进度条的当前进度
      paymentHistory: "", //支付记录
      address: "", //地址信息
      addressm: "",
      addressr: "",
      logistics: "", //物流信息
      pageSize: 10,
      pageNo: 1,
      newArr: [], //头部数组\\

      topID: "",
      topSeller: "",
      topTime: "",
      topStayus: "",

      getStatuData: [
        { label: "待确认", value: "0" },
        { label: "待结算", value: "1" },
        { label: "已结算", value: "2" },
        { label: "已冻结 ", value: "3" },
      ],
      options: [
        { label: "交易类型 ", value: "" },
        { label: "收款", value: "1" },
        { label: "退款", value: "2" },
      ],
      dialogFormVisible1: false, //处理记录弹窗开关
      form: {
        platfromInStatus: "", //介入记录
        textarea: "", //输入内容
        id: "",
      },
      formLabelWidth: "50",
      optionStatus: "",
      settleId: "",
      jieruId: "",
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log(to);
      vm.orderId = to.query.id;
    });
  },
  filters: {
    status: function(value) {
      //结算状态
      switch (value) {
        case 0:
          return "待确认";
          break;
        case 1:
          return "待结算";
          break;
        case 2:
          return "已结算";
          break;
        case 3:
          return "已冻结";
          break;
        default:
          return "全部";
      }
    },
    type: function(value) {
      //状态数字变文字
      switch (value) {
        case 2:
          return "退款";
          break;
        case 1:
          return "收款";
          break;
        default:
          return "未知";
      }
    },
  },
  components: {
    LinkA,
  },
  mounted() {
    this._GetSettleBillManageDetail();
  },
  methods: {
    _GetSettleBillManageDetail() {
      let that = this;
      let data = {
        settleId: that.orderId,
        orderId: that.topID || 0,
        buyer: that.topSeller,
        tradeDate: that.topTime,
        tradeType: that.topStayus || 0,
      };
      GetSettleBillManageDetail(data).then(response => {
        if (response.status === Code.SUCCESS_CODE) {
          that.loading = false;
          that.jsonData = response.data;
          that.topData = response.data.settleBill; //头部数据
          that.newArr = []; //清空
          that.newArr.push(response.data.settleBill); //头部数据数组化(方便表格读取)

          that.bottomData = response.data.settleBillDetail; //底部数据

          that.listTotal = response.data.settleBillDetail;
        } else {
          that.$message(response.message);
          console.log(error);
        }
      });
    },
    searchBtn() {
      //点击搜索按钮
      this.pageNo = 1; //每次搜索赋值为1
      this._GetSettleBillManageDetail();
    },

    editBtn(id, option) {
      //点击了修改

      this.form.platfromInStatus = `${option || ""}`; //当前状态
      this.form.id = id; //当前id
      this.form.textarea = ""; //重置内容
      this.dialogFormVisible1 = true;
    },
    formTrue() {
      //去处理确认按钮
      var that = this;
      that.dialogFormVisible1 = false;

      let data = {
        settleId: that.form.id,
        settleStatus: that.form.platfromInStatus,
        remark: that.form.textarea,
      };
      SupplierSettleBill(data).then(response => {
        if (response.status === Code.SUCCESS_CODE) {
          that.$message({
            message: "处理成功",
            type: "success",
          });

          that._GetSettleBillManageDetail();
        } else {
          that.$message({
            message: "处理未成功," + response.data.returntext,
            type: "warning",
          });
        }
      });
    },
    rowClass() {
      return "background: #E7F7F6; color: #333; font-weight: normal;text-align:center";
    },
  },
};
</script>

<style>
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.searchDiv {
  margin-bottom: 20px;
  text-align: right;
}
.orderInput {
  width: 120px;
  margin-right: 10px;
}
.productSelect {
  width: 160px;
  margin-right: 10px;
}
.searchBtn {
  background: #13b5b1;
  border: 1px solid #0c9c9a;
}
.title {
  font-size: 22px;
  color: rgb(0, 0, 0);
  margin: 30px 0 20px;
}

.divFoot {
  border: 1px solid #eee;
  margin-top: 20px;
  padding-right: 30px;
  margin-bottom: 50px;
  overflow: hidden;
}

.footBox {
  height: 130px;
  width: 180px;
  float: right;
}

.footBox > p {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 10px 0;
}

.footBottom {
  height: 60px;
  border-top: 1px solid #eee;
  clear: both;
  float: right;
  width: 180px;
}

.footBottom > p {
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.redColor {
  color: #ff0000;
}

.lockBtn {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  width: 80px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
}

.orange {
  color: #e8541e;
}

.blue {
  color: #13b5b1;
}

.textBox {
  margin-right: 30px;
}
.el-button--primary {
  background-color: #13b5b1 !important;
  border-color: #13b5b1;
}

.orderInput {
  height: 18px;
  width: 120px;
}

.sellerMes,
.buyerMes,
.afterMes,
.historyMes {
  width: 24.5%;
  border-right: 1px solid #eee;
  float: left;
  height: 300px;
  padding: 30px 0;
  position: relative;
}

.historyMes {
  padding-right: 20px;
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

.listBox {
  padding-left: 30px;
}

.lineBox {
  height: 40px;
  position: relative;
}

.mainBox {
  overflow: hidden;
  border: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  margin-right: 20px;
}

.mainBox1 {
  overflow: hidden;
  border: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  margin-right: 20px;
  margin-top: 30px;
}

.line {
  height: 20px;
  width: 3px;
  background: #13b5b1;
  border-radius: 20px;
  position: absolute;
  left: -10px;
  top: 2px;
}

.sellerKey {
  color: #999;
  width: 80px;
  text-align: left;
  display: inline-block;
}

.sellerVal {
  text-align: left;
}

.sellerUl > li {
  line-height: 40px;
}

.block {
  height: 220px;
  padding-top: 10px;
  overflow-y: auto;
}

.tableBox {
}

.historyImg {
  display: inline-block;
  width: 60px;
  height: 60px;
  overflow: hidden;
}

img {
  display: block;
  width: auto;
}

.payBox {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payTop {
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.payway {
  margin-right: 10px;
}

.el-card__body {
  padding: 10px;
}

.box-card {
  margin-bottom: 10px;
}

/*滚动条样式*/
.block::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}

.block::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.block::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}

.payTime {
  color: #999;
  font-size: 12px;
}

.payBottom {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  width: 100%;
}

.payBottom > div {
  width: 50%;
  text-align: center;
}

.addressMes,
.logisticsMes,
.liuchenMes {
  width: 33%;
  border-right: 1px solid #eee;
  float: left;
  height: 260px;
  padding: 30px 0;
  position: relative;
}

.addIcon {
  width: 22px;
  height: 28px;
  margin-right: 20px;
}

.addTop {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.addName {
  margin-right: 10px;
}

.addBox {
  font-size: 16px;
}

.getmesIcon {
  width: 20px;
  height: 20px;
}

.liuchenBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30px;
  margin-bottom: 20px;
}

.getmesIcon {
  margin-right: 10px;
}

.companyColor {
  color: #13b5b1;
  margin-left: 10px;
}
</style>

