<template>
  <el-drawer
      size="50%"
      v-model="drawer"
      :show-close="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">{{ form ? form.dictName || '编辑' : '新增' }}</h4>
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
          <el-form-item label="字典名">
            <el-input v-model="form.dictName" placeholder="请输入字典名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="字典编码">
            <el-input v-model="form.dictType" placeholder="请输入字典编码" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio label="1" >正常</el-radio>
              <el-radio label="0" >停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否级联">
            <el-radio-group v-model="form.cascaded">
              <el-radio label="1" >是</el-radio>
              <el-radio label="0" >否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字典类型">
            <el-radio-group v-model="form.isSys">
              <el-radio label="0" >系统字典</el-radio>
              <el-radio label="1" >业务字典</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remarks"  type="textarea" :row="5" placeholder="备注" clearable/>
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
import {useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {ElMessage} from "element-plus";

import dictType from "@/api/sys/dictType";
import dictData from "@/api/sys/dictData";
export default {
  name: "index",
  props: ["id","drawer"],
  emits: [ "update:drawer", "success"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    let data = {
      form: ref({}),
      btnLoad: ref(false),
    }

    //监听
    watch(() => [props.drawer], ([drawer]) => {
      content.emit('update:drawer', drawer)
      if (drawer) {
        if (props.id) {
          dictType.get(props.id).then(res => {
            data.form.value = res.data || {}
          })
        }else{
          data.form.value = {}
          data.form.value.status = "1"
          data.form.value.isSys = "1"
          data.form.value.cascaded = "0"
        }
      }
    })
    onMounted(async () => {

    })
    let methods = {
      subment(){
        data.btnLoad.value = true
        if (data.form.value.id){
          dictType.update(data.form.value).then(res => {
            if (res.success){
              ElMessage.success(res.msg)
            }else {
              ElMessage.error(res.msg)
            }

            content.emit("success", {});
            data.form.value = {}
            data.btnLoad.value = false
          })
        }else {
          dictType.add(data.form.value).then(res => {
            if (res.success){
              ElMessage.success(res.msg)
            }else {
              ElMessage.error(res.msg)
            }

            content.emit("success", {});
            data.form.value = {}
            data.btnLoad.value = false
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

<style scoped>

</style>