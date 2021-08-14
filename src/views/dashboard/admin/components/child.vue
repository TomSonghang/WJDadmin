<template>
  <!-- 动态表单的内部实现  -->
  <section>
    <el-form :disabled='disabled' :inline="inline">
      <template v-for="item in fieldMap">
        <el-form-item :prop="item.name" :label="item.label" :key="item.name">
          <!-- 文本框 -->
          <template v-if="item.type ==='text'">
            <el-input v-model="formData[item.name]" type="text" :placeholder="item.placeholder" />
          </template>
          <!-- 下拉选择框 -->
          <template v-else-if="item.type==='select'">
            <el-select v-model="formData[item.name]" :placeholder="item.placeholder">
              <template v-for="optionItem in item.options.list">
                <el-option :label="optionItem.label" :value="optionItem.value" :key="optionItem.value" />
              </template>
            </el-select>
          </template>
        </el-form-item>
      </template>
    </el-form>
    <p>{{num}}</p>
    <button type="button" @click="btn">按钮</button>
  </section>
</template>

<script>
export default {
  name: "dynamicForm",
  props: {
    fieldMap: {
      type: Object,
      default: () => {
        return {};
      },
    },
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      num: 0,
      keys: [12, 5, 8, 7, 25, 65, 12, 14],
    };
  },
  methods: {
    abc(a) {
      return a > 50;
    },
    btn() {
      //console.log(this.keys.findIndex(this.abc))
      this.keys.map((item, index) => {
     
        if (this.abc(item)) {
          this.num = index;
        }
      });
    },
  },
};
</script>
