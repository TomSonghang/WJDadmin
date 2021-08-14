<template>
  <div>
    <el-card>
      <div class="searchDiv">
        <el-select v-model="sch_status" class="width1" placeholde="请选择状态">
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
        <el-input
          type="text"
          placeholder="用户ID/用户名/反馈内容/注册手机号"
          class="width1 width2"
          v-model="sch_order"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="searchTab()"
          class="searchBtn"
          >查询</el-button
        >
      </div>
      <el-table
        :data="tableData"
        :header-cell-style="{ background: '#eaf6f6', color: '#13b5b1' }"
        border
        style="box-shadow:0 0 10px #e2e2e2"
      >
        <el-table-column
          prop="userId"
          align="center"
          label="用户ID"
        ></el-table-column>
        <el-table-column
          prop="nickName"
          align="center"
          label="用户名"
        ></el-table-column>
        <el-table-column
          prop="content"
          align="center"
          label="反馈内容"
          width="320px"
        ></el-table-column>
        <el-table-column
          prop="contact"
          align="center"
          label="联系方式"
        ></el-table-column>
        <el-table-column
          prop="createDateTime"
          align="center"
          label="反馈时间"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="处理状态"
          width="100px"
        >
          <template slot-scope="scope">
            {{ scope.row.status | changeStatu }}
          </template>
        </el-table-column>
        <el-table-column
          prop="disposeCount"
          align="center"
          label="处理记录"
          width="100px"
        >
          <template slot-scope="scope">
            <span
              @click="handleCode(scope.row.feedBackId)"
              class="companyColor point"
              v-show="scope.row.disposeCount > 0"
              >{{ scope.row.disposeCount }}</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="small"
              @click="handleStatu(scope.row.feedBackId, scope.$index)"
              >标记处理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        class="fyDiv"
        @size-change="handleSize"
        @current-change="handlePage"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="标记处理" :visible.sync="diaIsShow" class="diaForm">
      <el-form ref="diaForm" :model="formData" label-width="140px">
        <el-form-item label="处理理由">
          <el-input
            type="textarea"
            v-model="formData.mark"
            placeholder="请填写您处理所依据的理由,必填项目"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTab">确认</el-button>
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <recode-dialog
      :CodeTable="CodeTable"
      @close="closeRecode"
      :diaIsShowTable="diaIsShowTable"
      :totalCode="totalCode"
      :arrayData="arrayData"
      @changePage="changePage"
    ></recode-dialog>
  </div>
</template>
<script>
/**
 *
 */
import { Message } from "element-ui"; // 引用element-ui的加载和消息提示组件
import {
  GetFeedBack,
  DisposeFeedBack,
  GetFeedBackDispose
} from "@/api/feedback";
import Code from "@/api/statusCode";
import RecodeDialog from "@/components/recodeDialog/index";
export default {
  data() {
    return {
      totalCode: 0, //处理记录总数据
      recodePage: 1, //处理记录页
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
      ],

      currentPage: 1,
      pageSize: 10,

      total: 200,
      pageSizes: [5, 10, 20, 30, 40],

      diaIsShow: false,
      diaIsShowTable: false,
      formData: {
        mark: ""
      },
      feedbackId: "", //反馈ID
      index: "", //选中的下标值

      sch_order: "",
      sch_status: 0,
      options: [
        { label: "处理状态", value: 0 },
        { label: "待处理", value: 1 },
        { label: "已处理", value: 2 }
      ],

      //rules: [{ required: true, message: "请输入理由", trigger: "blur" }],

      tableData: [], //总反馈表
      CodeTable: [] //弹窗记录表
    };
  },
  components: { RecodeDialog },
  mounted() {
    this._GetFeedBack();
  },
  filters: {
    changeStatu(val) {
      switch (val) {
        case 1:
          return "待处理";
        case 2:
          return "已处理";
        default:
          return "未知状态";
      }
    }
  },
  methods: {
    _GetFeedBack() {
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        status: this.sch_status || 0,
        key: this.sch_order
      };
      GetFeedBack(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.tableData = res.data.list;
          this.total = res.data.count;
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    },
    changeTab() {
      //确认修改标记
      if (this.formData.mark == "") {
        Message.error("请写点什么理由吧~");
        return false;
      } else {
        let data = {
          feedBackId: this.feedbackId,
          operationReason: this.formData.mark
        };
        DisposeFeedBack(data).then(res => {
          if (res.status === Code.SUCCESS_CODE) {
            this.tableData[this.index].disposeCount =
              this.tableData[this.index].disposeCount + 1;
            this.$message({
              type: "success",
              message: "标记成功"
            });
          } else {
            this.$message({
              type: "error",
              message: res.message
            });
          }
        });
      }
      this.diaIsShow = false;
    },
    _GetFeedBackDispose() {
      let data = {
        pageNo: this.recodePage,
        pageSize:5 ,
        feedBackId: this.feedBackId
      };
      GetFeedBackDispose(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.CodeTable = res.data.list;
          this.totalCode = res.data.count;
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    },
    handleCode(id) {
      //点击处理记录
      this.diaIsShowTable = true;
      this.feedBackId = id;
      this.recodePage = 1;
      this._GetFeedBackDispose();
    },
    changePage(e) {
      //处理记录的翻页处理
      this.recodePage = e;
      this._GetFeedBackDispose();
    },
    closeRecode(e) {
      //关闭记录的弹窗
      this.diaIsShowTable = e;
    },
    handleSize(e) {
      this.pageSize = e;
      this._GetFeedBack();
      //pageSize 改变时会触发
    },
    handlePage(e) {
      this.currentPage = e;
      this._GetFeedBack();
      //currentPage 改变时会触发
    },
    searchTab() {
      this.currentPage = 1; //搜索时需要让页面变为1
      this._GetFeedBack();
    },
    handleStatu(id, index) {
      //标记处理
      this.diaIsShow = true;
      this.feedbackId = id;
      this.index = index;
      this.formData.mark = ""; //置空
    }
  }
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
