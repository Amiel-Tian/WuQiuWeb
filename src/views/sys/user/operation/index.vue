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
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules" :disabled="btnLoad">
      <el-row justify="start" style="margin: .5rem">
        <el-col :span="24">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请选择用户名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="登录名" prop="loginname">
            <el-input v-model="form.loginname" placeholder="请输入登录名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="密码">
            <el-input v-model="form.password" placeholder="输入密码" show-password clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号">
            <el-input v-model="form.phone" placeholder="输入手机号" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱">
            <el-input v-model="form.phone" placeholder="输入邮箱" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限" prop="roleIdList">
            <el-select v-model="form.roleIdList" multiple placeholder="请选择权限" style="width: 100%;" clearable>
              <el-option
                  v-for="item in treeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组织" prop="organIdList">
            <el-cascader
                style="width: 100%;"
                v-model="form.organIdList"
                :options="treeListOrgan"
                :props="cascaderProps"
                clearable
                collapse-tags
            />
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
            <el-button @click="subment()" :loading="btnLoad">保存</el-button>
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

import userApi from "@/api/sys/user"
import roleApi from "@/api/sys/role"
import organApi from "@/api/sys/organ";

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
      treeListOrgan: ref([]),
      form: ref({}),
      btnLoad: ref(false),
      statusList: ref([]),
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'change',
          },
        ],
        loginname: [
          {
            required: true,
            message: '请输入登录名',
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
        roleIdList: [
          {
            required: true,
            message: '请选择权限',
            trigger: 'change',
          },
        ],
      },
      cascaderProps: {
        children: "children",
        label: "name",
        value: "id",
        checkStrictly: true,
        emitPath: false,
        multiple: true,
      },
    }
    //监听
    watch(() => [props.drawer], ([drawer]) => {
      content.emit('update:drawer', drawer)
      if (drawer) {
        if (props.id) {
          userApi.get(props.id).then(res => {
            data.form.value = res.data || {}
            data.form.value.status = data.form.value.status + ""
            data.form.value.password = undefined
          })
        } else {
          data.form.value = {}
          data.form.value.status = "1"
        }
        methods.loadDictList();
      }
    })
    onMounted(async () => {

    })
    let methods = {
      loadDictList() {
        let res = proxy.$tools.selectDict(proxy.$appConfig.STATUS)
        data.statusList.value = res
        roleApi.datas().then(res => {
          data.treeList.value = res.data
        })
        organApi.getTreeAll().then(res => {
          data.treeListOrgan.value = res.data.nav
        })
      },
      subment() {
        formRef.value.validate((valid, fields) => {
          if (valid) {
            data.btnLoad.value = true
            if (data.form.value.id) {
              userApi.update(data.form.value).then(res => {
                if (res.success) {
                  ElMessage.success(res.msg)
                } else {
                  ElMessage.error(res.msg)
                }
                content.emit("success", {});
                data.form.value = {}
                data.btnLoad.value = false;
              })
            } else {
              userApi.add(data.form.value).then(res => {
                if (res.success) {
                  ElMessage.success(res.msg)
                } else {
                  ElMessage.error(res.msg)
                }
                content.emit("success", {});
                data.form.value = {}
                data.btnLoad.value = false;
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