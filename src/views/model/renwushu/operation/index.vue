<template>
  <el-form :model="form" label-width="120px">
    <el-row>
      <el-col :span="5">
        <el-form-item label="合同编号">
          <el-input v-model="form.contractNo" placeholder="请输入合同编号" clearable/>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="客户名称">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" clearable/>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="申请人">
          <el-input v-model="form.applicant" placeholder="请输入申请人" clearable/>
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
    <el-row justify="end" style="margin-top: 1rem">
      <el-button type="primary" @click="submentClick()">记录此条数据</el-button>
    </el-row>
    <el-divider/>
    <el-row justify="space-between">
      <el-row justify="start" class="op-btn" @click="copy(showData)">
        生成结果
      </el-row>
      <el-row justify="end">
        <el-icon style="width: 1.5rem; height: 1.5rem;" class="op-btn" @click="copy(showData)">
          <CopyDocument/>
        </el-icon>
      </el-row>
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
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import useClipboard from 'vue-clipboard3'
import {useRouter} from "vue-router";
import userApi from "@/api/sys/user";
import {ElMessage} from "element-plus";

import renwuApi from "@/api/model/renwu";
import menuApi from "@/api/sys/menu";

export default {
  name: "index",
  props: ["info"],
  emits: ["success"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const {toClipboard} = useClipboard()
    let data = {
      userInfo: ref({}),
      form: ref({}),
      defaultTime: ref([
        new Date(2000, 1, 1, 8, 30, 0),
        new Date(2000, 2, 1, 17, 30, 0),
      ]),
      showData: ref("")
    }

    watch(() => [props.info.id], async ([info]) => {
      if (info) {
        await renwuApi.get(info).then(res => {
          data.form.value = res.data
          if (data.form.value.startDate && data.form.value.endDate) {
            data.form.value.dateTime = []
            data.form.value.dateTime.push(data.form.value.startDate)
            data.form.value.dateTime.push(data.form.value.endDate)
          }
        })
      }
    })
    //监听
    watch(data.form.value, () => {
      console.log(data.form.value)
      data.showData.value = data.form.value.contractNo || ""
      data.showData.value += data.form.value.customerName ? " " + data.form.value.customerName : ""
      data.showData.value += data.form.value.applicant ? "_" + data.form.value.applicant : ""
      data.showData.value += data.form.value.recipient ? "to" + data.form.value.recipient : ""
      if (data.form.value.dateTime) {
        data.form.value.startDate = data.form.value.dateTime[0]
        data.form.value.endDate = data.form.value.dateTime[1]

        data.showData.value += data.form.value.startDate ? " " + data.form.value.startDate : ""
        data.showData.value += data.form.value.endDate ? "-" + data.form.value.endDate : ""
      } else {
        data.form.value.startDate = undefined
        data.form.value.endDate = undefined
      }

      data.showData.value += data.form.value.workTime ? " " + data.form.value.workTime + "小时" : ""
      data.showData.value += data.form.value.context ? "\n" + data.form.value.context + "" : ""
    }, {
      // deep: true,
      // immediate: true
    })
    onMounted(async () => {
      methods.getUserInto();
    })
    let methods = {
      getUserInto() {
        userApi.getUserInfo().then(res => {
          data.userInfo.value = res

          data.form.value.recipient = data.userInfo.value.username
        })
      },
      submentClick() {
        let param = data.form.value;

        param.startDate = param.startDate ? param.startDate.replaceAll(".", "-") + " 08:30:00" : ""
        param.endDate = param.endDate ? param.endDate.replaceAll(".", "-") + " 17:30:00" : ""

        if (param.id) {
          renwuApi.update(param).then(res => {
            ElMessage.success(res.msg)
            data.form.value = {}
          })
        } else {
          renwuApi.add(param).then(res => {
            ElMessage.success(res.msg)
            data.form.value = {}
          })
        }
        content.emit('success', param)
      },
      async copy(content) {
        try {
          await toClipboard(content)
          ElMessage.success("复制成功");
        } catch (e) {
          ElMessage.error("复制失败" + e);
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
.op-btn {
  cursor: pointer;
  color: var(--el-text-color-secondary);
}

.op-btn:hover {
  color: var(--el-text-color-primary);
}
</style>