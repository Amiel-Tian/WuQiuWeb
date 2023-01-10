<template>
  <el-card>

  </el-card>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router";
import useClipboard from "vue-clipboard3";

export default {
  name: "index",
  props: [],
  emits: [],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const {proxy} = getCurrentInstance();

    let data = {

    }
    //监听
    watch(() => [props.info], ([newInfo], [oldInfo]) => {
      // if (newInfo){
      //   Object.assign(data.form, newInfo)
      // content.emit('update:info',newInfo)
      // }
    })
    onMounted(async () => {

    })
    let methods = {

    }

    return {
      proxy,
      router,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>