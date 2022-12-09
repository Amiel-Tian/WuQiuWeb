<template>
  <!--
  {{ proxy.$tools.selectDictLabel(proxy.$appConfig.STATUS,scope.row.status) }}
  v-permission="['sys:dict:update']"
  -->
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
        // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
        console.log(files);

        // 此处只做示例
        // insertImage({
        //   url:
        //       'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
        //   desc: '七龙珠',
        //   // width: 'auto',
        //   // height: 'auto',
        // });
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