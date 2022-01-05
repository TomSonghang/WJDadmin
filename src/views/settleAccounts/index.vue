<template>
  <div class="filterBox">
    <el-card>
      <div>
        <div class="searchDiv">
          <el-input v-model="orderID" placeholder="结算ID/账号" class="orderInput"></el-input>
          <el-input v-model="orderNum" placeholder="卖家昵称" class="orderInput"></el-input>
          <el-date-picker class="productSelect" v-model="startEndTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" align="right">
          </el-date-picker>
          <el-select v-model="orderStatus" placeholder="结算状态" class="productSelect">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="settler" placeholder="结算人账号" class="orderInput"></el-input>
          <el-date-picker class="productSelect" v-model="settleTime" type="date" value-format="yyyy-MM-dd" placeholder="结算日期">
          </el-date-picker>

          <el-button type="primary" class="searchBtn" icon="el-icon-search" size="medium" @click="searchBtn">搜索</el-button>
        </div>
        <div>
          <el-table :data="listTotal" max-height="700" border v-loading="loading" element-loading-text="拼命加载中" :header-cell-style="rowClass">
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
                <link-a url='/userinfo/index' :userId='scope.row.userId' :val='scope.row.nickname' />
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
            <el-table-column prop="settleTime" label="结算日期" width="180" align="center">
            </el-table-column>
            <el-table-column prop="operation" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="warning" size="mini" @click="goView(scope.row.id)" class="companyBg">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div>
          <el-pagination class="fyDiv" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
            :page-size="10" layout="total,prev, pager, next" :total="listTotalNum">
          </el-pagination>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
import { GetSettleBillManage } from "@/api/settleAccounts";
import Code from "@/api/statusCode";
import LinkA from "@/components/LinkA/index";
export default {
  name: "SettleAccounts",
  data: function() {
    return {
      msg: "查询",
      jsonData: "", //总数据
      listTotal: [], //数据列表
      listTotalNum: 0, //总的列表数量
      settler: "", //结算人
      settleTime: "", //结算时间
      loading: true,
      startEndTime: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      orderStatus: "",
      options: [
        { label: "结算状态 ", value: "" },
        { label: "待结算", value: "1" },
        { label: "已结算", value: "2" },
        { label: "已冻结 ", value: "3" },
      ],
      orderNum: "",
      orderID: "",
      pageSize: 10,
      pageNo: 1,
      currentPage: 1,
    };
  },
  mounted() {
    this._GetSettleAccounts();
  },
  components: {
    LinkA,
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
  },
  methods: {
    _GetSettleAccounts() {
      let that = this;
      let data = {
        pageNo: that.pageNo,
        pageSize: that.pageSize,
        settleId: that.orderID,
        supplierUserId: that.orderNum,
        beginTime: that.startEndTime[0],
        endTime: that.startEndTime[1],
        settleStatus: that.orderStatus,
        settleSysId: that.settler,
        settleTime: that.settleTime,
      };
      GetSettleBillManage(data).then(response => {
        if (response.status === Code.SUCCESS_CODE) {
          that.loading = false;
          that.jsonData = response.data;
          that.listTotalNum = response.data.dataCount;
          that.listTotal = response.data.list;
        } else {
          that.$message(response.data.returntext);
          console.log(error);
        }
      });
    },
    searchBtn() {
      //点击搜索按钮
      this.pageNo = 1; //每次搜索赋值为1
      this._GetSettleAccounts();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this._GetSettleAccounts();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this._GetSettleAccounts();
    },
    goView(e) {
      //去查看详情
      this.$router.push({
        name: "Settle-details",
        query: { id: e },
      });
    },
    rowClass() {
      return "background: #E7F7F6; color: #333; font-weight: normal;";
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
</style>

