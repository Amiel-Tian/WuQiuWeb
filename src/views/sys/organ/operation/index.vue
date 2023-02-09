<template>
  <el-drawer
      size="50%"
      v-model="drawer"
      :show-close="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">{{ form ? form.id ? form.username || '编辑' : '新增' : '新增' }}</h4>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left">
          <CircleCloseFilled/>
        </el-icon>
        关闭
      </el-button>
    </template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" :disabled="btnLoad">
      <el-row justify="start" style="margin: .5rem">
        <el-col :span="24">
          <el-form-item label="上级组织">
            <el-cascader
                style="width: 100%;"
                v-model="form.parentId"
                :options="treeData"
                :props="cascaderProps"
                clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="组织名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入组织名称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入组织编码" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="图标">
            <el-button @click="iocnDrawer = true">选择</el-button>
            <el-icon style="font-size: 2rem; margin-left: 1rem">
              <component v-if="form.icon" :is="form.icon"/>
            </el-icon>
            <el-drawer
                :title="'选择图标'"
                v-model="iocnDrawer"
                :show-close="true"
            >
              <div>
                <icon-show v-model:icon="form.icon" @success="iocnDrawer = false"></icon-show>
              </div>
            </el-drawer>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" :min="1" :max="1000" placeholder="数字"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="item in statusList" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-row justify="end">
            <el-button @click="subment" :loading="btnLoad">保存</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";

import organApi from "@/api/sys/organ"
import {ElMessage} from "element-plus";

export default {
  name: "index",
  props: ["id", "drawer", "parentId"],
  emits: ["update:drawer", "success"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const formRef = ref()
    const {proxy} = getCurrentInstance();
    let data = {
      form: ref({}),
      treeData: ref([]),
      btnLoad: ref(false),
      statusList: ref([]),
      cascaderProps: {
        children: "children",
        label: "name",
        value: "id",
        checkStrictly: true,
        emitPath: false,
      },
      iocnDrawer: ref(false),
      rules: {
        name: [
          {
            required: true,
            message: '请输入组织名',
            trigger: 'change',
          },
        ],
        code: [
          {
            required: true,
            message: '请输入组织编码',
            trigger: 'change',
          },
        ],
        status: [
          {
            required: true,
            message: '请选择状态',
            trigger: 'change',
          },
        ],
      },
    }
    //监听
    watch(() => [props.drawer], ([drawer]) => {
      content.emit('update:drawer', drawer)
      if (drawer) {
        if (props.id) {
          organApi.get(props.id).then(res => {
            data.form.value = res.data || {}
            data.form.value.status = data.form.value.status + ""
            data.form.value.type = data.form.value.type + ""
          })
        } else {
          data.form.value = {}
          data.form.value.status = "1"
        }
        if (props.parentId) {
          data.form.value.parentId = props.parentId || ""
        }

        methods.getTree()
        methods.loadDictList();
      }
    })
    onMounted(async () => {

    })
    let methods = {
      getTree() {
        organApi.getTreeAll().then(res => {
          data.treeData.value = res.data.nav
        })
      },
      loadDictList() {
        let res = proxy.$tools.selectDict(proxy.$appConfig.STATUS)
        data.statusList.value = res
      },

      subment() {
        if (!formRef) {
          return
        }
        formRef.value.validate((valid, fields) => {
          if (valid) {
            data.btnLoad.value = true
            let param = data.form.value
            if (!param.parentId) {
              param.parentId = "0"
            }
            if (param.id) {
              organApi.update(param).then(res => {
                if (res.success) {
                  ElMessage.success(res.msg)
                } else {
                  ElMessage.error(res.msg)
                }
                content.emit("success", {});
                data.form.value = {}
                data.btnLoad.value = false;
                organApi.getTreeAll().then(resnav => {
                  sessionStorage.setItem('permission', resnav.data.authoritys)
                })
              })
            } else {
              organApi.add(param).then(res => {
                if (res.success) {
                  ElMessage.success(res.msg)
                } else {
                  ElMessage.error(res.msg)
                }
                content.emit("success", {});

                data.btnLoad.value = false;

                organApi.getTreeAll().then(resnav => {
                  sessionStorage.setItem('permission', resnav.data.authoritys)
                })
              })
            }
            data.form.value = {}
            content.emit("success", {});
          } else {
            ElMessage.warning("必填项未填写！")
          }
        })
      }
    }

    return {
      router,
      formRef,
      proxy,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>