<template>
  <div>
    <el-card>
      <div class="searchDiv">
        <!-- <el-select v-model="sch_status" clearable class="width1" placeholde="是否VIP">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select> -->
        <el-select v-model="sch_status" clearable class="width1" placeholde="是否开店">
          <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <el-input type="number" clearable placeholder="VIP到期日期小于(n)天" class="width1" v-model="sch_day"></el-input>
        <el-input type="text" clearable placeholder="请输入用户ID" class="width1" v-model="userID"></el-input>
        <el-input type="text" clearable placeholder="用户ID、用户名、微信号、手机号" class="width1 width2" v-model="sch_key" ></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchTab()" class="searchBtn">查询</el-button>
      </div>
      <el-table :data="tableData"  :header-cell-style="{ background: '#eaf6f6', color: '#13b5b1' }" border style="box-shadow:0 0 10px #e2e2e2" @sort-change="onSortChange">
        <el-table-column width="90" prop="userId" align="center"  sortable="custom" :sort-orders="['ascending','descending']" label="用户ID" fixed="left"></el-table-column>
        <el-table-column width="150" prop="nickName" align="center" label="用户名" fixed="left"></el-table-column>
        <el-table-column prop="headPath" align="center" label="用户头像" width="120">
          <template slot-scope="scope">
            <el-image @click.stop="handleClickItem" fit='cover' style="width: 100px; height: 100px" :src="scope.row.headPath" :preview-src-list="[scope.row.headPath]" v-if='scope.row.headPath'>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="shopBackground" align="center" label="店招背景" width="120">
          <template slot-scope="scope">
            <el-image @click.stop="handleClickItem" fit='cover' style="width: 100px; height: 100px" :src="scope.row.shopBackground" :preview-src-list="[scope.row.shopBackground]" v-if='scope.row.shopBackground'>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column width="110" prop="signature" align="center" label="简介"></el-table-column>
        <el-table-column width="110" prop="createDateTime" align="center" label="进驻日期"></el-table-column>
        <el-table-column width="110" prop="lastLoginTime" align="center" label="最近活跃" sortable="custom" :sort-orders="['ascending','descending']"></el-table-column>
        <el-table-column width="80" prop="fansCount" align="center" label="粉丝" sortable="custom" :sort-orders="['ascending','descending']">
          <template slot-scope="scope">
            <span @click="handleCodeFans(scope.row.userId)" class="companyColor point" v-show="scope.row.fansCount > 0">{{ scope.row.fansCount }}</span>
          </template>
        </el-table-column>
        <el-table-column width="80" prop="attentionCount" align="center" label="关注" sortable="custom" :sort-orders="['ascending','descending']">
          <template slot-scope="scope">
            <span @click="handleCodeAttention(scope.row.userId)" class="companyColor point" v-show="scope.row.attentionCount > 0">{{ scope.row.attentionCount }}</span>
          </template>
        </el-table-column>
        <el-table-column width="80" prop="collectProductCount" align="center" label="收藏" sortable="custom" :sort-orders="['ascending','descending']">
          <template slot-scope="scope">
            <span @click="handleCodeCollect(scope.row.userId)" class="companyColor point" v-show="scope.row.collectProductCount > 0">{{ scope.row.collectProductCount }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="联系方式">
          <el-table-column align="center" label="微信号">
            <el-table-column prop="phone" align="center" label="手机号" width="120">
              <template slot-scope="scope">
                <div>{{ scope.row.wxNumber}}</div>
                <div class="line"></div>
                <div>{{ scope.row.telephone }}</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="联系人">
            <el-table-column prop="phone" align="center" label="地区" width="150">
              <template slot-scope="scope">
                <div>{{ scope.row.contacts}}</div>
                <div class="line"></div>
                <div>{{ scope.row.province + scope.row.city + scope.row.area}}</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="deductionAddUp" align="center" label="详细地址" width="200">
              <template slot-scope="scope">
                <div>{{ scope.row.detailedAddress}}</div>
              </template>
          </el-table-column>
        </el-table-column>

        <el-table-column align="center" label="VIP信息" label-class-name="topTable">
          <el-table-column prop="isVip" align="center" label="是否VIP">
            <el-table-column prop="expireTime" align="center" label="到期日期" width="110">
              <template slot-scope="scope">
                <div>{{ scope.row.isVip | vip }}</div>
                <div class="line"></div>
                <div>{{ scope.row.expireTime | cutTime }}</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="allowMaxCount" align="center" label="最大发布" width="90">
            <el-table-column prop="surplus" align="center" label="剩余发布">
              <template slot-scope="scope">
                <div>{{ scope.row.allowMaxCount }}</div>
                <div class="line"></div>
                <div>{{ scope.row.surplus }}</div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="buyVipCount" align="center" label="购买VIP次数">
            <el-table-column prop="buyVipAmount" align="center" label="购买VIP金额" width="110">
              <template slot-scope="scope">
                <div  class="companyColor point">
                  {{ scope.row.buyVipCount }}
                </div>
                <div class="line"></div>
                <div class="companyColor point">
                  {{ scope.row.buyVipAmount }}
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="deductionAddUp" align="center" label="购VIP抵扣率" width="120"></el-table-column>
        </el-table-column>

        <el-table-column align="center" label="卖家信息">
          <el-table-column prop="productCount" align="center" label="发布产品总数"  sortable="custom" :sort-orders="['ascending','descending']">
            <el-table-column prop="isPutawayCount" align="center" label="在线产品数" width="130">
              <template slot-scope="scope">
                <div>
                  <link-a url='/productinfo/index' :userId='scope.row.userId' :statu='-1' :val='scope.row.productCount' />
                </div>
                <div class="line"></div>
                <div>
                  <link-a url='/productinfo/index' :userId='scope.row.userId' :statu='1' :val='scope.row.isPutawayCount' />
                </div>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="shopStatusText" align="center" label="是否开店">
            <el-table-column prop="agentStatusText" align="center" label="是否分销" width="110">
              <template slot-scope="scope">
                   {{ scope.row.shopStatusText }}
                <div class="line"></div>
                   {{ scope.row.agentStatusText }}
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="byCollectProductCount" align="center" label="产品被收藏" width="120" sortable="custom" :sort-orders="['ascending','descending']"></el-table-column>

          <el-table-column prop="sellerOrderCount" align="center" label="订单总数" sortable="custom" :sort-orders="['ascending','descending']">
            <el-table-column prop="sellerValidOrderCount" align="center" label="有效订单数" width="120">
              <template slot-scope="scope">
                <div>
                  <link-a url='/orderinfo/index' :userId='scope.row.userId' :val='scope.row.sellerOrderCount' />
                </div>
                <div class="line"></div>
                <div>
                  <link-a url='/orderinfo/index' :userId='scope.row.userId' :statu='100' :val='scope.row.sellerValidOrderCount' />
                </div>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="sellerOrderProductCount" align="center" label="订单产品总数" sortable="custom" :sort-orders="['ascending','descending']">
            <el-table-column prop="sellerValidOrderProductCount" align="center" label="有效订单产品" width="130">
              <template slot-scope="scope">
                <div>
                  <link-a url='/orderinfo/index' :userId='scope.row.userId' :val='scope.row.sellerOrderProductCount' />
                </div>
                <div class="line"></div>
                <div>
                  <link-a url='/orderinfo/index' :userId='scope.row.userId' :statu='100' :val='scope.row.sellerValidOrderProductCount' />
                </div>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="sellerOrderAmount" align="center" label="订单总金额" sortable="custom" :sort-orders="['ascending','descending']">
            <el-table-column prop="sellerValidOrderAmount" align="center" label="有效订单金额" width="130">
              <template slot-scope="scope">
                <div>
                  <link-a url='/orderinfo/index' :userId='scope.row.userId' :val='scope.row.sellerOrderAmount' />
                </div>
                <div class="line"></div>
                 <div>
                  <link-a url='/orderinfo/index' :userId='scope.row.userId' :statu='100' :val='scope.row.sellerValidOrderAmount' />
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>

        <el-table-column align="center" label="买家信息">
          <el-table-column prop="buyerOrderCount" align="center" label="订单总数" sortable="custom" :sort-orders="['ascending','descending']">
            <el-table-column prop="buyerValidOrderCount" align="center" label="有效订单" width="120">
              <template slot-scope="scope">
                <div>{{ scope.row.buyerOrderCount }}</div>
                <div class="line"></div>
                <div>{{ scope.row.buyerValidOrderCount }}</div>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="buyerOrderProductCount" align="center" label="订单产品总数" sortable="custom" :sort-orders="['ascending','descending']">
            <el-table-column prop="buyerValidOrderProductCount" align="center" label="有效订单产品" width="130">
              <template slot-scope="scope">
                <div>{{ scope.row.buyerOrderProductCount }}</div>
                <div class="line"></div>
                <div>{{ scope.row.buyerValidOrderProductCount }}</div>
              </template>
            </el-table-column>
          </el-table-column>

          <el-table-column prop="buyerOrderAmount" align="center" label="订单总金额" sortable="custom" :sort-orders="['ascending','descending']">
            <el-table-column prop="buyerValidOrderAmount" align="center" label="有效订单金额" width="130">
              <template slot-scope="scope">
                <div>{{ scope.row.buyerOrderAmount }}</div>
                <div class="line"></div>
                <div>{{ scope.row.buyerValidOrderAmount }}</div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | status }}
          </template>
        </el-table-column>
        <el-table-column prop="disposeCount" align="center" label="处理记录">
          <template slot-scope="scope">
            <span @click="handleCode(scope.row.userId)" class="companyColor point" v-show="scope.row.disposeCount > 0">{{ scope.row.disposeCount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="130px">
          <template slot-scope="scope">
            <el-button type="warning" size="small" @click="
                handleStatu(scope.row.userId, scope.$index, scope.row.status)
              ">修改状态</el-button>
            <el-button type="success" size="small" @click="
                sendServe(scope.row.userId, scope.$index, scope.row.nickName)
              " style="margin-top:10px;margin-left:0;background:#13b5b1;">发放服务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin-top:30px">
        <el-pagination background layout="total, sizes, prev, pager, next" :page-sizes="pageSizes" :page-size="pageSize" :current-page="currentPage" :total="total" class="fyDiv" @size-change="handleSize" @current-change="handlePage">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="标记处理" :visible.sync="diaIsShow" class="diaForm">
      <el-form ref="diaFormRecode" :model="formData" label-width="140px" :rules="rules">
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

    <el-dialog title="发放服务" :visible.sync="diaIsShowServe" class="diaForm">
      <el-form ref="diaForm" :model="formDataServe" label-width="140px" :rules="relesServe">
        <el-form-item label="用户名">
          <el-input type="text" disabled class="width1" v-model="formDataServe.userName"></el-input>
        </el-form-item>
        <el-form-item label="服务类型">
          <el-select v-model="formDataServe.statusValue" placeholder="请选择">
            <el-option v-for="item in priceType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="price">
          <el-input type="number" placeholder="用户实际支付金额" class="width1" v-model="formDataServe.price"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="mark">
          <el-input type="textarea" v-model="formDataServe.mark" placeholder="必填"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTabServe">确认</el-button>
          <el-button @click="diaIsShowServe = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <recode-dialog :CodeTable="CodeTable" @close="closeRecode" :diaIsShowTable="diaIsShowTable" :totalCode="totalCode" :arrayData="arrayData" @changePage="changePage"></recode-dialog>
    <!--处理记录-->
    <recode-dialog :CodeTable="CodeTableFans"  @changeId='changeId' title='我的粉丝' @close="closeRecodeFans" :totalCode="totalCodeFans" :diaIsShowTable="diaIsShowFans"  :arrayData="arrayDataFans" @changePage="changePageFans"></recode-dialog>
    <!--粉丝-->
    <recode-dialog :CodeTable="CodeTableAttention"  @changeId='changeId' title='我的关注' @close="closeRecodeAttention" :totalCode="totalCodeAttention" :diaIsShowTable="diaIsShowAttention"  :arrayData="arrayDataAttention" @changePage="changePageAttention"></recode-dialog>
    <!--关注-->
    <recode-dialog :CodeTable="CodeTableCollect" title='我的收藏'  @changeId='changeId' @close="closeRecodeCollect" :totalCode="totalCodeCollect" :diaIsShowTable="diaIsShowCollect"  :arrayData="arrayDataCollect" @changePage="changePageCollect"></recode-dialog>
    <!--收藏-->
  </div>
</template>

<script>
import { Message } from "element-ui"; // 引用element-ui的加载和消息提示组件
import {
  PayAPI,
  GetUserList,
  GetBlacklistDispose,
  BackstageDispose,
  MyFans,
  MyCollectProduct,
  MyAttention
} from "@/api/userinfo";
import enterPage from "@/mixins/enterPage";
import RecodeDialog from "@/components/recodeDialog/index";
import LinkA from '@/components/LinkA/index'
import closeMask from "@/mixins/maskCloseImg";
import Code from "@/api/statusCode";
export default {
  mixins: [enterPage,closeMask],
  data() {
    return {
     

      currentPage: 1,
      pageSize: 5,

      total: 200,
      pageSizes: [5, 10, 20, 30, 40],

      diaIsShowTable: false,
      totalCode: 0, //处理记录总数据
      recodePage: 1, //处理记录页
      CodeTable: [], //反馈记录的数据
      arrayData: [
        //梳理记录的表头和数据
        {
          name: "操作员ID",
          prop: "operatorId",
        },
        {
          name: "操作员姓名",
          prop: "operatorName",
        },
        {
          name: "操作时间",
          prop: "createDateTime",
        },
        {
          name: "理由",
          prop: "operationReason",
        },
        {
          name: "内容",
          prop: "operationContent",
        },
      ],
      /**
       * 处理记录
       */

      diaIsShowFans: false,
      totalCodeFans:0,
      recodePageFans: 1, //处理记录页
      CodeTableFans:[],   //粉丝数据
      arrayDataFans: [
        //梳理记录的表头和数据
        {
          name: "粉丝ID",
          prop: "userId",
          type:"link",
          self:true
        },
        {
          name: "粉丝名称",
          prop: "nickName",
        },
        {
          name: "头像",
          prop: "headPath",
          type:"img"
        },
        {
          name: "产品数",
          prop: "productCount",
        },
        {
          name: "粉丝数",
          prop: "fansCount",
        },
      ],
    
      /**
       * 粉丝
       */

      diaIsShowAttention: false,
      totalCodeAttention:0,
      recodePageAttention: 1, //处理记录页
      CodeTableAttention:[],   //关注数据
      arrayDataAttention: [
        //梳理记录的表头和数据
        {
          name: "关注用户ID",
          prop: "toUserId",
          type:"link",
          self:true
        },
        {
          name: "关注用户名称",
          prop: "nickName",
        },
        {
          name: "头像",
          prop: "headPath",
          type:"img"
        },
        {
          name: "产品数",
          prop: "productCount",
        },
        {
          name: "粉丝数",
          prop: "fansCount",
        },
      ],
    
      /**
       * 关注
       */

      diaIsShowCollect: false,
      totalCodeCollect:0,
      recodePageCollect: 1, //处理记录页
      CodeTableCollect:[],   //收藏数据
      arrayDataCollect: [
        //梳理记录的表头和数据
        {
          name: "ID",
          prop: "supplierUserId",
          type:"link",
          self:true
        },
        {
          name: "名称",
          prop: "nickName",
        },
        {
          name: "头像",
          prop: "headPath",
          type:"img"
        },
        {
          name: "产品图",
          prop: "imageUrl",
          type:"img"
        },
        {
          name: "产品介绍",
          prop: "productKey",
        },
        {
          name: "创建时间",
          prop: "createDateTime",
        },
      ],
    
      /**
       * 收藏
       */


       diaIsShow: false,  //标记处理
      formData: {
        statusValue: 1,
        mark: "",
      },
      userId: "", //用户ID
      userName: "", //用户名
      index: "", //选中的下标值

      sch_status: -1, //是否开店

      priceType: [
        { label: "一年", value: 1 },
        { label: "二年", value: 2 },
        { label: "三年", value: 3 },
      ],
      diaIsShowServe: false,
      formDataServe: {
        userName: "Tom",
        statusValue: 1,
        price: "",
        mark: "",
      },
      options: [
        { label: "全部用户", value: -1 },
        { label: "已开店", value: 1 },
        { label: "未开店", value: 0 },
      ],

      statusOptions: [{ label: "正常", value: 1 }, { label: "异常", value: 2 }],
      sch_key: "",
      sch_day: "",
      userID:"",//用户ID
      tableData: [], //总数据
      

      rules: {
        mark: [{ required: true, message: "请输入备注信息", trigger: "blur" }],
      },
      relesServe: {
        price: [{ required: true, message: "请输入金额", trigger: "blur" }],
        mark: [{ required: true, message: "请输入备注信息", trigger: "blur" }],
      },
      orderby:"",//排序规则  默认为空
    };
  },
  beforeRouteEnter(to, from, next) {
    
    next(vm => {
      console.log(to);
      if (to && to.name === "Userinfo-index" && to.query.userId) {
        //产品信息
        vm.userID = to.query.userId ;
        //置空
        vm.currentPage = 1;//不然会出现搜不到数据的情况 
        vm.sch_status = -1;
        vm.sch_day = "";
        vm.sch_key='';
        vm._GetUserList();
      }
    });
  },
  // beforeRouteUpdate(to, from, next) {
  //   console.log("update");
  // },
  mounted() {
    this._GetUserList();
  },
  components: {
    RecodeDialog,
    LinkA
  },
  filters: {
    cutTime(str) {
      return str.split(" ")[0]=='0001-01-01'?'暂无' : str.split(" ")[0];
    },
    vip(num) {
      switch (num) {
        case 0:
          return "普通用户";
        case 1:
          return "vip用户";
        default:
          return "普通用户";
      }
    },
    status(num) {
      switch (num) {
        case 0:
          return "异常";
        case 1:
          return "正常";
        default:
          return "异常";
      }
    },
  },
  methods: {
    _GetUserList() {
      //获取用户列表接口
      let data = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        userId:this.userID,
        shopStatus: this.sch_status, //全部用户:-1 、 开店用户:"1" 、 未用户:"0"
        vipDays: this.sch_day == 0 ? "" : Math.abs(Math.ceil(this.sch_day)), //vip剩余天数 默认传""
        key: this.sch_key, //用户id、用户名、微信号、手机号 默认传""
        orderby:this.orderby
      };
      GetUserList(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          console.log(res.data);
          this.tableData = res.data.list;
          this.total = res.data.count;
        }
      });
    },
    changeTab() {
      if (!this.formData.mark) {
        Message.error("请写点什么理由吧~");
        return false;
      }
      let data = {
        disType: 2, //处理类型 1：意见反馈 2：黑名单 3：产品状态修改
        objectId: this.userId, //反馈id、用户id、产品id
        status: this.formData.statusValue, //黑名单(1：正常 2：异常)； 修改产品上架状态(0：已下架 1：已上架 2：系统下架)；
        operationReason: this.formData.mark, //处理原因
      };
      BackstageDispose(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.tableData[this.index].status = this.formData.statusValue;
          this.tableData[this.index].disposeCount =
            this.tableData[this.index].disposeCount + 1;
          this.$message({
            type: "success",
            message: "标记成功",
          });
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
        this.diaIsShow = false;
      });
    },
    async changeTabServe() {
      //确认发放服务
      if (!this.formDataServe.mark || this.formDataServe.price == "") {
        Message.error("必填项不能为空~");
        return false;
      }
      let data = {
        entrustType: 3, //（非必填业务类型 3：线下支付 默认填3
        useTicket: true, //（非必填）使用抵扣券 使用:true 不使用:false 默认true
        serviceId: this.formDataServe.statusValue, //（必填）发放的服务id 1：一年 2：二年 3：三年
        serviceCount: 1, //（必填）发放的服务个数
        buyerUserId: this.userId, //（必填）购买服务的用户id
        totalAmount: Math.abs(Math.ceil(this.formDataServe.price)), //（必填）用户实际支付金额（可以为0）
        remark: this.formDataServe.mark, //（必填）备注信息
      };
      let res = await PayAPI(data);
      if (res.status === Code.SUCCESS_CODE) {
        this.$message({
          type: "success",
          message: "发放成功",
        });
      } else {
        this.$message({
          type: "error",
          message: res.message,
        });
      }
      this.diaIsShowServe = false;
      //发送服务确认按钮
    },
    sendServe(id, index, name) {
      //发送服务
      this.diaIsShowServe = true;
      this.formDataServe.userName = name;
      this.userId = id;
      this.index = index;
    },
    searchTab() {
      this.currentPage = 1; //搜索时需要让页面变为1
      this._GetUserList();
    },
    handleStatu(id, index, state) {
      //标记处理
      this.diaIsShow = true;
      this.userId = id;
      this.index = index;
      this.formData.statusValue = state;
      this.formData.mark = ""; //置空
    },
    _GetBlacklistDispose() {
      //获取记录
      let data = {
        pageNo: this.recodePage,
        pageSize: 5,
        userId: this.userId,
      };
      GetBlacklistDispose(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          debugger
          this.CodeTable = res.data.list;
          this.totalCode = res.data.count
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
    

    handleCode(id) {
      //点击处理记录
      this.diaIsShowTable = true;
      this.userId = id;
      this.recodePage = 1;
      this._GetBlacklistDispose();
    },
    changePage(e) {
      //处理记录的翻页处理
      this.recodePage = e;
      this._GetBlacklistDispose();
    },
    closeRecode(e) {
      //关闭记录的弹窗
      this.diaIsShowTable = e;
    },
    //////////////////////////////////////处理记录
     _MyFans() {   
      //获取粉丝
      let data = {
        pageNo: this.recodePageFans,
        pageSize: 5,
        userId: this.userId,
        timeStamp:"",
        key:""
      };
      MyFans(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
        
          this.CodeTableFans = res.data.list;
          this.totalCodeFans = res.data.count
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
     changePageFans(e) {    //粉丝
      //处理粉丝的翻页处理
      this.recodePageFans = e;
      this._MyFans();
    },
    handleCodeFans(id){     //点击了粉丝
 
      this.diaIsShowFans = true;
      this.userId = id;
      this.recodePageFans = 1;
      this._MyFans();
    },
    closeRecodeFans(e) {
      //关闭记录的弹窗
      this.diaIsShowFans = e;
    },
    ////////////////////////////////////粉丝

    _MyAttention() {   
      //获取关注
      let data = {
        pageNo: this.recodePageAttention,
        pageSize: 5,
        userId: this.userId,
        key:""
      };
      MyAttention(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
        
          //this.CodeTableAttention = res.data;
          this.CodeTableAttention = res.data.list;
          this.totalCodeAttention = res.data.count
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
     changePageAttention(e) {    //关注
      //处理粉丝的翻页处理
      this.recodePageAttention = e;
      this._MyAttention();
    },
    handleCodeAttention(id){     //点击了关注
 
      this.diaIsShowAttention = true;
      this.userId = id;
      this.recodePageAttention = 1;
      this._MyAttention();
    },
    closeRecodeAttention(e) {
      //关闭记录的弹窗
      this.diaIsShowAttention= e;
    },
    ////////////////////////////////////关注


     _MyCollectProduct() {   
      //获取收藏
      let data = {
        pageNo: this.recodePageCollect,
        pageSize: 5,
        userId: this.userId,
      };
      MyCollectProduct(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
        
          //this.CodeTableCollect = res.data;
           this.CodeTableCollect = res.data.list;
          this.totalCodeCollect= res.data.count
        } else {
          this.$message({
            type: "error",
            message: res.message,
          });
        }
      });
    },
     changePageCollect(e) {    //收藏
      //处理粉丝的翻页处理
      this.recodePageCollect = e;
      this._MyCollectProduct();
    },
    handleCodeCollect(id){     //点击了收藏
 
      this.diaIsShowCollect = true;
      this.userId = id;
      this.recodePageCollect = 1;
      this._MyCollectProduct();
    },
    closeRecodeCollect(e) {
      //关闭记录的弹窗
      this.diaIsShowCollect = e;
    },
    ////////////////////////////////////收藏
    
    handleSize(e) {
      this.pageSize = e;
      this._GetUserList();
      //pageSize 改变时会触发
    },
    handlePage(e) {
      this.currentPage = e;
      this._GetUserList();
      //currentPage 改变时会触发
    },

    changeId(res){   //link-a孙级调用的
        console.log('res:'+res)
        debugger
        this.userID = res ;//置空
        this.currentPage = 1;//不然会出现搜不到数据的情况 
        this.sch_status = -1;
        this.sch_day = "";
        this.sch_key='';
        this.diaIsShowCollect = false;
        this.diaIsShowAttention= false;
        this.diaIsShowFans = false;
        this._GetUserList();
      
    },
    /**
    * 表格排序事件处理函数
         * @param {object} {column,prop,order} 列数据|排序字段|排序方式
         */
        onSortChange({ prop, order }) {
        
          console.log(prop)
          console.log(order)
           order = order=='ascending'?'asc':order=='descending'?'desc':""
            this.orderby = order?`${prop} ${order}`:''
            console.log(`${prop} ${order}`)
            this._GetUserList();
           // this.tableData.sort(this.compare(prop,order));
        },     
         /**
         * 排序比较
         * @param {string} propertyName 排序的属性名
         * @param {string} sort ascending(升序)/descending(降序)
         * @return {function}
         */
        compare (propertyName, sort) {
          debugger
            return function (obj1, obj2) {
                var value1 = obj1[propertyName]
                var value2 = obj2[propertyName]
                if (typeof value1 === 'string' && typeof value2 === 'string') {
                    const res = value1.localeCompare(value2, 'zh')
                    return sort === 'ascending' ? res : -res
                } else {
                    if (value1 <= value2) {
                        return sort === 'ascending' ? -1 : 1
                    } else if (value1 > value2) {
                        return sort === 'ascending' ? 1 : -1
                    }
                }
            }
        },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
        columnIndex === 1 ||
        columnIndex === 2 ||
        columnIndex === 3 ||
        columnIndex === 4 ||
        columnIndex === 5 ||
        columnIndex === 11 ||
        columnIndex === 18 ||
        columnIndex === 19 ||
        columnIndex === 20
      ) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.line {
  height: 1px;
  width: calc(100%+20px);
  background: #ebeef5;
  margin: 10px -10px;
}
.topTable {
  color: #333;
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
.el-table .ascending .ascending{
  border-top-color: #13b5b1 !important;
}
.el-table .descending .descending{
  border-top-color: #13b5b1 !important;
}
</style>
