<template> 
  <div>
    <el-card>
      <div class="searchDiv">
        <el-input type="text" clearable placeholder="产品ID" class="width1 width2" v-model="sch_product"></el-input>
        <el-input type="text" clearable placeholder="用户ID" class="width1 width2" v-model="sch_user"></el-input>
        <el-select v-model="sch_status" class="width1" placeholde="请选择状态">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <el-input type="text" clearable placeholder="用户名、产品名、产品介绍、后台备注、角标信息" class="width1 width2" v-model="sch_key"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchTab()" class="searchBtn">查询</el-button>
      </div>
      <el-table :data="tableData" :header-cell-style="{ background: '#eaf6f6', color: '#13b5b1' }" border style="box-shadow:0 0 10px #e2e2e2">
        <el-table-column prop="productId" align="center" label="产品ID" width="70"></el-table-column>
        <el-table-column prop="pImages" align="center" label="产品图片" width="120">
          <template slot-scope="scope">
            <el-image @click.stop="handleClickItem" fit='cover' style="width: 100px; height: 100px" :src="scope.row.pImages[0]" :preview-src-list="scope.row.pImages" v-if='scope.row.pImages'>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="pImages" align="center" label="产品视频" width="120">
          <template slot-scope="scope">
            <el-image @click.stop="handleClickVideo" fit='cover' style="width: 100px; height: 100px" :src="scope.row.pImages[0]" :preview-src-list="scope.row.pImages" v-if='scope.row.pImages'>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" align="center" label="用户名">
          <template slot-scope="scope">
             <link-a url='/userinfo/index' :userId='scope.row.userId' :val='scope.row.nickName' />
          </template>
        </el-table-column>
        <el-table-column prop="productKey" align="center" label="产品名称" width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.productKey" placement="top-start">
              <span>{{scope.row.productKey }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="pinkage" align="center" label="是否包邮" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.pinkage | Pinkage}}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="price" align="center" label="价格" width="80"></el-table-column>
        <el-table-column prop="specificationList" align="center" label="规格描述 | 价格" width="160">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.specificationList" :key="index">
              <span>{{ item.specificationDes }}</span>
              <span> | </span>
              <span>{{ item.price }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="corner" align="center" label="角标信息" width="80"></el-table-column>
        <el-table-column prop="productRemark" align="center" label="后台备注"></el-table-column>
        <el-table-column prop="collectCount" align="center" label="被收藏数" width="80"></el-table-column>
        <el-table-column prop="resellCount" align="center" label="转卖数" width="70"></el-table-column>
        <el-table-column prop="saleCount" align="center" label="销售件数" width="80"></el-table-column>
        
        <el-table-column prop="releaseTime" align="center" label="发布时间" width="110"></el-table-column>
        <el-table-column prop="modiDateTime" align="center" label="更新时间" width="110"></el-table-column>

        <el-table-column prop="fromNickName" align="center" label="产品来源">
          <template slot-scope="scope">
            <span v-if="scope.row.fromNickName" >
              <link-a url='/userinfo/index' :userId='scope.row.fromUserId' :val='scope.row.fromNickName' />
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | changeStatu }}
          </template>
        </el-table-column> -->
        <el-table-column prop="isPutaway" align="center" label="状态" width="70">
           <template slot-scope="scope">
            <span>{{scope.row.isPutaway | Putaway}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="disposeCount" align="center" label="处理记录" width="80px">
          <template slot-scope="scope">
            <span @click="handleCode(scope.row.productId)" class="companyColor point" v-show="scope.row.disposeCount > 0">{{ scope.row.disposeCount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="handleStatu(scope.row.productId, scope.$index)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next" :page-sizes="pageSizes" :page-size="pageSize" :current-page="currentPage" :total="total" class="fyDiv" @size-change="handleSize" @current-change="handlePage">
      </el-pagination>
    </el-card>
    <el-dialog title="标记处理" :visible.sync="diaIsShow" class="diaForm">
      <el-form ref="diaForm" :model="formData" label-width="140px" :rules="rules">
        <el-form-item label="选择状态">
          <el-select v-model="formData.statusValue" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理理由" prop="mark">
          <el-input type="textarea" v-model="formData.mark" placeholder="请填写您处理所依据的理由,必填项目"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTab">确认</el-button>
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <recode-dialog :CodeTable="CodeTable" @close="closeRecode" :diaIsShowTable="diaIsShowTable" :totalCode="totalCode" :arrayData="arrayData" @changePage="changePage"></recode-dialog>
    <!--表格弹窗-->

  </div>
</template>
<script>
import { Message } from "element-ui"; // 引用element-ui的加载和消息提示组件
import { GetProductList, GetProductDispose } from "@/api/productinfo";
import { BackstageDispose } from "@/api/userinfo";
import RecodeDialog from "@/components/recodeDialog/index";
import Code from "@/api/statusCode";
import LinkA from '@/components/LinkA/index'
import closeMask from "@/mixins/maskCloseImg";
import recode from "@/mixins/recode";
import enterPage from "@/mixins/enterPage";
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,

      total: 200,
      pageSizes: [5, 10, 20, 30, 40],

      diaIsShow: false,
      // diaIsShowTable: false,
      formData: {
        statusValue: 0,
        mark: "",
      },
      productId: "", //产品ID
      index: "", //选中的下标值

      sch_product: "",
      sch_user: "",
      sch_key: "",
      sch_status: -1,
      options: [
        { label: "全部", value: -1 },
        { label: "下架", value: 0 },
        { label: "上架", value: 1 },
        { label: "系统下架", value: 2 },
      ],

      statusOptions: [
        { label: "下架", value: 0 },
        { label: "上架", value: 1 },
        { label: "系统下架", value: 2 },
      ],
      rules: {
        mark: [{ required: true, message: "请输入理由", trigger: "blur" }],
      },

      tableData: [], //总反馈表
      //CodeTable: [], //弹窗记录表
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
       console.log(to)
      debugger
     
      if (to && to.name === "Productinfo-index" && (to.query.userId || to.query.productId)) {
        debugger
        //产品信息
        vm.currentPage = 1;//不然会出现搜不到数据的情况
        vm.sch_product= to.query.productId || '';
        vm.sch_key='';
        vm.sch_user = to.query.userId || '' ;
        if (vm.$route.query.statu) {   //是否上架
          vm.sch_status = Number(to.query.statu) || -1;
        }
        vm._GetProductList();
      }
    });
  },
  mounted() {
    /*
    if (this.$route.params.id) {
      this.sch_key = this.$route.params.id;
      this.sch_status = this.$route.params.statu;
      this._GetProductList();
    } else {
      this._GetProductList();
    }
    */
    this._GetProductList();
  },
  // watch: {
  //   $route(to, from) {
  //     if (to && to.name === "Productinfo-index" && this.$route.params.id) {
  //       //产品信息
  //       this.sch_key = this.$route.params.id;
  //       if (this.$route.params.statu) {
  //         this.sch_status = this.$route.params.statu;
  //       }
  //       this._GetProductList();
  //     }
  //   },
  // },
  mixins: [closeMask, recode, enterPage],
  components: {
    RecodeDialog,
    LinkA
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
    },
  },
  methods: {
    _GetProductList() {
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        productId: this.sch_product || 0,
        userId: this.sch_user,
        isPutaway: this.sch_status,
        key: this.sch_key,
      };
      GetProductList(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          console.log(res);
         // res.data.list[1].pImages.push('https://djt-bucket-public-dev.oss-cn-shenzhen.aliyuncs.com/Shop/ProductVideo/Attachment/10000031/20210811/202108111453054040.mp4')
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
    handleClickVideo(e){   //点击视频
    console.log(e);
    },
    changeTab() {
      //确认修改标记
      if (this.formData.mark == "") {
        Message.error("请写点什么理由吧~");
        return false;
      } else {
        let data = {
          disType: 3, //类型 1：意见反馈 2：黑名单 3：修改产品上架状态
          objectId: this.productId,
          status: this.formData.statusValue,
          operationReason: this.formData.mark,
        };
        BackstageDispose(data).then(res => { 
          if (res.status === Code.SUCCESS_CODE) {
            this.tableData[this.index].disposeCount =     //处理记录数量
              this.tableData[this.index].disposeCount + 1;
              this.tableData[this.index].isPutaway =    this.formData.statusValue ;
            this.$message({
              type: "success",
              message: "处理成功",
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        });
      }
      this.diaIsShow = false;
    },
    _GetProductDispose() {
      //获取记录
      let data = {
        pageNo: this.recodePage,
        pageSize: 5,
        productId: this.productId,
      };
      GetProductDispose(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.CodeTable = res.data.list;
          this.totalCode = res.data.count;
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
      this._GetProductDispose();
    },
    handleCode(id) {
      this.diaIsShowTable = true;
      this.productId = id;
      this.recodePage = 1;
      this._GetProductDispose();
    },
    handleSize(e) {
      this.pageSize = e;
      this._GetProductList();
      //pageSize 改变时会触发
    },
    handlePage(e) {
      this.currentPage = e;
      this._GetProductList();
      //currentPage 改变时会触发
    },
    searchTab() {
      this.currentPage = 1; //搜索时需要让页面变为1
      this._GetProductList();
    },
    handleStatu(id, index) {
      //标记处理
      this.diaIsShow = true;
      this.productId = id;
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
