<template>
  <el-drawer
      size="50%"
      v-model="drawer"
      :show-close="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">{{ form ? form.username || '新增' : '新增' }}</h4>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left">
          <CircleCloseFilled/>
        </el-icon>
        关闭
      </el-button>
    </template>
    <el-form :model="form" label-width="120px" :disabled = "btnLoad">
      <el-row justify="start" style="margin: .5rem">
        <el-col :span="24">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请选择用户名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="登录名">
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
          <el-form-item label="状态">
            <el-radio-group v-model="form.statu">
              <el-radio label="1" >正常</el-radio>
              <el-radio label="0" >停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="权限">
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
import {ElMessage, ElMessageBox} from 'element-plus';

import userApi from "@/api/sys/user"
import roleApi from "@/api/sys/role"

export default {
  name: "index",
  props: ["id","drawer"],
  emits: [ "update:drawer", "success"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    let data = {
      iocnDrawer: ref(false),
      treeList: ref([]),
      form: ref({}),
      btnLoad : ref(false),
    }
    //监听
    watch(() => [props.drawer], ([drawer]) => {
      content.emit('update:drawer', drawer)
      if (drawer) {
        if (props.id) {
          userApi.get(props.id).then(res => {
            data.form.value = res.data || {}
            data.form.value.statu =  data.form.value.statu + ""
            data.form.value.password = undefined
          })
        }else{
          data.form.value.statu = "1"
        }
        methods.getRole();
      }
    })
    onMounted(async () => {

    })
    let methods = {
      getRole(){
        roleApi.datas().then(res => {
          data.treeList.value = res.data
        })
      },
      subment(){
        data.btnLoad.value = true
        if (data.form.value.id){
          userApi.update(data.form.value).then(res => {
            if (res.success){
              ElMessage.success(res.msg)
            }else {
              ElMessage.error(res.msg)
            }
            content.emit("success", {});

            data.btnLoad.value = false;
          })
        }else {
          userApi.add(data.form.value).then(res => {
            if (res.success){
              ElMessage.success(res.msg)
            }else {
              ElMessage.error(res.msg)
            }
            content.emit("success", {});

            data.btnLoad.value = false;
          })
        }
      },
    }

    return {
      router,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>