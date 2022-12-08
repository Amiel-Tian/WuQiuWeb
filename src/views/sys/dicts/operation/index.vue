<template>
  <el-drawer
      size="50%"
      v-model="drawer"
      :show-close="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">{{ form ? form.id ? form.dictName || '编辑' : '新增' : '新增' }}</h4>
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
          <el-form-item label="字典名" prop="dictName">
            <el-input v-model="form.dictName" placeholder="请输入字典名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="字典编码" prop="dictType">
            <el-input v-model="form.dictType" placeholder="请输入字典编码" clearable/>
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
          <el-form-item label="是否级联" prop="cascaded">
            <el-radio-group v-model="form.cascaded">
              <el-radio v-for="item in dictTreeList" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字典类型" prop="isSys">
            <el-radio-group v-model="form.isSys">
              <el-radio v-for="item in dictTypeList" :label="item.value">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remarks" type="textarea" :row="5" placeholder="备注" clearable/>
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
import {getCurrentInstance, onMounted, ref, watch} from "vue";
import {ElMessage} from "element-plus";

import dictType from "@/api/sys/dictType";
import dictData from "@/api/sys/dictData";

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
      form: ref({}),
      btnLoad: ref(false),
      statusList: ref([]),
      dictTreeList: ref([]),
      dictTypeList: ref([]),
      rules: {
        dictName: [
          {
            required: true,
            message: '请输入字典名',
            trigger: 'change',
          },
        ],
        dictType: [
          {
            required: true,
            message: '请输入字典编码',
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
        cascaded: [
          {
            required: true,
            message: '请选择是否级联',
            trigger: 'change',
          },
        ],
        isSys: [
          {
            required: true,
            message: '请选择字典类型',
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
          dictType.get(props.id).then(res => {
            data.form.value = res.data || {}
          })
        } else {
          data.form.value = {}
          data.form.value.status = "1"
          data.form.value.isSys = "1"
          data.form.value.cascaded = "0"
        }
        methods.loadDictList();
      }
    })
    onMounted(async () => {

    })
    let methods = {
      loadDictList() {
        let statusList = proxy.$tools.selectDict(proxy.$appConfig.STATUS)
        data.statusList.value = statusList
        let dictTreeList = proxy.$tools.selectDict(proxy.$appConfig.DICTTREE)
        data.dictTreeList.value = dictTreeList
        let dictTypeList = proxy.$tools.selectDict(proxy.$appConfig.DICTTYPE)
        data.dictTypeList.value = dictTypeList
      },
      subment() {
        if (!formRef) {
          return
        }
        formRef.value.validate((valid, fields) => {
          if (valid) {
            data.btnLoad.value = true
            if (data.form.value.id) {
              dictType.update(data.form.value).then(res => {
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
              dictType.add(data.form.value).then(res => {
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

<style scoped>

</style>