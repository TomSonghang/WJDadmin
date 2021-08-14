<template>
  <div>
    <el-card>
      <div class="searchDiv">
        <el-date-picker v-model="times" format="yyyy-MM-dd " type="daterange" align="right" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-input type="text" placeholder="订单编号" clearable class="width1 mar20" v-model="sch_orderSn"></el-input>
        <el-select v-model="sch_status" class="width1" placeholde="请选择状态">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <el-input type="text"  placeholder="卖家ID" clearable class="width1" v-model="sch_seller"></el-input>
        <el-input type="text" placeholder="买家ID" clearable class="width1" v-model="sch_buyer"></el-input>

        <el-button type="primary" icon="el-icon-search" @click="searchTab()" class="searchBtn">查询</el-button>
      </div>
      <el-table :data="tableData" :header-cell-style="{ background: '#eaf6f6', color: '#13b5b1' }" border style="box-shadow:0 0 10px #e2e2e2">
        <el-table-column prop="orderSn" align="center" label="订单编号"></el-table-column>
        <el-table-column prop="createDateTime" align="center" label="下单时间"></el-table-column>
        <el-table-column prop="productCount" align="center" label="产品件数">
          <template slot-scope="scope">
            <span @click="handleCode(scope.row.orderId)" class="companyColor point" v-show="scope.row.productCount > 0">{{ scope.row.productCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productAmount" align="center" label="产品金额"></el-table-column>
        <el-table-column prop="sellerNickName" align="center" label="卖家">
          <template slot-scope="scope">
             <link-a url='/userinfo/index' :userId='scope.row.sellerUserId' :val='scope.row.sellerNickName' />
          </template>
        </el-table-column>
        <el-table-column prop="buyerNickName" align="center" label="买家">
          <template slot-scope="scope">
            <link-a url='/userinfo/index' :userId='scope.row.buyerUserId' :val='scope.row.buyerNickName' />
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="订单状态">
          <template slot-scope="scope">
            <span class="companyColor point" @click="handleStatu(scope.row.orderId)">{{ scope.row.status | changeStatu }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="skipDetails(scope.row.orderId)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination background layout="total, sizes, prev, pager, next" :page-sizes="pageSizes" :page-size="pageSize" :current-page="currentPage" :total="total" class="fyDiv" @size-change="handleSize" @current-change="handlePage">
      </el-pagination>
    </el-card>

    <recode-dialog title="订单状态" :CodeTable="CodeTableStatu" @close="closeRecode" :diaIsShowTable="diaIsShow" :totalCode="totalCode" :arrayData="arrayDataStatu" @changePage="changePageStatu"></recode-dialog>

    <recode-dialog title="产品信息" :CodeTable="CodeTable" @close="closeRecode" :diaIsShowTable="diaIsShowTable" :totalCode="totalCode" :arrayData="arrayData" @changePage="changePage"></recode-dialog>

    <el-dialog title="订单详情" :visible.sync="drawerDetails" >
      <div class="drawer_wrap">
        <el-card class="status_top">
          <div class="tp_one">
            <span class="span_title">订单状态:</span>{{detailsData.status | changeStatu}}</div>
          <div>
            <span class="span_title">修改时间:</span>{{detailsData.modiDateTime}}</div>
        </el-card>
        <el-card>
          <div class="imgBox">
            <div class="sellerImg">
              <el-image :src='detailsData.sellerHeadPath' style="width:40px;height:40px;"></el-image>
            </div>
            <div class="name">{{detailsData.sellerNickName}}</div>
            <router-link tag="a"  :to="`/userinfo/index?userId=${detailsData.sellerUserId}`" class="aTag"></router-link>
          </div>

          <div v-for='(item,index) in detailsData.shoppingList' :key='index' class='productBox'>
            <div class="productImg">
              <el-image :src='item.mainProductImg' fit='cover' style="width:100px;height:100px;"></el-image>
              <router-link tag="a"  :to="`/productinfo/index?id=${item.productId}`" class="aTag"></router-link>
            </div>
            <div class="middle_main">
              <ul>
                <li class="title_key">{{item.productKey}}</li>
                <li class='li_text' v-if='item.specificationDes'>规格: {{item.specificationDes}} </li>
                <li class='li_text' v-if='item.buyerRemark'>备注：{{item.buyerRemark}}</li>
              </ul>
            </div>
            <div class="right_main">
              <ul>
                <li>￥{{item.price}}</li>
                <li class='num_li'>x{{item.quantity}}</li>
              </ul>
            </div>
          </div>

          <div class='total_price'>
            <div>商品总价</div>
            <div class="price">￥{{totalPrice}}</div>
          </div>
        </el-card>

        <div class="addressBox">
          <el-card v-if='detailsData.mcontactPerson'>
            <div class="fahuo">
              <div class="fahuoIcon" style="color:#000;">
                <i class="el-icon-truck"></i>
              </div>
              <div>
                <p class="contant">{{detailsData.mcontactPerson}} {{detailsData.mcontactPhone}} <span class='addressSpan'>(发货地)</span></p>
                <div class="address">{{detailsData.mprovince}} {{detailsData.mcity}} {{detailsData.marea}} {{detailsData.mdetailedAddress}}</div>
              </div>
            </div>
          </el-card>
          <div style="height:20px;"></div>
          <el-card v-if='detailsData.rcontactPerson'>
            <div class="fahuo">
              <div class="fahuoIcon">
                <i class="el-icon-location"></i>
              </div>
              <div>
                <p class="contant">{{detailsData.rcontactPerson}} {{detailsData.rcontactPhone}} <span class='addressSpan'>(收货地)</span></p>
                <div class="address">{{detailsData.rprovince}} {{detailsData.rcity}} {{detailsData.rarea}} {{detailsData.rdetailedAddress}}</div>
              </div>
            </div>
          </el-card>
        </div>
        <div class="orderMark">
          <el-card class="status_top">
            <div class="tp_one">
              <span class="span_title">订单编号:</span>{{detailsData.orderSn}}</div>
            <div class="tp_one">
              <span class="span_title">下单时间:</span>{{detailsData.createDateTime}}</div>
            <div class="tp_one" v-if='detailsData.orderRemark'>
              <span class="span_title">订单备注:</span>{{detailsData.orderRemark}}</div>
          </el-card>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>/**
  
 */
//import { Message } from "element-ui"; // 引用element-ui的加载和消息提示组件
import {
  GetOrderList,
  GetOrderDetails,
  GetOrderLog,
  GetShopping,
} from "@/api/orderinfo";
import RecodeDialog from "@/components/recodeDialog/index";
import Code from "@/api/statusCode";
import LinkA from '@/components/LinkA/index'
import recode from "@/mixins/recode";
import enterPage from "@/mixins/enterPage";
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 200,
      pageSizes: [5, 10, 20, 30, 40],

      //订单状态
      diaIsShow: false,
      CodeTableStatu: [], //弹窗记录表
      arrayDataStatu: [
        {
          name: "卖家/买家",
          prop: "userId",
        },
        {
          name: "用户名",
          prop: "nickName",
        },
        {
          name: "日期时间",
          prop: "createDateTime",
        },
        {
          name: "操作订单状态",
          prop: "operationContent",
        },
      ],

      //产品信息
      diaIsShowTable: false,
      CodeTable: [],
      arrayData: [
        {
          name: "产品ID",
          prop: "productId",
        },
        {
          name: "图片",
          prop: "mainProductImg",
          type: "img",
        },
        {
          name: "产品名称",
          prop: "productKey",
        },
        {
          name: "产品描述",
          prop: "productDes",
        },
        {
          name: "规格信息",
          prop: "specificationDes",
        },
        {
          name: "件数",
          prop: "quantity",
        },
        {
          name: "单价",
          prop: "price",
        },
        {
          name: "金额小计",
          prop: "amountSum",
        },
      ],

      //详情
      drawerDetails: false,
      detailsData: {}, //详情数据
      totalPrice: 0, //总价

      orderSn: "", //订单编号
      orderId: "", //订单ID
      index: "", //选中的下标值
      times: "",
      sch_orderSn: "", //订单编号
      sch_seller: "", //卖家
      sch_buyer: "",
      sch_status: "",
      options: [
        { label: "订单状态", value: "" },
        { label: "待付款", value: 1 },
        { label: "待发货", value: 2 },
        { label: "待收货", value: 3 },
        { label: "已完成", value: 4 },
        { label: "已取消", value: 5 },
        { label: "有效订单", value: 100 },
      ],

      //rules: [{ required: true, message: "请输入理由", trigger: "blur" }],

      tableData: [], //总反馈表
    };
  },
  mixins: [recode, enterPage],
  beforeRouteEnter(to, form, next) {
    next(vm => {
      console.log(to)
      debugger
      if (to && to.name === "Orderinfo-index" && to.query.userId) {
        debugger
        //产品信息
        vm.currentPage = 1;//不然会出现搜不到数据的情况
        vm.sch_seller = to.query.userId;
        vm.sch_status = Number(to.query.statu) || '';
        /*置空*/
        vm.times = "";
        vm.sch_orderSn = "";
        vm.sch_buyer = "";
        vm._GetOrderList();
      }
    });
  },
  mounted() {
    // if (this.$route.params.id) {
    //   this.sch_seller = this.$route.params.id;
    //   this.sch_status = this.$route.params.statu;
    //   this._GetOrderList();
    // } else {
    //   this._GetOrderList();
    // }
    this._GetOrderList();
  },
  // watch: {
  //   $route(to, from) {
  //     if (to && to.name === "Orderinfo-index" && this.$route.params.id) {
  //       //产品信息
  //       this.sch_seller = this.$route.params.id;
  //       if (this.$route.params.statu) {
  //         this.sch_status = this.$route.params.statu;
  //       }
  //       /*置空*/
  //       this.times='';
  //       this.sch_orderSn='';
  //       this.sch_buyer='';
  //       this._GetOrderList();
  //     }
  //   },
  // },
  components: {
    RecodeDialog,
    LinkA
  },
  filters: {
    changeStatu(val) {
      switch (val) {
        case 1:
          return "待付款";
        case 2:
          return "待发货";
        case 3:
          return "待收货";
        case 4:
          return "已完成";
        case 5:
          return "已取消";
        default:
          return "未知状态";
      }
    },
  },
  methods: {

    test() {
      let target = this.$refs.target
      debugger
      target.setAttribute('href', window.location.origin + '/orderinfo/index')
      target.click()
    },      
    _GetOrderList() {
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderSn: this.sch_orderSn,
        status: this.sch_status,
        seller: this.sch_seller,
        buyer: this.sch_buyer,
        beginTime: this.times[0] || "",
        endTime: this.times[1] || "",
      };

      GetOrderList(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.tableData = res.data.list;
          this.total = res.data.count;
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    changePage(e) {
      //处理记录的翻页处理
      this.recodePage = e;
      this._GetShopping(); //个数
    },
    changePageStatu(e) {
      //处理记录的翻页处理
      this.recodePage = e;
      this._GetOrderLog(); //状态
    },
    changeTab() {},
    handleCode(id) {
      //产品件数

      this.diaIsShowTable = true;
      console.log("产品件数");
      this.orderId = id;
      this.recodePage = 1;
      this._GetShopping();
    },
    _GetShopping() {
      let data = {
        pageNo: this.recodePage,
        pageSize: 5,
        orderId: this.orderId,
      };
      GetShopping(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.CodeTable = res.data.list;
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    handleSize(e) {
      this.pageSize = e;
      //pageSize 改变时会触发
    },
    handlePage(e) {
      this.currentPage = e;
      this._GetOrderList();
      //currentPage 改变时会触发
    },
    searchTab() {
      //查询
      this.currentPage = 1; //搜索时需要让页面变为1
      this._GetOrderList();
    },
    handleStatu(id) {
      //标记处理
      this.diaIsShow = true;
      this.orderId = id;
      this._GetOrderLog();
    },
    closeRecode(e) {
      //关闭记录的弹窗
      this.diaIsShow = e; //订单状态
      this.diaIsShowTable = e; //件数
    },
    _GetOrderLog() {
      //状态
      let data = {
        pageNo: this.recodePage,
        pageSize: 5,
        orderId: this.orderId,
      };
      GetOrderLog(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.CodeTableStatu = res.data.list;
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    _GetOrderDetails() {
      let data = { orderId: this.orderId };
      GetOrderDetails(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          console.log(res.data);
          this.detailsData = res.data;
          let num = [];
          let key = this.detailsData.shoppingList;
          for (let i = 0; i < key.length; i++) {
            let total = key[i].price * key[i].quantity;
            num.push(total);
          }
          this.totalPrice = num.reduce(function(a, b) {
            return a + b;
          });
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    skipDetails(id) {
      this.orderId = id;
      this.drawerDetails = true;
      this._GetOrderDetails();
    },
  },
};
</script>
<style>
:focus {
  outline: 0;
}
</style>
<style lang="less" scoped>
.addressSpan{
font-size:15px;
color:#999;
padding-left:10px;
font-weight:normal;
}
.diaForm {
  .el-input {
    width: 350px;
  }
}
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.width1 {
  width: 180px;
  margin-right: 10px;
}
.mar20 {
  margin-left: 10px;
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

.drawer_wrap {
  padding: 0 20px;
}
.status_top {
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}
.span_title {
  color: #666;
  margin-right: 10px;
}
.tp_one {
  margin-bottom: 10px;
}
.imgBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
}
.sellerImg {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
}
.productBox {
  display: flex;
  margin-bottom: 14px;
}
.productImg {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  flex-basis: 100px;
  margin-right: 10px;
  background: #f5f5f5;
  overflow: hidden;
  position: relative;
}
.middle_main {
  flex: 1;
}
.right_main {
  flex-basis: 80px;
  text-align: right;
}
.title_key {
  padding-bottom: 10px;
}
.li_text {
  font-size: 14px;
  color: #999;
  padding-bottom: 5px;
}
.num_li {
  font-size: 12px;
  color: #999;
  padding-top: 10px;
}
.total_price {
  border-top: 1px solid #f5f5f5;
  padding-top: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-size: 20px;
  font-weight: bold;
  color: #f4382b;
}
.addressBox {
  margin-top: 20px;
}
.fahuo {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.fahuoIcon {
  color: #13b5b1;
  font-size: 30px;
  flex-basis: 50px;
}
.contant {
  font-size: 16px;
  color: #333;
  padding-bottom: 10px;
  font-weight: bold;
}
.address {
  font-size: 14px;
  color: #666;
}
.orderMark {
  margin-top: 20px;
}
.name {
  margin-left: 10px;
  font-weight: bold;
}
.aTag{
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
