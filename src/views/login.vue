<template>
  <el-row justify="center" align="middle" style="height: 100%">
    <el-col :span="12">
      <el-row justify="center" align="middle" class="login-box">
        <el-col :span="12" class="left">
          <el-row>

          </el-row>
        </el-col>
        <el-col :span="12" class="right">

          <el-form class="form" label-width="120px">
            <el-row>
              <el-input :disabled = "btnLoad" @keyup.enter.native="onSubmit"
                        v-model="form.username" placeholder="请输入用户名" prefix-icon="User"/>
            </el-row>
            <el-row>
              <el-input :disabled = "btnLoad" @keyup.enter.native="onSubmit"
                        v-model="form.password" placeholder="请输入用户密码" show-password prefix-icon="Lock"/>
            </el-row>
            <el-row>
              <el-input :disabled = "btnLoad" @keyup.enter.native="onSubmit"
                        v-model="form.captcha" placeholder="请输入验证码" style="flex: 1" prefix-icon="Aim"/>
              <captcha ref="captcha" height="50" v-model:token="form.token" style="margin-left: 1rem"></captcha>
            </el-row>
            <el-row justify="center">
              <el-button :loading="btnLoad" @click="onSubmit" style="width: 100%;">登录</el-button>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter, useRoute} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus';

import userApi from "@/api/sys/user";
import tool from "@/utils/tool";

export default {
  name: "login",
  components: {
  },
  setup(props, content) {
    const router = useRouter()
    const captcha = ref(null)

    let data = {
      form: ref({}),
      btnLoad : ref(false)
    }
    //监听
    watch(() => [props.info], ([newInfo], [oldInfo]) => {
      // if (newInfo){
      //   Object.assign(data.form, newInfo)
      // }
    })

    onMounted(() => {
    })

    let methods = {
      onSubmit() {
        data.btnLoad.value = true
        let param = tool.changeJson(data.form.value)

        userApi.login(param).then(res => {
          if (res.success) {
            ElMessage.success(res.msg);
            router.push({
              path: '/',
            })
          } else {
            ElMessage.warning(res.msg);
            captcha.value.getCaptcha()
          }
        }).catch((e) => {
          ElMessage.error(e);
        }).finally(()=> {
          data.btnLoad.value = false
        })
      },
    }

    return {
      router,
      captcha,
      ...data,
      ...methods,
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  padding: 2rem 3rem;

  .el-row {
    margin: 1.5rem 0;
  }
  .el-button, .el-input{
    height: 50px;
  }
}
.login-box {
  height: 100%;
  border-radius: 1%;
  box-shadow: -4px 5px 10px rgb(0 0 0 / 40%);
  background-color: #8b9aac;

  .left{
    height: 100%;
  }
  .right{
    padding: 1rem 0;
    background-color: #f3f3f3;
  }
}


</style>