<template>
  <el-form :model="form" label-width="100px" :disabled="btnLoad">
    <el-row>
      <el-col :span="5">
        <el-form-item label="合同编号">
          <el-autocomplete
              style="width: 100%;"
              v-model="form.contractNo"
              :fetch-suggestions="querySearch"
              clearable
              placeholder="请输入合同编号"
              @select="handleSelect"
              @change="changeForm()"
              @clear="changeForm()"
          >
            <template #default="{ item }">
              <el-row>
                {{ item.num }}
              </el-row>
              <el-row justify="end" class="op-btn">
                {{ item.name }}
              </el-row>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="客户名称">
          <el-input v-model="form.customerName" @input="changeForm()" placeholder="请输入客户名称" clearable/>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="申请人">
          <el-input v-model="form.applicant" @input="changeForm()" placeholder="请输入申请人" clearable/>
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
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="changeTime()"
          />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="工作时长">
          <el-input-number @input="changeForm()" v-model="form.workTime" placeholder="小时" :min="1" :max="1000"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-input
            v-model="form.context"
            :rows="10"
            type="textarea"
            placeholder="请输入工作内容"
            @input="changeForm()"
        />
      </el-col>
    </el-row>
    <el-row justify="end" style="margin-top: 1rem">
      <el-button v-permission="['sys:renwu:add']" v-if="!form.id" type="primary" :loading="btnLoad"
                 @click="submentClick()">{{ form.id ? '保存修改此条数据' : '记录此条数据' }}
      </el-button>
      <el-button v-permission="['sys:renwu:update']" v-if="form.id" type="primary" :loading="btnLoad"
                 @click="submentClick()">{{ form.id ? '保存修改此条数据' : '记录此条数据' }}
      </el-button>
      <el-button v-permission="['sys:renwu:clear']" :loading="btnLoad"
                 @click="clearClick">{{ form.id ? '取消修改' : '清空' }}
      </el-button>
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
          :rows="10"
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
import {ElMessage, ElMessageBox} from "element-plus";

import renwuApi from "@/api/model/renwu";
import tool from "@/utils/model"

export default {
  name: "index",
  props: ["info", "drawer"],
  emits: ["update:drawer", "success","clear"],
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
      showData: ref(""),
      btnLoad: ref(false),
      contractNoList: ref([]),
    }

    watch(() => [props.drawer], async ([drawer]) => {
      if (drawer) {
        data.btnLoad.value = true
        await renwuApi.get(props.info.id).then(res => {
          data.form.value = res.data
          if ( data.form.value) {
            if (data.form.value.startDate && data.form.value.endDate) {
              data.form.value.dateTime = []
              data.form.value.dateTime.push(data.form.value.startDate)
              data.form.value.dateTime.push(data.form.value.endDate)
            }
            data.btnLoad.value = false
          }
        })

        methods.changeForm()
      }
      methods.getNumDatas()
    })
    //监听
    // watch(data.form.value, () => {
    // }, {
    //   // deep: true,
    //   // immediate: true
    // })
    onMounted(async () => {
      methods.getUserInfo();
      methods.getNumDatas()
    })
    let methods = {
      getUserInfo() {
        userApi.getUserInfo().then(res => {
          data.userInfo.value = res.data

        })
      },
      /*获取列表*/
      getNumDatas() {
        let param = {}
        renwuApi.datasPro(param).then(res => {
          data.contractNoList.value = res.data
        }).finally(() => {
        })
      },
      submentClick() {

        data.btnLoad.value = true
        let param = data.form.value;

        // param.startDate = param.startDate ? param.startDate.replaceAll(".", "-") + " 08:30:00" : ""
        // param.endDate = param.endDate ? param.endDate.replaceAll(".", "-") + " 17:30:00" : ""

        if (param.contractNo) {
          let fil = data.contractNoList.value.filter(f => {
            return f.num == param.contractNo
          })
          if (fil && fil.length > 0) {
            if (fil[0].num != param.contractNo || fil[0].name != param.customerName || fil[0].person != param.applicant) {
              ElMessageBox.confirm('检测到合同内容发生变化，是否同步修改合同内容?', '提示',
                  {
                    confirmButtonText: '修改',
                    cancelButtonText: '不修改',
                    type: 'warning',
                  }).then(() => {
                let pro = {
                  id: fil[0].id,
                  num: param.contractNo,
                  name: param.customerName,
                  person: param.applicant,
                }
                renwuApi.updatePro(pro).then(res => {
                  if (res.success){
                    ElMessage.success(res.msg)
                  }else{
                    ElMessage.warning(res.msg)
                  }

                })
              }).catch(() => {
                ElMessage({
                  type: 'info',
                  message: 'canceled',
                })
              })
            }
          } else {
            let pro = {
              num: param.contractNo,
              name: param.customerName,
              person: param.applicant,
            }
            renwuApi.addPro(pro).then(res => {

            })
          }
        }

        if (param.id) {
          renwuApi.update(param).then(res => {
            ElMessage.success(res.msg)
            data.form.value = {}
            data.form.value.recipient = data.userInfo.value.username
            data.btnLoad.value = false
            this.changeForm()
            content.emit('success', param)
            content.emit('update:drawer', !props.drawer)
          })
        } else {
          renwuApi.add(param).then(res => {
            ElMessage.success(res.msg)
            data.form.value = {}
            data.form.value.recipient = data.userInfo.value.username
            data.btnLoad.value = false
            this.changeForm()
            content.emit('success', param)
            content.emit('update:drawer', !props.drawer)
          })
        }
      },
      clearClick(){
        methods.clearForm()
        content.emit('update:drawer', !props.drawer)
      },
      changeTime() {
        if (data.form.value.dateTime) {
          let day = tool.getWeekday(data.form.value.dateTime[0], data.form.value.dateTime[1])
          data.form.value.workTime = day * 8
        }
        this.changeForm()
      },
      clearForm(){
        data.form.value = {
          recipient : data.userInfo.value.username
        }
        methods.changeForm()
      },
      changeForm() {
        if (data.form.value) {
          data.showData.value = data.form.value.contractNo || ""
          data.showData.value += data.form.value.customerName ? " " + data.form.value.customerName : ""
          data.showData.value += data.form.value.applicant ? "_" + data.form.value.applicant : ""
          data.showData.value += data.form.value.recipient ? "to" + data.form.value.recipient : ""
          if (data.form.value.dateTime) {
            data.form.value.startDate = data.form.value.dateTime[0]
            data.form.value.endDate = data.form.value.dateTime[1]

            data.showData.value += data.form.value.startDate ? " " + data.form.value.startDate.substring(0,10).replaceAll("-",".") : ""
            data.showData.value += data.form.value.endDate ? "-" + data.form.value.endDate.substring(0,10).replaceAll("-",".") : ""
          } else {
            data.form.value.startDate = undefined
            data.form.value.endDate = undefined
          }

          data.showData.value += data.form.value.workTime ? " " + data.form.value.workTime + "小时" : ""
          data.showData.value += data.form.value.context ? "\n" + data.form.value.context + "" : ""
        }
      },
      querySearch(queryString, cb) {
        const results = queryString
            ? data.contractNoList.value.filter(f => {
              return f.num.indexOf(queryString) > -1
            })
            : data.contractNoList.value
        // call callback function to return suggestions
        cb(results)
      },
      handleSelect(item) {
        data.form.value.contractNo = item.num
        data.form.value.customerName = item.name
        data.form.value.applicant = item.person

        methods.changeForm()
      },
      async copy(content) {
        if (!content) {
          ElMessage.warning("内容为空")
          return
        }
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