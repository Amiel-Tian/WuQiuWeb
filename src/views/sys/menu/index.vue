<template>
  <page-title title="菜单管理"></page-title>
</template>

<script>
import {ref,unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";
import pageTitle from "@/components/pageTitle";
export default {
  name: "index",
  props:[],
  emits:[],
  components:{
    pageTitle
  },
  setup(props ,content){
    const router = useRouter()
    let data = {

    }
    //监听
    watch(() => [props.info], ([newInfo],[oldInfo]) => {
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
      router,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>