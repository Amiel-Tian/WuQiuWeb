<template>
  <page-title :title="router.currentRoute.value.meta.title"></page-title>
  <el-card>
    <el-form ref="formRef" :rules="rules" :model="userInfo" label-width="120px" :disabled="loading">
      <el-row justify="space-between">
        <el-col :span="12">
          <el-row>
            <el-col>
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username" placeholder="请输入用户名" clearable/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="登录名" prop="loginname">
                <el-input v-model="userInfo.loginname" placeholder="请输入登录名" clearable/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="密码">
                <el-input v-model="userInfo.password" placeholder="输入密码" show-password clearable/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="电话">
                <el-input v-model="userInfo.phone" placeholder="请输入电话" clearable/>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" placeholder="请输入邮箱" clearable>
                  <template #append>.com</template>
                </el-input>
              </el-form-item>
            </el-col>

          </el-row>
        </el-col>
        <el-col :span="11">
          <el-col>
            <el-form-item label="头像">
              <el-avatar icon="UserFilled" :size="200" :src="userInfo.avatar"/>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-button type="primary" icon="Check" @click="subment()">提交修改</el-button>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router";
import userApi from "@/api/sys/user";

export default {
  name: "index",
  props: ["info"],
  emits: ["update:info"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const formRef = ref()
    const {proxy} = getCurrentInstance();
    let data = {
      userInfo: ref({
        username: "--"
      }),
      loading: ref(false),
      form: ref({}),
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
            message: '请输入用户名密码',
            trigger: 'change',
          },
        ],
      },
    }
    //监听
    watch(() => [props.info], ([newInfo], [oldInfo]) => {
      // if (newInfo){
      //   Object.assign(data.form, newInfo)
      // content.emit('update:info',newInfo)
      // }
    })
    onMounted(async () => {
      methods.getUserInfo();
    })
    let methods = {
      getUserInfo() {
        userApi.getUserInfo().then(res => {
          data.userInfo.value = res.data
          data.userInfo.value.password = undefined
        })
      },
      subment() {
        if (!formRef) {
          return
        }
        formRef.value.validate((valid, fields) => {
          if (valid) {
            ElMessageBox.prompt('请输入当前登录密码', '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  inputType: "password",
                  type: 'info',
                  // inputPattern:/s/,
                  // inputErrorMessage: '不能为空',
                }
            ).then(({value}) => {
              let param = data.userInfo.value
              param.passwordVer = value

              userApi.updateInfo(param).then(res => {
                if (res.success) {
                  ElMessage.success(res.msg)
                  this.getUserInfo()
                  if (param.password) {
                    userApi.logout()
                  }
                } else {
                  ElMessage.warning(res.msg)
                }
              })

            }).catch(() => {
              ElMessage.info("取消修改")
            })
          } else {
            ElMessage.warning("必填项未填写！")
          }
        })
      }
    }

    return {
      proxy,
      formRef,
      router,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>