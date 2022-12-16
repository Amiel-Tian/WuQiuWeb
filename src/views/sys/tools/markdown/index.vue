<template>
  <page-title :title="router.currentRoute.value.meta.title"></page-title>
  <v-md-editor v-model="text" height="400px"
               :disabled-menus="[]"
               @upload-image="handleUploadImage"
  ></v-md-editor>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>展示效果</span>
      </div>
    </template>
    <v-md-preview :text="text"></v-md-preview>
  </el-card>
</template>

<script>
import {ref,unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router";

import fileApi from "@/api/sys/file";

export default {
  name: "index",
  props:[],
  emits:[],
  components:{
  },
  setup(props ,content){
    const router = useRouter()
    const {proxy} = getCurrentInstance();
    let data = {
      text: ref('* Hello World!')
    }
    //监听
    watch(() => [props.info], ([newInfo],[oldInfo]) => {

    })
    onMounted(async () => {

    })
    let methods = {
      handleUploadImage(event, insertImage, files) {
        if (!files){
          return
        }
        let param = {
          file : files[0]
        }
        fileApi.uploadAttachment(param).then(res => {
          if (res.success){
            let data = res.data
            insertImage({
              url:data.link,
              desc: data.originalFilename,
              width: '250',
              height: 'auto',
            });
          }
        })
      }
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