<template>
  <v-md-editor v-model="text" height="400px"
               :disabled-menus="[]"
               left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code uploadFile | save"
               :toolbar="toolbar"
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
  name: "tools/markdown",
  props:[],
  emits:[],
  components:{
  },
  setup(props ,content){
    const router = useRouter()
    const {proxy} = getCurrentInstance();
    let data = {
      text: ref('* Hello World!'),
      toolbar: {
        uploadFile : {
          title: '上传文件',
          icon: 'v-md-icon-link',
          menus: [
            {
              name: '添加文件连接',
              text: '添加文件连接',
              action(editor) {
                editor.insert(function (selected) {
                  const prefix = '[文件链接](';
                  const suffix = ')';
                  const placeholder = '请输入文本';
                  const content = selected || placeholder;

                  return {
                    text: `${prefix}${content}${suffix}`,
                    selected: content,
                  };
                });
              },
            },
            {
              name: '上传本地文件',
              text: '上传本地文件',
              action(editor) {
                console.log('你点击了菜单2');
              },
            },
          ],
        },
      },
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