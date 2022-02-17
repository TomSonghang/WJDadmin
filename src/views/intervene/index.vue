<template>
  <div class="filterBox">
    <el-dialog title="处理列表" :visible.sync="dialogTableVisible" center>
      <el-table :data="dialogList" max-height="400" :header-cell-style="rowClass" border>
        <el-table-column property="operatorName" label="操作人" width="120" align="center">

        </el-table-column>
        <el-table-column property="createDateTime" label="操作时间" width="160" align="center">

        </el-table-column>
        <el-table-column property="endStatusName" label="状态改为" align="center">

        </el-table-column>
        <el-table-column property="operationReason" label="处理记录" width="200" align="center">

        </el-table-column>
        <el-table-column property="disposeAttachmentInfo" label="附件" align="center">
          <template slot-scope="scope">
            <div style="width: 80px; height: 80px" v-if="scope.row.disposeAttachmentInfo.length>0">
              <el-image style="width: 80px; height: 80px" :src="scope.row.disposeAttachmentInfo[0].imgPath" fit="contain" :preview-src-list="scope.row.disposeAttachmentInfo | arre">
              </el-image>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange1" :page-size="pageSize1" layout="prev, pager, next" :total="dialogTotle">
      </el-pagination>
    </el-dialog>
    <!--处理列表弹窗-->
    <el-dialog title="新增处理记录" :visible.sync="dialogFormVisible1" center>
      <el-form :model="form">
        <el-form-item label="介入状态" :label-width="formLabelWidth">
          <el-select v-model="form.platfromInStatus" placeholder="介入状态">
            <el-option v-for="item in getStatuData" :key="item.ID" :label="item.CodeName" :value="item.ID" :disabled="item.ID == optionStatus?true:false">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理记录" :label-width="formLabelWidth">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入处理记录" v-model="form.textarea">
          </el-input>
        </el-form-item>
        <el-form-item label="上传附件" :label-width="formLabelWidth">
          <!--:data="formData"-->
          <el-upload action="#" ref="upload" :multiple='true' :before-upload="beforeUpload" list-type="picture-card" :auto-upload="false"
            :on-preview="handlePictureCardPreview" :on-change='imgsuccess' :on-remove='imgremove' :limit="3" :http-request="uploadFile">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传三张jpg/png文件，且不超过5M</div>
          </el-upload>

          <el-dialog :visible.sync="dialogVisible2">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <!--上传-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="formTrue">确 定</el-button>
      </div>
    </el-dialog>
    <!--去处理上传窗体-->
    <el-card>
      <div>
        <div class="searchDiv">
          <el-input v-model="platfromInId" placeholder="介入ID" class="orderInput"></el-input>
          <el-input v-model="afterSaleId" placeholder="售后ID" class="orderInput"></el-input>

          <el-input v-model="buyerName" placeholder="买家ID/昵称" class="orderInput"></el-input>
          <el-input v-model="sellerName" placeholder="卖家ID/昵称" class="orderInput"></el-input>

          <el-select v-model="reasonCode" placeholder="售后原因" class="productSelect">
            <el-option v-for="item in afterWhyData" :key="item.Code" :label="item.CodeName" :value="item.Code">
            </el-option>
          </el-select>

          <el-select v-model="typeCode" placeholder="售后要求" class="productSelect">
            <el-option v-for="item in afterAsk" :key="item.Code" :label="item.CodeName" :value="item.Code">
            </el-option>
          </el-select>

          <el-select v-model="afterSaleStatus" placeholder="售后状态" class="productSelect">
            <el-option v-for="item in afterStatuData" :key="item.ID" :label="item.CodeName" :value="item.ID">
            </el-option>
          </el-select>

          <el-select v-model="platfromInStatus" placeholder="介入状态" class="productSelect">
            <el-option v-for="item in getStatuData" :key="item.ID" :label="item.CodeName" :value="item.ID">
            </el-option>
          </el-select>

          <el-button type="primary" icon="el-icon-search" size="medium" class="searchBtn" @click="searchBtn">{{msg}}</el-button>
        </div>
        <div>

          <el-table :data="listTotal" max-height="700" border v-loading="loading" element-loading-text="拼命加载中" :header-cell-style="rowClass">
            <el-table-column prop="id" label="介入ID" width="90" align="center">
            </el-table-column>
            <el-table-column prop="afterSaleId" label="售后Id" width="90" align="center">
              <template slot-scope="scope">
                <link-a url='/after-sale/index' :userId='scope.row.afterSaleId' :val='scope.row.afterSaleId' />
              </template>
            </el-table-column>
            <el-table-column prop="platfromInUser" label="申请介入方" width="100" align="center">

            </el-table-column>
            <el-table-column prop="buyerNickName" label="买家信息" width="150" align="center">
              <template slot-scope="scope">
                <link-a url='/userinfo/index' :userId='scope.row.buyerUserId' :val='scope.row.buyerNickName' />
              </template>
            </el-table-column>
            <el-table-column prop="sellerNickName" label="卖家信息" width="150" align="center">
              <template slot-scope="scope">
                <link-a url='/userinfo/index' :userId='scope.row.sellerUserId' :val='scope.row.sellerNickName' />
              </template>
            </el-table-column>
            <el-table-column prop="productNum" label="产品信息" width="300" align="center">
              <template slot-scope="scope">
                <div class="productBox">
                  <div class="productImgBox">
                    <!--<img :src="scope.row.MainProductImg" alt="Alternate Text" />-->

                    <el-image style="width: 80px; height: 80px" :src="scope.row.mainProductImg" fit="contain" :preview-src-list="[scope.row.mainProductImg]">
                    </el-image>
                  </div>
                  <div class="productText">
                    <p>
                      <span>{{scope.row.productName}}</span>
                    </p>
                    <p>产品ID:
                      <link-a url='/productinfo/index' :productId='scope.row.productId' :val='scope.row.productId' />
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="reasonCodeName" label="售后原因" align="center">

            </el-table-column>
            <el-table-column prop="typeCodeName" label="售后要求" align="center">
            </el-table-column>
            <el-table-column prop="afterSaleStatus" label="售后状态" align="center">
              <template slot-scope="scope">
                {{scope.row.afterSaleStatus|status}}
              </template>
            </el-table-column>
            <el-table-column prop="platfromInStatus" label="介入状态" align="center">
              <template slot-scope="scope">
                {{scope.row.platfromInStatus|getStatus}}
              </template>
            </el-table-column>
            <el-table-column prop="disposeCount" label="处理记录" width="90" align="center">
              <template slot-scope="scope">
                <el-button type="text" class="companyColor" @click="goRecord(scope.row.id)">
                  {{scope.row.disposeCount}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="ID" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="warning" size="mini" @click="goDo(scope.row.id,scope.row.status)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
          layout="total, sizes,prev, pager, next" class="fyDiv" :total="listTotalNum">
        </el-pagination>

      </div>
    </el-card>

  </div>
</template>

<script>
import {
  GetPlatformInList,
  GetPlatformInProcessingList,
  PlatformInProcessing,
  UploadFiles,
} from "@/api/intervene";
import Code from "@/api/statusCode";
import LinkA from "@/components/LinkA/index";
export default {
  name: "Intervene",
  data: function() {
    return {
      msg: "查询",
      jsonData: "", //总数据
      listTotal: [], //数据列表
      listTotalNum: 0, //总的列表数量

      gridData: "", //处理记录表格数据

      platfromInId: "",
      startEndTime: "",
      loading: true,
      dialogTableVisible: false, //处理记录弹窗开关
      dialogFormVisible1: false, //新增处理记录

      afterSaleId: "",
      typeCode: "",
      reasonCode: "",
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
      getStatuData: [
        //介入状态
        { ID: 1, CodeName: "未处理" },
        { ID: 2, CodeName: "处理中" },
        { ID: 3, CodeName: "已处理" },
      ],
      sellerName: "",
      buyerName: "",

      platfromInStatus: "",
      afterSaleStatus: "",

      pageSize: 10, //主列表
      pageNo: 1,
      currentPage: 1,

      dialogTotle: "", //弹窗总数
      dialogList: "", //弹窗列表数据
      pageSize1: 10, //弹窗的列表
      pageNo1: 1,
      doUpload: "/api/ApiManage/UploadFile",
      //图片需要上传的额外数据
      formData: {
        action: "PlatformInProcessing",
        platfromInId: "",
        status: "", //介入记录
        operationReason: "", //输入内容
      },
      form: {
        platfromInStatus: "", //介入记录
        textarea: "", //输入内容
      },
      formLabelWidth: "120px",

      dialogImageUrl: "", //这段是上传参数
      dialogVisible2: false,
      disabled: false,

      jieruId: "", //点击处理之后给介入ID赋值,点击取消或者关闭之前再重置

      optionStatus: "", //禁用状态optine
      formDate: "",

      markId: "", //点击处理记录ID

      imgArr: [], //需要上传图片的集合
    };
  },
  mounted() {
    this._GetIntervenelist();
  },
  components: {
    LinkA,
  },
  filters: {
    arre: function(value) {
      //转数组
      if (value.length > 0) {
        var arr = [];
        for (var i = 0; i < value.length; i++) {
          arr.push(value[i].imgPath);
        }
        return arr;
      }
    },
    status: function(value) {
      //售后状态变文字
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
    getStatus: function(value) {
      //介入状态变文字
      switch (value) {
        case 1:
          return "未处理";
          break;
        case 2:
          return "处理中";
          break;
        case 3:
          return "已处理";
          break;
        default:
          return "...";
      }
    },
  },
  beforeRouteEnter(to, from, next) {
 
    next(vm => {
      if (to && to.name == "Intervene-index" && to.query.statu) {
        vm.platfromInStatus = Number(to.query.statu); //跳转过来给未处理状态
      }
    });
  },
  methods: {
    _GetIntervenelist() {
      let that = this;
      let data = {
        pageNo: that.pageNo,
        pageSize: that.pageSize,
        platfromInId: that.platfromInId,
        afterSaleId: that.afterSaleId,
        receiveCode: "",
        reasonCode: that.reasonCode,
        typeCode: that.typeCode,
        afterSaleStatus: that.afterSaleStatus,
        platfromInStatus: that.platfromInStatus,
        buyer: that.buyerName,
        seller: that.sellerName,
      };
      GetPlatformInList(data).then(response => {
        that.loading = false;
        if (response.status === Code.SUCCESS_CODE) {
          that.jsonData = response.data;
          that.listTotalNum = response.data.dataCount;
          that.listTotal = response.data.list;
        } else {
          that.$message(response.message);
          console.log(error);
        }
      });
    },
    searchBtn() {
      //点击搜索按钮
      this.pageNo = 1; //每次搜索赋值为1
      this._GetIntervenelist();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this._GetIntervenelist();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this._GetIntervenelist();
    },
    handleCurrentChange1(val) {
      //弹窗分页
      this.pageNo1 = val;
      this.codeMark();
    },
    goRecord(e) {
      //点击了处理记录
      console.log(e);
      let that = this;
      that.dialogTableVisible = true;
      that.markId = e;
      that.pageNo1 = 1;

      that.codeMark();
    },
    codeMark() {
      let that = this;
      let data = {
        pageNo: that.pageNo1,
        pageSize: that.pageSize1,
        platfromInId: that.markId,
      };
      GetPlatformInProcessingList(data).then(response => {
        that.gridData = response.data;
        that.dialogTotle = response.data.dataCount; //列表总数量
        that.dialogList = response.data.list; //弹窗列表数据
      });
    },
    goDo(id, option) {
      //点击去处理
      this.jieruId = ""; //每次点进来之前先清空;
      this.dialogFormVisible1 = true;
      this.jieruId = id; //赋值给全局变量
      this.optionStatus = option;
    },
    beforeUpload(file) {
      //上传图片准备
      const isJPG =
        file.type == "image/jpeg" ||
        file.type == "image/png" ||
        file.type == "image/gif";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.warning("上传头像图片只能是 JPG/PNG/GIF 格式!");
        return isJPG;
      }
      if (!isLt5M) {
        this.$message.warning("上传头像图片大小不能超过 5MB!");
        return isLt5M;
      }
      this.multfileImg = file;
      return isJPG && isLt5M;
    },
    handlePictureCardPreview(file) {
      console.log(file);
      debugger;
      this.dialogImageUrl = file.url;
      this.dialogVisible2 = true;
    },
    uploadFile(file) {
      //let that = this;
      let files = file.file;
      // let formData = new FormData();
      // formData.append("fileType", 5);
      // formData.append("guid", "");
      // formData.append("objectId", "");
      this.formDate.append("file", files);

      // UploadFiles(formData, config).then(response => {
      //   if (response.status === Code.SUCCESS_CODE) {
      //     debugger;
      //     that.imgArr = [...that.imgArr, `'${response.data.imagePath}'`];
      //   }
      // });
    },
    formTrue() {
      //去处理确认按钮
      var that = this;
      that.dialogFormVisible1 = false;
      that.formDate = new FormData();

      this.$refs.upload.submit();

      this.formDate.append("platfromInId", that.jieruId);
      this.formDate.append("status", that.form.platfromInStatus);
      this.formDate.append("operationReason", that.form.textarea);

      // let data = {
      //   platfromInId: that.jieruId,
      //   status: that.form.platfromInStatus,
      //   operationReason: that.form.textarea,
      // };
      let config = "multipart/form-data";
      PlatformInProcessing(this.formDate, config).then(response => {
        if (response.status === Code.SUCCESS_CODE) {
          that.$message({
            message: "处理成功",
            type: "success",
          });
        } else {
          that.$message({
            message: "处理未成功," + response.message,
            type: "warning",
          });
        }
      });
    },
    imgsuccess(e) {},
    imgremove(e, t) {},
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
/* .el-button--primary {
  background-color: #13b5b1 !important;
  border-color: #13b5b1;
} */

/* .el-dialog__header {
  background: #13b5b1;
  padding: 20px;
} */

/* .el-dialog__title {
  color: #fff;
} */

/* .el-icon-circle-close {
  color: white;
} */

/* .el-image-viewer__mask {
  opacity: 0.8;
}

.el-image-viewer__close {
  top: 60px;
  right: 60px;
  width: 70px;
  height: 70px;
  font-size: 70px;
} */
</style>

