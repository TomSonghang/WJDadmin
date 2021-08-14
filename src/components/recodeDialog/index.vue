<template>
  <el-dialog
    :title="title"
    @close="close"
    :visible="diaIsShowTable"
    destroy-on-close
    class="diaTable"
    close-on-click-modal
  >
    <el-table
      :data="CodeTable"
      border
      :header-cell-style="{ background: '#eaf6f6', color: '#13b5b1' }"
    >
      <el-table-column
        :prop="item.prop"
        align="center"
        :label="item.name"
        v-for="item in arrayData"
        :key="item.prop"
      >
        <template slot-scope="scope">
          <el-image
            @click.stop="handleClickItem"
            :src="scope.row[item.prop]"
            v-if="item.type == 'img'"
            style="width:100px;height:100px"
            :preview-src-list="[`${scope.row[item.prop]}`]"
          ></el-image>
          <div v-else-if="item.type=='link'">
             <link-a url='/userinfo/index' :userId='scope.row[item.prop]' :val='scope.row[item.prop]' v-on="$listeners" :selfPage="(item.type=='link'&&item.self)?true:false"/>
          </div>
          <div v-else>{{ scope.row[item.prop] }} {{ item.type }}</div>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:20px">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handlePage"
        :total="totalCode"
        :page-size="5"
        hide-on-single-page
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import closeMask from "@/mixins/maskCloseImg";
import LinkA from '../LinkA/index'
export default {
  data() {
    return {
    };
  },
  components:{LinkA},
  mixins: [closeMask],
  props: {
    title: {
      type: String,
      default: "处理记录"
    },
    CodeTable: {
      type: Array,
      default: function() {
        return [];
      }
    },
    totalCode: {      //总数量
      type: Number,
      default: 10
    },
    diaIsShowTable: {
      type: Boolean,
      default: false
    },
    arrayData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  methods: {
    handlePage(e) {
      this.$emit("changePage", e);
    },
    close() {
      //关闭弹窗
      this.$emit("close", false);
    }
  }
};
</script>
