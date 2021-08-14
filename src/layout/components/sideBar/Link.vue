<template>
  <div v-bind="returnTag(to)">
    <slot />
  </div>
</template>

<script>
import { isAbsolutePath } from "@/utils/validate";
export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    returnTag(path) {
      if (isAbsolutePath(path)) {
        //是否是网络绝对路径,如是就直接跳转
        return {
          is: "a",
          target: "_blank",
          href: path
        };
      } else {
        return {
          is: "router-link",
          to: path
        };
      }
    }
  }
};
</script>
