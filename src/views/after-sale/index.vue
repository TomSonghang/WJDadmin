<template>
  <div>
    <el-card>
      <div class="searchDiv">
        <el-input v-model="orderId" placeholder="订单ID" class="width1"></el-input>
        <el-input v-model="afterId" placeholder="售后ID" class="width1"></el-input>
        <el-input v-model="afterSaleSn" placeholder="售后编号" class="width1"></el-input>
        <el-date-picker v-model="startEndTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="申请开始时间"
          end-placeholder="申请结束时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" class='width3 mr20'>
        </el-date-picker>
        <el-select v-model="receiveCode" placeholder="货物状态" class="width2 mr20">
          <el-option v-for="item in arogoStatuData" :key="item.Code" :label="item.CodeName" :value="item.Code">
          </el-option>
        </el-select>

        <el-select v-model="reasonCode" placeholder="售后原因" class="width2 mr20">
          <el-option v-for="item in afterWhyData" :key="item.Code" :label="item.CodeName" :value="item.Code">
          </el-option>
        </el-select>
        <el-select v-model="typeCode" placeholder="售后要求" class="width2 mr20">
          <el-option v-for="item in afterAsk" :key="item.Code" :label="item.CodeName" :value="item.Code">
          </el-option>
        </el-select>
        <el-select v-model="afterStatu" placeholder="售后状态" class="width2 mr20">
          <el-option v-for="item in afterStatuData" :key="item.ID" :label="item.CodeName" :value="item.ID">
          </el-option>
        </el-select>

        <el-input v-model="buyerName" placeholder="买家ID/昵称" class="width1"></el-input>

        <el-input v-model="sellerName" placeholder="卖家ID/昵称" class="width1"></el-input>
        <el-button type="primary" icon="el-icon-search" size="medium" @click="searchBtn" class="searchBtn">{{msg}}</el-button>
      </div>

      <el-table :data="listTotal" max-height="700" border v-loading="loading" element-loading-text="拼命加载中" :header-cell-style="rowClass">
        <el-table-column prop="id" label="售后ID" width="90" align="center">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column prop="afterSaleSn" label="售后编号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="orderId" label="订单ID" width="80" align="center">
        </el-table-column>
        <el-table-column prop="createDateTime" label="申请售后时间" width="180" align="center">

        </el-table-column>
        <el-table-column prop="receiveCodeName" label="货物状态" width="100" align="center">
        </el-table-column>
        <el-table-column prop="reasonCodeName" label="售后原因" width="120" align="center">
        </el-table-column>
        <el-table-column prop="typeCodeName" label="售后要求" width="80" align="center">
        </el-table-column>
        <el-table-column prop="status" label="售后状态" width="100" align="center">
          <template slot-scope="scope">
            {{scope.row.status|status}}
          </template>
        </el-table-column>
        <el-table-column prop="buyerNickName" label="买家昵称" align="center">
          <template slot-scope="scope">
            <link-a url='/userinfo/index' :userId='scope.row.buyerUserId' :val='scope.row.buyerNickName' />
          </template>
        </el-table-column>
        <el-table-column prop="sellerNickName" label="卖家昵称" align="center">
          <template slot-scope="scope">
            <link-a url='/userinfo/index' :userId='scope.row.sellerUserId' :val='scope.row.sellerNickName' />
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="申请退款总额" width="110" align="center">
          <template slot-scope="scope">
            <div v-show="scope.row.TotalAmount">
              ¥{{scope.row.TotalAmount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="已退总额" width="80" align="center">
          <template slot-scope="scope">
            ¥{{scope.row.Status==7?scope.row.TotalAmount:0}}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="操作" width="90" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="goView(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background layout="total, sizes, prev, pager, next" :page-sizes="pageSizes" :page-size="pageSize" :current-page="currentPage"
        :total="total" class="fyDiv" @size-change="handleSizeChange" @current-change="handleSize">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import { GetAfterSaleList } from "@/api/afterSale";
import Code from "@/api/statusCode";
import LinkA from "@/components/LinkA/index";

export default {
  name: "AfterSale",
  data: function() {
    return {
      pageSizes: [5, 10, 20, 30, 40],
      msg: "查询",
      jsonData: "", //总数据
      listTotal: [], //数据列表
      total: 200, //总的列表数量
      reasonCode: "",
      startEndTime: "",
      loading: true,
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
      orderId: "",
      afterId: "",
      afterSaleSn: "",
      typeCode: "",
      arogoStatuData: [
        //货物状态
        { ID: 1, ParentId: 0, Code: 101, CodeName: "未收到货" },
        { ID: 2, ParentId: 0, Code: 102, CodeName: "已收到货" },
      ],
      afterWhyData: [
        //售后原因
        { ID: 3, ParentId: 1, Code: 201, CodeName: "卖家未发货" },
        { ID: 4, ParentId: 1, Code: 202, CodeName: "快递未送达/无有效记录" },
        { ID: 5, ParentId: 1, Code: 203, CodeName: "快递拒签/未签收" },
        { ID: 9, ParentId: 2, Code: 204, CodeName: "工艺质量问题" },
        { ID: 10, ParentId: 2, Code: 205, CodeName: "材质成色问题" },
        { ID: 11, ParentId: 2, Code: 206, CodeName: "尺寸大小问题" },
        { ID: 12, ParentId: 2, Code: 207, CodeName: "缺件少件问题" },
        { ID: 13, ParentId: 2, Code: 208, CodeName: "退差价/退运费" },
        { ID: 14, ParentId: 2, Code: 209, CodeName: "维修/保养" },
      ],
      afterAsk: [
        //售后要求
        { ID: 15, ParentId: 9, Code: 301, CodeName: "仅退款" },
        { ID: 16, ParentId: 9, Code: 302, CodeName: "退货退款" },
        { ID: 17, ParentId: 9, Code: 303, CodeName: "换货" },
        { ID: 18, ParentId: 9, Code: 304, CodeName: "维修" },
        { ID: 19, ParentId: 9, Code: 305, CodeName: "补寄" },
      ],
      afterStatuData: [
        //售后状态
        { ID: 1, CodeName: "申请售后" },
        { ID: 2, CodeName: "待买家发货" },
        { ID: 3, CodeName: "待卖家发货" },
        { ID: 4, CodeName: "待卖家收货" },
        { ID: 5, CodeName: "待买家收货 " },
        { ID: 6, CodeName: "待卖家退款" },
        { ID: 7, CodeName: "售后完成" },
        { ID: 8, CodeName: "卖家拒绝" },
        { ID: 9, CodeName: "撤销申请" },
      ],
      options: [
        { label: "待收货", value: "0" },
        { label: "部分支付", value: "1" },
        { label: "代发货", value: "2" },
      ],
      receiveCode: "",
      afterStatu: "",
      buyerName: "",
      sellerName: "",

      pageSize: 10,
      pageNo: 1,
      currentPage: 1,
    };
  },
  components: {
    LinkA,
  },
  filters: {
    status: function(value) {
      switch (value) {
        case 1:
          return "申请售后";
          break;
        case 2:
          return "待买家发货";
          break;
        case 3:
          return "待卖家发货";
          break;
        case 4:
          return "待卖家收货";
          break;
        case 5:
          return "待买家收货";
          break;
        case 6:
          return "待卖家退款";
          break;
        case 7:
          return "售后完成";
          break;
        case 8:
          return "卖家拒绝";
          break;
        case 9:
          return "撤销申请";
          break;
        default:
          return "...";
      }
    },
  },
  mounted() {
    this._GetAfterSaleList();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log(to);
      vm.afterId = to.query.userId; //其实是id
    });
  },
  methods: {
    _GetAfterSaleList() {
      let that = this;
      let data = {
        pageNo: that.pageNo,
        pageSize: that.pageSize,
        orderId: that.orderId,
        afterSaleId: that.afterId,
        afterSaleSn: that.afterSaleSn,
        receiveCode: that.receiveCode,
        beginCreateDate: that.startEndTime[0],
        endCreateDate: that.startEndTime[1],
        reasonCode: that.reasonCode,
        typeCode: that.typeCode,
        status: that.afterStatu,
        buyer: that.buyerName,
        seller: that.sellerName,
      };
      GetAfterSaleList(data).then(res => {
        that.loading = false;
        if (res.status === Code.SUCCESS_CODE) {
          this.jsonData = res.data.data;
          this.listTotal = res.data.list;
          this.total = res.data.dataCount;
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    handleSize(e) {
      this.pageNo = e;
      console.log(e);
      this._GetAfterSaleList();
      //pageSize 改变时会触发
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this._GetAfterSaleList();
    },
    handleCurrentChange(val) {
      var that = this;
      that.pageNo = val;
      that.onload();
    },
    searchBtn() {
      //点击搜索按钮
      this.pageNo = 1; //每次搜索赋值为1
      this._GetAfterSaleList();
    },
    goView(e) {
      //去查看详情
      this.$router.push({
        name: "After-details",
        query: { id: e },
      });
      // var id = e.currentTarget.dataset.id;
      //window.location.href = "afterDetails.html?id=" + id;
      // window.open("afterDetails.html?id=" + id);
    },
    rowClass() {
      return "background: #E7F7F6; color: #333; font-weight: normal;text-align:center";
    },
  },
};
</script>

<style lang="less" scoped>
.diaForm {
  .el-input {
    width: 200px;
  }
}
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.mr20 {
  margin-right: 10px;
}
.width1 {
  width: 120px;
  margin-right: 10px;
}
.width2 {
  width: 130px;
}
.width3 {
  width: 250px;
}
.searchDiv {
  margin-bottom: 20px;
  text-align: right;
}
.searchDiv [class^="el-icon"] {
  color: #fff;
}
.searchBtn {
  background: #13b5b1;
  border: 1px solid #0c9c9a;
}
</style>

