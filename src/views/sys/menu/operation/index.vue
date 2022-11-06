<template>

</template>

<script>
import {ref,unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";

export default {
  name: "index",
  props:["info"],
  emits:["update:info"],
  components:{

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