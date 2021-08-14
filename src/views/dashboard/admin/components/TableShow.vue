<template>
  <div>
    <el-table
      :data="tableData"
      :header-cell-style="{ background: '#eaf6f6', color: '#13b5b1' }"
      border
      style="box-shadow:0 0 10px #e2e2e2"
    >
      <el-table-column
        prop="title"
        align="center"
        label="日期"
      ></el-table-column>
      <el-table-column
        prop="user"
        align="center"
        label="用户数"
      ></el-table-column>
      <el-table-column
        prop="product"
        align="center"
        label="产品数"
      ></el-table-column>
      <el-table-column
        prop="order"
        align="center"
        label="订单数"
      ></el-table-column>
      <el-table-column
        prop="income"
        align="center"
        label="交易金额"
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      required: true
    }
  }
};
</script>
<style lang="less" scoped></style>
