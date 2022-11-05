<template>
  <el-card class="box-card">
    <operation></operation>
  </el-card>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";
import userApi from "@/api/sys/user";
import {ElMessage} from "element-plus";

import operation from "@/views/model/renwushu/operation"

export default {
  name: "index",
  props: [],
  emits: [],
  components: {
    operation
  },
  setup(props, content) {
    const router = useRouter()
    let data = {
      userInfo: reactive({}),
      form: reactive({}),
    }
    //监听
    watch(data.form, () => {

    })
    onMounted(async () => {
      methods.getUserInto();
    })
    let methods = {
      getUserInto() {
        userApi.getUserInfo().then(res => {
          Object.assign(data.userInfo, res)
        })
      },

    }

    return {
      router,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>
</style>