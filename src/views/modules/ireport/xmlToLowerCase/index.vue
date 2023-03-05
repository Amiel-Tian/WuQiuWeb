<template>
  <!--
  {{ proxy.$tools.selectDictLabel(proxy.$appConfig.STATUS,scope.row.status) }}
  v-permission="['sys:dict:update']"
  -->
  <el-card>
    <el-input
        v-model="form.context"
        :rows="15"
        type="textarea"
        placeholder="请输入工作内容"
    />
    <div style="margin: .5rem 0;">
      <el-button type="primary" :loading="btnLoad" @click="changeForm">转换</el-button>
      <el-button :loading="btnLoad" @click="copy">复制</el-button>
      <el-button :loading="btnLoad" @click="form.context = '';form.result = '';">清空</el-button>
    </div>
    <el-input
        v-model="form.result"
        :rows="15"
        disabled
        type="textarea"
        placeholder=""
    />
  </el-card>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router";
import useClipboard from "vue-clipboard3";

export default {
  name: "ireport/xmlToLowerCase",
  props: ["info"],
  emits: ["update:info"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const {proxy} = getCurrentInstance();

    const {toClipboard} = useClipboard()
    let data = {
      form: ref({}),
      btnLoad: false,
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
      async changeForm() {
        let form = data.form.value;

        let str = ""
        if (form.context) {
          str = form.context
          let xml = proxy.$x2js.xml2js(form.context)

          if (xml && xml.jasperReport && xml.jasperReport.parameter) {
            let list = xml.jasperReport.parameter

            let names = []
            await list.forEach(item => {
              names.push(item._name)
            })
            await names.forEach(item => {
              let x = item.toLowerCase()
              str = str.replaceAll(item, x)
            })
          }
        }
        data.form.value.result = str
      },
      async copy() {
        try {
          await toClipboard(data.form.value.result)
          ElMessage.success("复制成功");
        } catch (e) {
          ElMessage.error("复制失败" + e);
        }

      }
    }

    return {
      proxy,
      router,
      toClipboard,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>