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
          <div v-else>{{ scope.row[item.prop] }} {{ item.type }}</div>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:20px">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handlePage"
        :total="CodeTable.count"
        hide-on-single-page
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import closeMask from "@/mixins/maskCloseImg";
export default {
  data() {
    return {

    };
  },
  mixins: [closeMask],
  props: {
    title: {    //标题
      type: String,
      default: "处理记录"
    },
    CodeTable: {      //总数据
      type: Array,
      default: function() {
        return [];
      }
    },
    diaIsShowTable: {  //是否显示
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
