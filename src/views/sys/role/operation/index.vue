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
    <el-form :model="form" label-width="120px">
      <el-row justify="start" style="margin: .5rem">
        <el-col :span="24">
          <el-form-item label="角色名">
            <el-input v-model="form.username" placeholder="请输入角色名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="角色编码">
            <el-input v-model="form.loginname" placeholder="角色编码" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="状态">
            <el-radio-group v-model="form.statu">
              <el-radio label="正常" />
              <el-radio label="停用" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色授权">
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
            <el-button @click="subment">保存</el-button>
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
  props: ["id","drawer"],
  emits: [ "update:drawer", "success"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    let data = {
      iocnDrawer: ref(false),
      treeList: ref([]),
      form: ref({}),
      cascaderProps: {
        children: "children",
        label: "name",
        value: "id",
        checkStrictly : true,
        emitPath : false,
        multiple: true,
      },
    }
    //监听
    watch(() => [props.drawer], ([drawer]) => {
      content.emit('update:drawer', drawer)
      if (drawer) {
        if (props.id) {
          roleApi.get(props.id).then(res => {
            data.form.value = res.data || {}
            data.form.value.password = undefined
          })
        }
        methods.getNav();
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
      subment(){
        if (data.form.value.id){
          roleApi.update(data.form.value).then(res => {
            if (res.success){
              ElMessage.success(res.msg)
            }else {
              ElMessage.error(res.msg)
            }
          })
        }else {
          roleApi.add(data.form.value).then(res => {
            if (res.success){
              ElMessage.success(res.msg)
            }else {
              ElMessage.error(res.msg)
            }
          })
        }
        content.emit("success", {});
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