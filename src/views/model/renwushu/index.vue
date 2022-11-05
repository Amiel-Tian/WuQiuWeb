<template>
  <el-card class="box-card">

    <el-form :model="form" label-width="120px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="合同编号">
            <el-input v-model="form.contractNo" placeholder="请输入合同编号"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="客户名称">
            <el-input v-model="form.customerName" placeholder="请输入客户名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="申请人">
            <el-input v-model="form.applicant" placeholder="请输入申请人"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="工作时间">
            <el-date-picker
                v-model="form.dateTime"
                type="datetimerange"
                start-placeholder="Start Date"
                end-placeholder="End Date"
                :default-time="defaultTime"
                value-format="YYYY.MM.DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="工作时长">
            <el-input-number v-model="form.workTime" placeholder="小时" :min="1" :max="1000"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-input
              v-model="form.context"
              :rows="5"
              type="textarea"
              placeholder="请输入工作内容"
          />
        </el-col>
      </el-row>
      <el-divider />
      <el-row>
        <el-icon class="" @click="copy(showData)"><CopyDocument /></el-icon>
      </el-row>
      <el-row>
        <el-input
            disabled
            v-model="showData"
            :rows="5"
            type="textarea"
            placeholder="显示信息"
        />
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import useClipboard   from 'vue-clipboard3'
import {useRouter} from "vue-router";
import userApi from "@/api/sys/user";
import {ElMessage} from "element-plus";

export default {
  name: "index",
  props: [],
  emits: [],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const { toClipboard } = useClipboard()
    let data = {
      userInfo: reactive({}),
      form: reactive({}),
      defaultTime: ref([
        new Date(2000, 1, 1, 8, 30, 0),
        new Date(2000, 2, 1, 17, 30, 0),
      ]),
      showData: ref("12")
    }
    //监听
    watch(data.form, () => {
      console.log(data.form)

      data.showData.value = data.form.contractNo || ""
      data.showData.value += data.form.customerName ? " " + data.form.customerName : ""
      data.showData.value += data.form.applicant ? "_" + data.form.applicant : ""
      data.showData.value += data.form.recipient ? "to" + data.form.recipient : ""
      if (data.form.dateTime){
        data.form.startDate = data.form.dateTime[0]
        data.form.endDate = data.form.dateTime[1]

        data.showData.value += data.form.startDate ? " " + data.form.startDate : ""
        data.showData.value += data.form.endDate ? "-" + data.form.endDate : ""
      }

      data.showData.value += data.form.dateTime ? " " + data.form.dateTime + "小时" : ""
      data.showData.value += data.form.context ? "\n" + data.form.context + "" : ""
      console.log(data.showData.value)
    })
    onMounted(async () => {
      methods.getUserInto();
    })
    let methods = {
      getUserInto() {
        userApi.getUserInfo().then(res => {
          Object.assign(data.userInfo, res)

          data.form.recipient = data.userInfo.username
        })
      },
      async copy(content) {
        try {
          await toClipboard(content)
          ElMessage.success("复制成功");
        } catch (e) {
          ElMessage.error("复制失败" ,"e");
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