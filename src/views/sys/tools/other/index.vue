<template>
  <el-card header="局部打印">
    <el-button v-print="print">点击打印</el-button>
    <div id="printBox">
      打印内容
    </div>
  </el-card>
  <el-card header="内容复制">
    <el-button @click="copy">点击复制</el-button>
    <div >
      {{ copyContent }}
    </div>
  </el-card>
  <el-card header="xml解析为对象">
    <el-input
        v-model="form.context"
        :rows="5"
        type="textarea"
        placeholder="请输入工作内容"
    />
    <el-button style="margin: .5rem 0" type="primary" @click="xmlBtnClick">解析</el-button>
    <el-input
        v-model="form.result"
        :rows="5"
        disabled
        type="textarea"
        placeholder=""
    />
  </el-card>

</template>

<script>
import {ref,unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router";

import useClipboard from "vue-clipboard3";
export default {
  name: "tools/other",
  props:["info"],
  emits:["update:info"],
  components:{

  },
  setup(props ,content){
    const router = useRouter()
    const {proxy} = getCurrentInstance();


    const { toClipboard } = useClipboard()
    let data = {
      form : ref({}),
      print: ref({
        id: 'printBox',//这里的id就是上面我们的打印区域id，实现指哪打哪
        popTitle: '配置页眉标题', // 打印配置页上方的标题
        extraHead: '', // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
        preview: false, // 是否启动预览模式，默认是false
        previewTitle: '预览的标题', // 打印预览的标题
        previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
        zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
        previewBeforeOpenCallback() {
          console.log('正在加载预览窗口！');
        }, // 预览窗口打开之前的callback
        previewOpenCallback() {
          console.log('已经加载完预览窗口，预览打开了！')
        }, // 预览窗口打开时的callback
        beforeOpenCallback() {
          console.log('开始打印之前！')
        }, // 开始打印之前的callback
        openCallback() {
          console.log('执行打印了！')
        }, // 调用打印时的callback
        closeCallback() {
          console.log('关闭了打印工具！')
        }, // 关闭打印的callback(无法区分确认or取消)
        clickMounted() {
          console.log('点击v-print绑定的按钮了！')
        },
      }),
      copyContent : ref("复制内容")
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
      async copy() {
        try {
          await toClipboard(data.copyContent.value)
          ElMessage.success("复制成功");
        } catch (e) {
          ElMessage.error("复制失败" + e);
        }

      },
      async xmlBtnClick() {
        let form = data.form.value;

        let str = ""
        if (form.context) {
          str = form.context
          let xml = proxy.$x2js.xml2js(form.context)
          str = JSON.stringify(xml)
        }
        data.form.value.result = str
      },
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