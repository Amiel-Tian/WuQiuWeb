<template>
  <div class="box" @mouseenter="mouseenterEev" @mouseleave="mouseleaveEnv">
    <module-card-show :info="info"></module-card-show>
    <div class="menu" v-show="mouseFlag">
      <el-button circle @click="editClick">
        <el-icon>
          <EditPen/>
        </el-icon>
      </el-button>
      <el-button circle @click="plusClick">
        <el-icon>
          <Plus/>
        </el-icon>
      </el-button>
      <el-button circle @click="deleteClick">
        <el-icon>
          <Delete/>
        </el-icon>
      </el-button>
    </div>

    <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="60%"
    >
      <div class="dialog-content">
        <el-form :model="form" ref="formRef" label-width="5rem">
          <el-row>
            <el-col :span="12">
              <el-form-item label="模块：">
                <el-select v-model="form.groupings" placeholder="请选择模块" size="large" style="width: 100%;">
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
                <el-input-number v-model="form.sort" :min="1" style="width: 100%;"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="时间：">
                <div style="display: flex;width: 100%;justify-content: space-between;">
                  <el-date-picker
                      v-model="form.startDate"
                      type="date"
                      placeholder="开始时间"
                      value-format="YYYY-MM-DD HH:mm:ss"
                  />
                  <span style="text-align: center">-</span>
                  <el-date-picker
                      v-model="form.endDate"
                      type="date"
                      placeholder="结束时间"
                      value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="名称：">
                <el-input v-model="form.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="标记：">
                <el-input v-model="form.labels"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类别：">
                <el-input v-model="form.type"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="内容：">
                <el-input type="textarea" rows="10" v-model="form.content" @input="contentInput"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-divider content-position="left" class="divider">
          样式预览
        </el-divider>
        <module-card-show :info="form"></module-card-show>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false;">返回</el-button>
        <el-button type="primary" @click="subment">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {ref,unref , getCurrentInstance, watch, reactive, onMounted} from "vue";
import moduleCardShow from "@/views/modules/resume/common/moduleCardShow";
import {ElMessage, ElMessageBox} from "element-plus";
import resumeInfoApi from "@/api/modules/resume/resumeInfo";
import resumeContentApi from "@/api/modules/resume/resumeContent";

export default {
  name: "card",
  props: ["info","resumeId"],
  emits: [],
  components: {
    moduleCardShow,
  },
  setup(props, content) {

    const {proxy} = getCurrentInstance();
    let data = {
      mouseFlag: ref(false),
      dialogVisible: ref(false),
      resumeContentGroup: ref([]),
      form: ref({
        textarea: ""
      }),
    }
    //监听
    watch(() => [props.info], ([newContent], [oldContent]) => {
      if (newContent) {
      }
    })
    onMounted(async () => {
    })
    let methods = {
      loadDictList() {
        let res = proxy.$tools.selectDict("jlmk")
        data.resumeContentGroup.value = res
      },
      mouseenterEev() {
        data.mouseFlag.value = true
      },
      mouseleaveEnv() {
        data.mouseFlag.value = false
      },
      editClick() {
        methods.loadDictList();
        data.dialogVisible.value = true
        let param = {}
        Object.assign(param, props.info)
        data.form.value = param
      },
      plusClick() {
        methods.loadDictList();
        data.dialogVisible.value = true
        let param = {
          id: undefined,
          resumeId: props.resumeId,
          startDate: undefined,
          endDate: undefined,
          sort: undefined,
          groupings: props.info.groupings,
          title: undefined,
          labels: undefined,
          type: undefined,
          tags: undefined,
          content: undefined,
        }
        data.form.value = param
      },
      deleteClick() {
        ElMessageBox.confirm(
            '确认删除?',
            'Warning',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
            }
        )
            .then(() => {
              resumeContentApi.delete(props.info).then(res =>{
                content.emit('refresh');
                ElMessage({
                  type: 'success',
                  message: `success`,
                })
              })
              // ElMessage({
              //   type: 'info',
              //   message: '权限取消',
              // })
            })
            .catch(() => {
              ElMessage({
                type: 'info',
                message: 'Delete canceled',
              })
            })
      },
      handleClose() {
      },
      contentInput(){
        // data.form.content = data.form.content.replace(/\n/g, '<br />')
      },
      subment() {
        data.dialogVisible.value = false

        let param = data.form.value
        if (param.id){
          resumeContentApi.update(param).then(res =>{
            content.emit('refresh');
            ElMessage({
              type: 'success',
              message: `success`,
            })
          })
        }else{
          resumeContentApi.add(param).then(res =>{

            content.emit('refresh');
            ElMessage({
              type: 'success',
              message: `success`,
            })
          })
        }
      },
    }

    return {
      proxy,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  line-height: 1.4rem;
  border: 1px var(--white) solid;

  .menu {
    position: absolute;
    right: 50%;
    top: .5rem;
    padding: 0 .5rem;
    background-color: var(--white);
  }
}

.box:hover {
  border: 1px #65696c dashed;
}
.dialog-content{

}
</style>