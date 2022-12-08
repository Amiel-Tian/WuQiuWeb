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
          <el-form-item label="角色名" prop="name">
            <el-input v-model="form.name" placeholder="请输入角色名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="form.code" placeholder="角色编码" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio v-for="item in statusList" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色授权" prop="menuIdList">
            <el-cascader
                style="width: 100%;"
                v-model="form.menuIdList"
                :options="treeList"
                :props="cascaderProps"
                clearable
                collapse-tags
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-row justify="end">
            <el-button :loading="btnLoad" @click="subment">保存</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from 'element-plus';

import roleApi from "@/api/sys/role"
import menuApi from "@/api/sys/menu"

export default {
  name: "index",
  props: ["id", "drawer"],
  emits: ["update:drawer", "success"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const formRef = ref()
    const {proxy} = getCurrentInstance();
    let data = {
      iocnDrawer: ref(false),
      treeList: ref([]),
      form: ref({}),
      btnLoad: ref(false),
      statusList: ref([]),
      cascaderProps: {
        children: "children",
        label: "name",
        value: "id",
        checkStrictly: true,
        emitPath: false,
        multiple: true,
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名',
            trigger: 'change',
          },
        ],
        code: [
          {
            required: true,
            message: '请输入角色编码',
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
        menuIdList: [
          {
            required: true,
            message: '请选择菜单',
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
          roleApi.get(props.id).then(res => {
            data.form.value = res.data || {}
            data.form.value.status = data.form.value.status + ""
          })
        } else {
          data.form.value = {}
          data.form.value.status = "1"
        }
        methods.getNav();
        methods.loadDictList();
      }
    })
    onMounted(async () => {

    })
    let methods = {
      getNav() {
        menuApi.getNavAll().then(res => {
          data.treeList.value = res.data.nav
        })
      },
      loadDictList() {
        let res = proxy.$tools.selectDict(proxy.$appConfig.STATUS)
        data.statusList.value = res
      },
      subment() {
        if (!formRef){
          return
        }
        formRef.value.validate((valid, fields) => {
          if (valid) {
            data.btnLoad.value = true
            if (data.form.value.id) {
              roleApi.update(data.form.value).then(res => {
                if (res.success) {
                  ElMessage.success(res.msg)
                } else {
                  ElMessage.error(res.msg)
                }

                content.emit("success", {});
                data.form.value = {}
                data.btnLoad.value = false
              })
            } else {
              roleApi.add(data.form.value).then(res => {
                if (res.success) {
                  ElMessage.success(res.msg)
                } else {
                  ElMessage.error(res.msg)
                }

                content.emit("success", {});
                data.form.value = {}
                data.btnLoad.value = false
              })
            }
          } else {
            ElMessage.warning("必填项未填写！")
          }
        })
      },
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