<template>
  <div>
    <div class="heardBox">
      <el-steps :active="flowActive" finish-status="success" align-center>
        <el-step v-for="list in flow" :key="list.value">
          <div slot="title">{{list.name}}</div>
        </el-step>
      </el-steps>
    </div>
    <!--流程-->
    <div class="mainBox">
      <div class="sellerMes">
        <div class="listBox">
          <div class="lineBox">
            <div class="line"></div>
            <span>卖家信息</span>
          </div>
          <ul class="sellerUl">
            <li>
              <span class="sellerKey">卖家ID</span>
              <span class="sellerVal">{{sellerData.supplierUserId}}</span>
            </li>
            <li>
              <span class="sellerKey">卖家昵称</span>
              <span>{{sellerData.sellerNickName}}</span>
            </li>
            <li>
              <span class="sellerKey">手机号码</span>
              <span>{{sellerData.sellerPhone}}</span>
            </li>
            <li>
              <span class="sellerKey">注册时间</span>
              <span>{{sellerData.sellerCreateDateTime}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="buyerMes">
        <div class="listBox">
          <div class="lineBox">
            <div class="line"></div>
            <span>买家信息</span>
          </div>
          <ul class="sellerUl">
            <li>
              <span class="sellerKey">买家ID</span>
              <span class="sellerVal">{{buyerData.userId}}</span>
            </li>
            <li>
              <span class="sellerKey">买家昵称</span>
              <span>{{buyerData.buyerNickName}}</span>
            </li>
            <li>
              <span class="sellerKey">手机号码</span>
              <span>{{buyerData.buyerPhone}}</span>
            </li>
            <li>
              <span class="sellerKey">注册时间</span>
              <span>{{buyerData.buyerCreateDateTime}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="afterMes">
        <div class="listBox">
          <div class="lineBox">
            <div class="line"></div>
            <span>售后信息</span>
          </div>
          <ul class="sellerUl">
            <li>
              <span class="sellerKey">售后ID</span>
              <span class="sellerVal">{{afterSale.id}}</span>
            </li>
            <li>
              <span class="sellerKey">售后编号</span>
              <span>{{afterSale.afterSaleSn}}</span>
            </li>
            <li>
              <span class="sellerKey">申请时间</span>
              <span>{{afterSale.createDateTime}}</span>
            </li>
            <li>
              <span class="sellerKey">货物状态</span>
              <span>{{afterSale.cargoStatusName}}</span>
            </li>
            <li>
              <span class="sellerKey">售后原因</span>
              <span>{{afterSale.afterSaleReasonsName}}</span>
            </li>
            <li>
              <span class="sellerKey">售后要求</span>
              <span>{{afterSale.afterSaleRequirementsName}}</span>
            </li>
            <li>
              <span class="sellerKey">退款金额</span>
              <span>{{afterSale.afterSaleFreight}}</span>
            </li>
            <li>
              <span class="sellerKey">退运费</span>
              <span>{{afterSale.afterSaleAmount}}</span>
            </li>
            <li>
              <span class="sellerKey">售后状态</span>
              <span class="textBox">{{afterSale.status | status }}</span>
              <!---->
              <span class="lockBtn orange" @click="changeLock" :data-id="afterSale.id" v-show="afterSale.status==6">完成退款</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="historyMes" style="border:none;">
        <div class="listBox">
          <div class="lineBox">
            <div class="line"></div>
            <span>协商历史</span>
          </div>
          <div class="block">
            <el-timeline>
              <el-timeline-item :timestamp="item.createDateTime" placement="top" v-for="item in negotiationHistory">
                <el-card>
                  <h4>{{item.nickName}}</h4>
                  <p>{{item.content}}</p>
                  <ul v-show="item.historyAttachmentList.length>0">
                    <li v-for="(list,index) in item.historyAttachmentList" class="historyImg">
                      <el-image style="width: 80px; height: 80px" :src="list.path" fit="contain" :preview-src-list="getSrcList(index,item.historyAttachmentList)">
                      </el-image>
                      
                    </li>
                  </ul>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </div>
    </div>
    <!--买卖物流信息-->
    <div class="tableBox">
      <el-table :data="listTotal" max-height="700" border v-loading="loading" element-loading-text="拼命加载中" :header-cell-style="rowClass">
        <el-table-column prop="shoppingId" label="产品清单ID" align="center">
        </el-table-column>
        <el-table-column prop="mainProductImg" label="产品图片" align="center">
          <template slot-scope="scope">
            <el-image style="width: 80px; height: 80px" :src="scope.row.mainProductImg" fit="contain" :preview-src-list="[scope.row.mainProductImg]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="productKey" label="产品介绍" align="center">
        </el-table-column>

        <el-table-column prop="productId" label="产品ID" align="center">
        </el-table-column>
        <el-table-column prop="price" label="产品价格" align="center">

        </el-table-column>
        <el-table-column prop="quantity" label="产品数量" align="center">
        </el-table-column>

        <el-table-column prop="buyerRemark" label="备注信息" width="120" align="center">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { GetAfterSaleDetails,CompleteRefund } from "@/api/afterSale";
import Code from "@/api/statusCode";
import LinkA from "@/components/LinkA/index";
export default {
  name: "AfterDetails",
  data: function() {
    return {
      jsonData: "", //总数据
      listTotal: [], //表格列表数据
      afterId: "", //售后ID
      flow: "", //进度条
      sellerData: "", //卖家信息
      buyerData: "", //买家信息
      afterSale: "", //售后信息
      negotiationHistory: "", //协商历史
      loading: true,
      flowActive: 0, //这个是进度条的当前进度
      pageSize: 10,
      pageNo: 1,
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log(to);
      vm.afterId = to.query.id;
    });
  },
  components: {
    LinkA,
  },
  mounted() {
    this._GetAfterDetails();
  },
  filters: {
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
          return "资金退回中";
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
  methods: {
    _GetAfterDetails() {
      let that = this;
      let data = {
        afterSaleId: this.afterId,
      };
      GetAfterSaleDetails(data).then(response => {
        that.loading = false;
        if (response.status === Code.SUCCESS_CODE) {
          that.jsonData = response.data;
          that.flow = response.data.flow;
          that.sellerData = response.data.seller;
          that.buyerData = response.data.buyer;
          that.afterSale = response.data.afterSale;
          that.negotiationHistory = response.data.negotiationHistory;
          that.listTotal = response.data.shoppingList;
          if (response.data.flow.length > 0) {
            for (var i = 0; i < response.data.flow.length; i++) {
              if (!response.data.flow[i].executed) {
                that.flowActive = i;
                break;
              } else if (i == response.data.flow.length - 1) {
                that.flowActive = i + 1;
              }
            }
          }
        } else {
          this.$message({
            type: "error",
            message: response.message,
          });
        }
      });
    },
    getSrcList(index, urls) {
      if (urls.length > 0) {
        var arr = [];
        for (var i = 0; i < urls.length; i++) {
          arr.push(urls[i].path);
        }
        return arr.slice(index).concat(arr.slice(0, index));
        //return arr
      }
    },

    changeLock(e) {
      //完成退款
      let that = this;
      let id = e.currentTarget.dataset.id;
      let data = {
        afterSaleId: id,
      };
      CompleteRefund(data).then(response => {
        if (response.status === Code.SUCCESS_CODE) {
          that.$message("操作成功");
          that.afterSale.Status = 7;
        } else {
          that.$message(response.data.returntext);
          console.log(error);
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
.heardBox {
  margin: 50px 0;
}

.sellerMes,
.buyerMes,
.afterMes,
.historyMes {
  width: 24.5%;
  border-right: 1px solid #eee;
  float: left;
  height: 400px;
  padding: 30px 0;
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
  background: #fff;
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
  height: 350px;
  overflow-y: auto;
}

.tableBox {
  margin-top: 30px;
}

.historyImg {
  display: inline-block;
  width: 60px;
  height: 60px;
  overflow: hidden;
  margin-right: 5px;
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
  background: #e8541e;
}

.textBox {
  margin-right: 30px;
}
</style>

