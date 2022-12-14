<template>
  <div class="box">
    <el-divider content-position="left" class="divider">
      <el-row align="middle">
        <div class="text-center icon" v-if="icon" >
          <el-icon color="#fff">
            <component :is="icon"/>
          </el-icon>
        </div>
        <div class="title">
          {{ title }}
        </div>
      </el-row>
    </el-divider>
  </div>
</template>

<script>
import {ref, getCurrentInstance, watch, reactive, onMounted} from "vue";

export default {
  name: "moduleTitle",
  props: ["title", "icon"],
  emits: [],
  components: {},
  setup(props, content) {
    let data = {
      // title: ref("教育经历")
    }
    onMounted(async () => {

    })
    let methods = {}

    return {
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>
.box {

  .text-center {
    display: flex;
    align-items: center;
  }
  //padding: var(--padding) 0;

  ::v-deep .el-divider__text {
    font-size: 1.2rem;
  }

  .icon {
    padding: .5rem;
    background-color: #14191d;
    border-radius: .5rem;
    margin-right: 1rem;
  }

  .title {
    font-weight: bold;
  }
}
</style>