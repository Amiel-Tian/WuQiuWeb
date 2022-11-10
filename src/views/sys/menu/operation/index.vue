<template>
  <el-drawer
      size="50%"
      v-model="drawer"
      :show-close="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">{{ form ? form.name || '编辑菜单' : '新增菜单' }}</h4>
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
          <el-form-item label="上级菜单">
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
          <el-form-item label="菜单名称">
            <el-input v-model="form.name" placeholder="请输入菜单名称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单地址">
            <el-input v-model="form.path" placeholder="请输入菜单地址" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授权编码">
            <el-input v-model="form.perms" placeholder="请输入授权编码" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单类型">
            <el-radio-group v-model="form.type">
              <el-radio :label="0">目录</el-radio>
              <el-radio :label="1">菜单</el-radio>
              <el-radio :label="2">功能</el-radio>
            </el-radio-group>
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
              <div >
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
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio label="1" >正常</el-radio>
              <el-radio label="0" >停用</el-radio>
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

import menuApi from "@/api/sys/menu"
import {ElMessage} from "element-plus";
export default {
  name: "index",
  props: ["id", "drawer", "parentId"],
  emits: ["update:drawer","success"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    let data = {
      form: ref({}),
      treeData: ref([]),
      btnLoad : ref(false),
      cascaderProps: {
        children: "children",
        label: "name",
        value: "id",
        checkStrictly : true,
        emitPath : false,
      },
      iocnDrawer: ref(false)
    }
    //监听
    watch(() => [props.drawer], ([drawer]) => {
      content.emit('update:drawer', drawer)
      if (drawer){
        if (props.id) {
          menuApi.get(props.id).then(res => {
            data.form.value = res.data || {}
              data.form.value.status =  data.form.value.status + ""
          })
        }else {
          data.form.value = {}
          data.form.value.status = "1"
        }
        if (props.parentId) {
          data.form.value.parentId = props.parentId || ""
        }

        methods.getNav()
      }
    })
    onMounted(async () => {

    })
    let methods = {
      getNav() {
        menuApi.getNavAll().then(res => {
          data.treeData.value = res.data.nav
        })
      },
      subment(){
        data.btnLoad.value = true
        let param = data.form.value
        if (!param.parentId){
          param.parentId = "0"
        }
        if (param.id){
          menuApi.update(param).then(res => {
            if (res.success){
              ElMessage.success(res.msg)
            }else {
              ElMessage.error(res.msg)
            }
            content.emit("success", {});
            data.form.value = {}
            data.btnLoad.value = false;
          })
        }else{
          menuApi.add(param).then(res => {
            if (res.success){
              ElMessage.success(res.msg)
            }else {
              ElMessage.error(res.msg)
            }
            content.emit("success", {});

            data.btnLoad.value = false;
          })
        }
        data.form.value = {}
        content.emit("success", {});
      }
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