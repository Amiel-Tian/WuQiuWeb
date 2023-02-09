<template>
  <el-row justify="space-around" style="height: 100%; box-shadow:#666 0 0 .2rem">
    <el-col :span="treeWidth" class="flex-column" style="background-color: #f0f0f1">
      <div class="header">
        <el-input
            v-model="searchForm.name"
            placeholder="搜索"
            class="input-with-select"
        >
          <template #prepend>
            <el-button icon="Search"/>
          </template>
        </el-input>
      </div>
      <div class="list-box">
        <div v-for="(item, index) in userList"
             :class="item.select ? 'item line-select': 'item'"
             @click="userClick(item)">
          {{ item.username }}
        </div>
        <div class="text-overlength" v-if="!userList || userList.length == 0"
             style="text-align: center;font-size: 14px;color:#94979c;">暂无聊天记录
        </div>
      </div>
    </el-col>
    <el-col :span="24-treeWidth" class="flex-column" style="background-color: #f6f6f7">
      <div class="header" style="font-size: 20px; font-weight: bold;">
        {{form.username}}
      </div>
      <el-row justify="space-around" style="flex:1;overflow:hidden;" v-show="form.id">
        <el-col :span="24" class="flex-column tree-box" style="border-right: 1px solid #e5e6e7">
          <div class="messages-box" ref="messagesBoxRef">
            <div v-for="item in form.record">
              <div class="date"
                   :style="item.sendId == userInfo.id ? 'display: flex;justify-content: end;' : 'display: flex;'">
                {{ item.sendDate }}
              </div>
              <div :style="item.sendId == userInfo.id ? 'display: flex;justify-content: end;' : 'display: flex;'">
                <div class="message" :style="item.sendId == userInfo.id ? 'background-color: #c9e7ff' : ''">
                  {{ item.message }}
                </div>
              </div>
            </div>
          </div>
          <div class="send-box">
            <div class="tools">
              <el-tooltip content="语音通话" effect="light">
                <el-icon>
                  <PhoneFilled/>
                </el-icon>
              </el-tooltip>
            </div>
            <div class="send">
              <el-input v-model="form.message" type="textarea" resize="none"></el-input>
            </div>
            <div class="btn">
              <el-button @click="sendMessage">发送</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="0"></el-col>
      </el-row>

    </el-col>
  </el-row>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter, useRoute} from "vue-router";
import messagesApi from "@/api/modules/messages";
import userApi from "@/api/sys/user";

export default {
  name: "index",
  props: ["info"],
  emits: ["update:info"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const route = useRoute()
    const {proxy} = getCurrentInstance();
    const messagesBoxRef = ref();
    let data = {
      treeWidth: ref(5),
      searchForm: ref({}),
      userQuery: route.query,
      userList: ref([]),
      userInfo: ref({}),
      form: ref({}),
    }
    //监听
    watch(() => [data.form.value.record], ([newInfo], [oldInfo]) => {
    })
    onMounted(async () => {
      methods.loadDictList();
      await methods.getUserInto();
      await methods.load();
      await methods.getUserRecord();
    })
    let methods = {
      async load() {
        let userList = data.userList.value
        let userQuery = data.userQuery

        if (userQuery && userQuery.id) {
          let id = userList.findIndex((arr) => arr.id == userQuery.id);
          if (id && id > -1){
            this.tableData.splice(id, 1);
          }

          userQuery.select = true
          userList.unshift(userQuery)
          data.userList.value = userList
          data.form.value = userQuery
          await methods.userClick(userQuery)
        }
      },
      loadDictList() {

      },
      getUserRecord() {
        messagesApi.getUserRecord().then(res => {
          if (res.success){
            data.userList.value = data.userList.value.concat(res.data)
          }
        })
      },
      async getUserInto() {
        await userApi.getUserInfo().then(res => {
          data.userInfo.value = res.data
        })
      },
      async userClick(user) {
        data.userList.value.forEach(item => {
          if (item.id == user.id) {
            item.select = true
          } else {
            item.select = false
          }
        })
        data.form.value = user
        let param = {
          sendId: user.id,
          receiveId: data.userInfo.value.id,
        }
        await messagesApi.datas(param).then(res => {
          if (res.success) {
            if (res.data) {
              data.form.value.record = res.data
            }
          }
        })

        messagesBoxRef.value.scrollTop = messagesBoxRef.value.scrollHeight
      },

      async sendMessage() {
        // websocket.webSocketSend({message : data.form.message})
        let detail = {
          sendId: data.userInfo.value.id,
          receiveId: data.form.value.id,
          message: data.form.value.message,
          sendDate: proxy.$tools.getDate(),
        }
        if (data.form.value.id != data.userInfo.value.id) {
          if (data.form.value.record) {
            data.form.value.record.push(detail)
          } else {
            data.form.value.record = [detail]
          }
        }
        await messagesApi.sentMessage(detail)
        messagesBoxRef.value.scrollTop = messagesBoxRef.value.scrollHeight
      },

    }
    //监听接收消息
    window.addEventListener('receive', function (event) {
      let res = JSON.parse(event.detail)

      if (res.success && res.data.type=="message"){
        let detail = res.data.data
        if (detail.sendId == data.form.value.id && detail.sendId != data.userInfo.id) {
          detail.sendDate = proxy.$tools.getDate(detail.sendDate)
          if (data.form.value.record) {
            data.form.value.record.push(detail)
          } else {
            data.form.value.record = [detail]
          }
        }
      }
      setTimeout(() => {
        messagesBoxRef.value.scrollTop = messagesBoxRef.value.scrollHeight
      }, 20)
    }, false);
    return {
      proxy,
      router,
      messagesBoxRef,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>