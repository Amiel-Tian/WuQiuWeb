<template>
  <div class="box">
    <el-row justify="center" align="middle" style="height: 100%">
        <el-form class="form" label-width="120px">
          <el-row>
            <el-form-item label="用户名：" style="width: 100%;">
              <el-input v-model="form.username" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="密码：" style="width: 100%;">
              <el-input v-model="form.password" show-password/>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="验证码：">
              <el-input v-model="form.captcha" style="flex: 1"/>
              <captcha ref="captcha" v-model:token="form.token" style="margin-left: 1rem"></captcha>
            </el-form-item>
          </el-row>
          <el-row justify="center">
              <el-button type="primary" @click="onSubmit" style="width: 60%;">登录</el-button>
          </el-row>
        </el-form>
    </el-row>
  </div>
</template>

<script>
import {ref,unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter, useRoute} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus';

import captcha from "@/components/captcha";
import userApi from "@/api/sys/user";
import tool from "@/utils/tool";

export default {
  name: "login",
  components:{
    captcha,
  },
  setup(props ,content){
    const router = useRouter()
    const captcha = ref(null)

    let data = {
      form:reactive({}),
    }
    //监听
    watch(() => [props.info], ([newInfo],[oldInfo]) => {
      // if (newInfo){
      //   Object.assign(data.form, newInfo)
      // }
    })

    onMounted(() => {
    })

    let methods = {
      onSubmit(){
        let param = tool.changeJson(data.form)

        userApi.login(param).then(res => {
          if (res.success){
            ElMessage.success(res.msg);
            router.push({
              path: '/',
            })
          }else{
            ElMessage.warning(res.msg);
            captcha.value.getCaptcha()
          }
        }).catch((e) => {
          ElMessage.error(e);
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
.box{
  width: 100%;
  height: 100%;
  //background-image: linear-gradient(333deg, #FFDEE9 0%, #B5FFFC 100%);
}
.form{
  height: 50%;
}
</style>