<template>
  <page-title :title="router.currentRoute.value.meta.title"></page-title>
  <el-card>
    <div :class="fullScreenFlg ? 'box full-screen': ''">
      <el-row>
        <el-col :span="12">
          <el-button v-print="print">打印简历</el-button>
          <el-button @click="addClick()">添加模块</el-button>
        </el-col>
        <el-col :span="12">
          <el-row justify="end" align="middle" :gutter="1" style="margin-bottom: .5rem">
            <div style="margin-right: .5rem">
              <el-alert title="展示效果为A4" :closable="false" type="info"/>
            </div>
            <div>
              <el-alert title="建议全屏使用" :closable="false" type="info"/>
            </div>
            <div class="full-screen-btn" :style="{backgroundColor: fullScreenFlg ? '#e8e8e8': ''}"
                 @click="fullScreenFlg = !fullScreenFlg">
              <el-icon>
                <Rank/>
              </el-icon>
            </div>
          </el-row>
        </el-col>
      </el-row>
      <div style="padding:0 25rem; height: 93%;">
        <div id="printBox" >
          <info :info="form"></info>

          <div v-for="item in resumeContentGroup">
            <module-title :title="item.name" :icon="item.remarks"
                          v-if="resumeContent.filter(f => {return f.groupings && f.groupings == item.value})
                        && resumeContent.filter(f => {return f.groupings && f.groupings == item.value}).length > 0"></module-title>
            <div
                v-for="item_ in resumeContent.filter(f => {return f.groupings && f.groupings == item.value})"
            >
              <module-card
                  :info="item_"
                  :resumeId="resumeId"
                  @refresh="getData() "
              ></module-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>


  <el-dialog
      v-model="dialogVisible"
      title="新增模块内容"
      width="60%"
  >
    <div class="dialog-content">
      <el-form :model="formContent" ref="formRef" label-width="5rem">
        <el-row>
          <el-col :span="12">
            <el-form-item label="模块：">
              <el-select v-model="formContent.groupings" placeholder="Select" size="large" style="width: 100%;">
                <el-option
                    v-for="item in resumeContentGroup"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序：">
              <el-input-number v-model="formContent.sort" :min="1" style="width: 100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="时间：">
              <div style="display: flex;width: 100%;justify-content: space-between;">
                <el-date-picker
                    v-model="formContent.startDate"
                    type="date"
                    placeholder="开始时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                />
                <span style="text-align: center">-</span>
                <el-date-picker
                    v-model="formContent.endDate"
                    type="date"
                    placeholder="结束时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称：">
              <el-input v-model="formContent.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标记：">
              <el-input v-model="formContent.labels"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类别：">
              <el-input v-model="formContent.type"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容：">
              <el-input type="textarea" rows="10" v-model="formContent.content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="left" class="divider">
        样式预览
      </el-divider>
      <module-card-show :info="formContent"></module-card-show>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false;">返回</el-button>
        <el-button type="primary" @click="subment">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {ref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus'

import info from "@/views/modules/resume/info"
import moduleTitle from "@/views/modules/resume/common/moduleTitle";
import moduleCard from "@/views/modules/resume/common/moduleCard";
import resumeInfoApi from "@/api/modules/resume/resumeInfo";
import resumeContentApi from "@/api/modules/resume/resumeContent";
import {useRouter} from "vue-router";
import userApi from "@/api/sys/user";
import dictData from "@/api/sys/dictData";
import moduleCardShow from "@/views/modules/resume/common/moduleCardShow";

export default {
  name: "index",
  props: [],
  emits: [],
  components: {
    info,
    moduleTitle,
    moduleCard,
    moduleCardShow,
  },
  setup(props, content) {
    const router = useRouter()
    const {proxy} = getCurrentInstance();
    let data = {
      userInfo: ref({}),
      fullScreenFlg: ref(false),
      form: ref({
        // headPortrait : "http://60.205.4.143:9000/look-house-file/attachement/mmexport1534821587503.png"
      }),
      formContent: ref({}),
      dialogVisible: ref(false),
      resumeContentGroup: ref([]),
      resumeContent: ref([]),
      resumeId: ref(""),
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
      })
    }

    onMounted(async () => {
      methods.loadDictList()
      methods.getData()

    })
    let methods = {
      loadDictList() {
        let res = proxy.$tools.selectDict("jlmk")
        data.resumeContentGroup.value = res
      },
      async getUserInto() {
        await userApi.getUserInfo().then(res => {
          data.userInfo.value = res.data
        })
      },
      async getData() {
        await methods.getUserInto();
        let user = data.userInfo.value
        let p = {
          createBy: user.id,
        }
        resumeInfoApi.datas(p).then(res => {
          if (res.success) {
            if (res.data && res.data.length > 0) {
              data.form.value = res.data[0]
              data.resumeId.value = data.form.value.id
              if (data.form.value) {
                let param = {
                  resumeId: data.form.value.id
                }
                resumeContentApi.datas(param).then(res => {
                  data.resumeContent.value = res.data
                })
              }
            } else {
              data.form.value = {
                name: user.username,
                telephone: user.phone,
                mailbox: user.email,
                currentAddress: user.city,
              }
              resumeInfoApi.add(data.form.value).then(res => {
                if (res.success) {
                  methods.getData()
                }
              })
            }
          }
        })
      },
      addClick() {
        data.dialogVisible.value = true
        data.formContent.value = {
          id: undefined,
          resumeId: data.form.value.id,
          startDate: undefined,
          endDate: undefined,
          sort: undefined,
          groupings: undefined,
          title: undefined,
          labels: undefined,
          type: undefined,
          tags: undefined,
          content: undefined,
        }
      },
      subment() {
        data.dialogVisible.value = false

        let param = data.formContent.value
        resumeContentApi.add(param).then(res => {
          methods.getData()
          ElMessage({
            type: 'success',
            message: `success`,
          })
        })
      },
    }

    return {
      router,
      proxy,
      ...data,
      ...methods
    }
  }
}

</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  background-color: var(--white);
  overflow-y: auto;
}

.full-screen {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
}

.full-screen-btn {
  cursor: pointer;
  padding: .3rem;
  border-radius: 4px;
  //background-color: #e8e8e8;
  margin: 0 .5rem;
}

.full-screen-btn:hover {
  background-color: #f5f5f5;
}
</style>