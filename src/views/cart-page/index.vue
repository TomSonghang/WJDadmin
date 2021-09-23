<template>
    <div>
        <el-card>
            <div class="searchDiv">
                <el-input v-model="userId" placeholder="用户ID" class="width1"></el-input>
                <el-date-picker v-model="startEndTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="加入开始时间"
                    end-placeholder="加入结束时间" value-format="yyyy-MM-dd HH:mm:ss" align="right" class='mr20'>
                </el-date-picker>
                <el-input v-model="productId" placeholder="产品ID" class="width1"></el-input>
                <el-input v-model="sellerName" placeholder="卖家ID/昵称" class="width1"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="searchTab()" class="searchBtn">查询</el-button>
            </div>
            <el-table :data="tableData" :header-cell-style="{ background: '#eaf6f6', color: '#13b5b1' }" border style="box-shadow:0 0 10px #e2e2e2">
                <el-table-column prop="cartId" align="center" label="购物车ID"></el-table-column>
                <el-table-column prop="userId" align="center" label="用户ID"></el-table-column>
                <el-table-column prop="userNickName" align="center" label="用户昵称" width="200px">
                    <template slot-scope="scope">
                        <link-a url='/userinfo/index' :userId='scope.row.userId' :val='scope.row.userNickName' />
                    </template>
                </el-table-column>
                <el-table-column prop="createDateTime" align="center" label="加入时间" width="200px"></el-table-column>
                <el-table-column prop="productId" align="center" label="产品ID" width="200"></el-table-column>
                <el-table-column prop="imageList" align="center" label="产品图片" width="120">
                    <template slot-scope="scope">
                        <el-image @click.stop="handleClickItem" fit='cover' style="width: 100px; height: 100px" :src="scope.row.pImages[0]" :preview-src-list="scope.row.pImages"
                            v-if='scope.row.pImages.length>0'>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="productKey" align="center" label="产品名称" width="200"></el-table-column>
                <el-table-column prop="price" align="center" label="产品价格" width="200"></el-table-column>
                <el-table-column prop="supplierUserName" align="center" label="卖家昵称" width="200">
                    <template slot-scope="scope">
                        <link-a url='/userinfo/index' :userId='scope.row.supplierUserId' :val='scope.row.supplierUserName' />
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="total, sizes, prev, pager, next" :page-sizes="pageSizes" :page-size="pageSize" :current-page="currentPage"
                :total="total" class="fyDiv" @size-change="handleSize" @current-change="handlePage">
            </el-pagination>
        </el-card>
        <!-- <el-dialog title="标记处理" :visible.sync="diaIsShow" class="diaForm">
            <el-form ref="diaForm" :model="formData" label-width="140px">
                <el-form-item label="处理理由">
                    <el-input type="textarea" v-model="formData.mark" placeholder="请填写您处理所依据的理由,必填项目"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="changeTab">确认</el-button>
                    <el-button @click="diaIsShow = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog> -->
        <!-- <recode-dialog :CodeTable="CodeTable" @close="closeRecode" :diaIsShowTable="diaIsShowTable" :totalCode="totalCode" :arrayData="arrayData"
      @changePage="changePage"></recode-dialog> -->
    </div>
</template>
<script>
/**
 *
 */
import { Message } from "element-ui"; // 引用element-ui的加载和消息提示组件

import { GetProductCartList } from "@/api/cart";
import Code from "@/api/statusCode";
import LinkA from "@/components/LinkA/index";
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,

      total: 200,
      pageSizes: [5, 10, 20, 30, 40],

      userId: "",
      startEndTime: "",
      productId: "",
      sellerName: "",

      tableData: [], //总反馈表
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
    };
  },
  mounted() {
    this._GetCartlist();
  },
  components: {
    LinkA,
  },
  methods: {
    _GetCartlist() {
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        userId: this.userId,
        startTime: this.startEndTime[0] || "",
        endTime: this.startEndTime[1] || "",
        productId: !this.productId ? 0 : this.productId,
        sellerIdOrNickName: this.sellerName,
      };
      GetProductCartList(data).then(res => {
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

    handleSize(e) {
      this.pageSize = e;
      this._GetCartlist();
      //pageSize 改变时会触发
    },
    handlePage(e) {
      this.currentPage = e;
      this._GetCartlist();
      //currentPage 改变时会触发
    },
    searchTab() {
      this.currentPage = 1; //搜索时需要让页面变为1
      this._GetCartlist();
    },
    handleStatu(id, index) {
      //标记处理
      this.diaIsShow = true;
      this.feedbackId = id;
      this.index = index;
      this.formData.mark = ""; //置空
    },
  },
};
</script>

<style lang="less" scoped>
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
.mr20 {
  margin-right: 10px;
}
.width1 {
  width: 180px;
  margin-right: 10px;
}
.width2 {
  width: 260px;
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