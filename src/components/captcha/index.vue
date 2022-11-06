<template>
  <el-image :style="{width: width || '120' + 'px', height: height || '40' + 'px', cursor:'pointer'}" :src="img" @click="getCaptcha()"/>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import toolApi from "@/api/toolApi";

export default {
  name: "captcha",
  props: ["width", "height", "token"],
  emits: ["update:token"],
  components: {},
  setup(props, content) {
    let data = {
      img: ref(),
    }
    //监听
    watch(() => [props.token], ([newToken], [oldToken]) => {
      if (newToken) {
        content.emit('update:token', newToken)
      }
    })
    onMounted(async () => {
      methods.getCaptcha()
    })
    let methods = {
      getCaptcha() {
        toolApi.getCaptcha().then(res => {
          if (res.success) {
            data.img.value = res.data.base64Img;
            content.emit('update:token', res.data.token)
          }
        })
      },
    }

    return {
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>