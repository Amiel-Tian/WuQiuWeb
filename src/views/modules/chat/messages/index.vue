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
        <div
            v-for="(item, index) in searchForm.name ? userList.filter(item => {return item.username.indexOf(searchForm.name) > -1}) : userList"
            :class="item.select ? 'item line-select': 'item'"
            @click="userClick(item)">
          <div style="display: flex">
            <span class="text-overlength" style="padding-right: .3rem">{{ item.username }}</span>
            <el-tag v-if="item.type == 'group'" size="small" effect="dark">群</el-tag>
          </div>
          <div class="date">
            <span v-show="!item.record || item.record.length == 0">{{ dateFormat(item.createdTime) }}</span>
            <el-badge :value="item.record ? item.record.length : '0'" v-show="item.record && item.record.length > 0">
              {{ dateFormat(item.createdTime) }}
            </el-badge>
          </div>

        </div>
        <div class="text-overlength" v-if="!userList || userList.length == 0"
             style="text-align: center;font-size: 14px;color:#94979c;">暂无聊天记录
        </div>
      </div>
    </el-col>
    <el-col :span="24-treeWidth" class="flex-column" style="background-color: #f6f6f7">
      <div class="header" style="font-size: 20px; font-weight: bold;">
        {{ form.username }}
      </div>
      <el-row justify="space-around" style="flex:1;overflow:hidden;" v-show="form.id">
        <el-col :span="24" class="flex-column tree-box" style="border-right: 1px solid #e5e6e7">
          <div class="messages-box" ref="messagesBoxRef">
            <div class="move" v-show="page.pageNum <= page.pages">
              <el-link type="primary" @click="moveClick()" :disabled="moveFlag">
                <span v-if="!moveFlag">加载更多</span>
                <el-icon v-else>
                  <Loading/>
                </el-icon>
              </el-link>
            </div>
            <div v-for="item in form.record? form.record.slice().reverse() : []" :key="item.id"
                 style="margin-top: 1rem">
              <div class="date"
                   :style="item.sendId == userInfo.id ? 'display: flex;justify-content: end;' : 'display: flex;'">
                <span v-if="item.type == 'group' && item.sendId != userInfo.id"
                      style="font-size: 1rem; margin-right: .5rem">{{ userFormat(item.sendId) }}</span>
                <span>{{ dateFormat(item.sendDate) }}</span>
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
      userAllList: ref([]),
      userInfo: ref({}),
      form: ref({}),
      page: ref({
        // sizes: , //多少条分页
        pageSize: 10, // 目前分页数
        pageNum: 1, //目前页数
        total: 0,//总数
        pages: 0,//总页数
      }),
      moveFlag: ref(false),
      scrollHeight: ref(0),
    }
    //监听
    // watch(() => [messagesBoxRef.value], ([newInfo], [oldInfo]) => {
    //   console.log(newInfo)
    // })
    onMounted(async () => {
      methods.loadDictList();
      await methods.getUserInfo();
      await methods.getUserRecord();
      await methods.load();
    })
    let methods = {
      async load() {
        let userList = data.userList.value
        let userQuery = data.userQuery

        if (userQuery && userQuery.id) {
          let id = userList.findIndex((arr) => arr.id == userQuery.id);
          if (id > -1) {
            userList.splice(id, 1)
          }
          userQuery.select = true
          userList.unshift(userQuery)
          data.userList.value = userList
          data.form.value = userQuery
          await methods.userClick(userQuery)
        }
      },
      loadDictList() {
        userApi.datas().then(res => {
          data.userAllList.value = res.data
        })

      },
      async getUserRecord() {
        await messagesApi.getUserRecord().then(res => {
          if (res.success) {
            data.userList.value = data.userList.value.concat(res.data)
          }
        })
      },
      dateFormat(param) {
        let now = proxy.$tools.getDate()
        let date = param

        if (date) {
          if (now.length > 10 && date.indexOf(now.substring(0, 10)) > -1) {
            date = date.replace(now.substring(0, 10), "")
          }
          if (now.length > 5 && date.indexOf(now.substring(0, 5)) > -1) {
            date = date.replace(now.substring(0, 5), "")
          }
        }

        return date ? date : "刚刚"
      },
      userFormat(param) {
        let users = data.userAllList.value
        let filter = users.filter(item => {
          return item.id == param
        })

        if (filter && filter.length > 0) {
          return filter[0].username
        }

        return param
      },
      async getUserInfo() {
        await userApi.getUserInfo().then(res => {
          data.userInfo.value = res.data
        })
      },
      async userClick(user) {
        data.userList.value.forEach(item => {
          if (item.id == user.id) {
            item.select = true
            item.record = []
          } else {
            item.select = false
          }
        })
        data.form.value = JSON.parse(JSON.stringify(user))
        data.page.value.pageNum = 1
        await methods.getMessages()
      },
      async getMessages() {
        let param = {
          sendId: data.form.value.id,
          receiveId: data.userInfo.value.id,
          type: data.form.value.type,
        }

        param = Object.assign(param, data.page.value)
        await messagesApi.page(param).then(res => {
          if (res.success) {
            if (res.data) {
              if (!data.form.value.record) {
                data.form.value.record = []
              }
              data.form.value.record = data.form.value.record.concat(res.data.records)
              data.page.value.total = res.data.total
              data.page.value.pages = res.data.pages
            }
          }
        })

        if (data.page.value.pageNum == 1) {
          if (messagesBoxRef && messagesBoxRef.value) {
            messagesBoxRef.value.scrollTop = messagesBoxRef.value.scrollHeight
          }
        } else {
          if (data.scrollHeight.value != 0) {
            if (messagesBoxRef && messagesBoxRef.value) {
              let c = messagesBoxRef.value.scrollHeight - data.scrollHeight.value
              messagesBoxRef.value.scrollTop = c
            }
          }
        }

        let scrollHeight = messagesBoxRef.value.scrollHeight;
        data.scrollHeight.value = scrollHeight + 0

        data.moveFlag.value = false
      },

      async sendMessage() {
        // websocket.webSocketSend({message : data.form.message})
        let detail = {
          sendId: data.userInfo.value.id,
          receiveId: data.form.value.id,
          message: data.form.value.message,
          sendDate: proxy.$tools.getDate(),
          type: data.form.value.type,
          groupPerId: data.userInfo.value.id,
          users: data.form.value.users,
        }
        if (data.form.value.record) {
          data.form.value.record.unshift(detail)
        } else {
          data.form.value.record = [detail]
        }
        await messagesApi.sentMessage(detail)
        if (messagesBoxRef && messagesBoxRef.value) {
          messagesBoxRef.value.scrollTop = messagesBoxRef.value.scrollHeight
        }
      },

      moveClick() {
        if (data.page.value.pageNum <= data.page.value.pages) {
          data.moveFlag.value = true
          data.page.value.pageNum += 1
          methods.getMessages()
        }
      },
    }
    //监听接收消息
    window.addEventListener('receive', function (event) {
      let res = JSON.parse(event.detail)

      if (res.success && res.code == "10002") {
        let detail = res.data

        /*发送人不是当前打开聊天窗口并且发送人不是登陆人*/
        if ((detail.sendId != data.form.value.id && detail.type != "group") || (detail.receiveId != data.form.value.id && detail.type == "group")) {
          if (detail.type == "group") {
            let filter = data.userList.value.filter(item => {
              return item.id == detail.receiveId
            })
            filter.forEach(item => {
              if (item.record) {
                item.record.push(detail)
              } else {
                item.record = []
                item.record.push(detail)
              }
            })
          } else {
            let filter = data.userList.value.filter(item => {
              return item.id == detail.sendId
            })
            filter.forEach(item => {
              if (item.record) {
                item.record.push(detail)
              } else {
                item.record = []
                item.record.push(detail)
              }
            })
          }
          // data.userList.value.forEach(item => {
          //   console.log(item, item.record)
          //   if (detail.type == "group"){
          //     if (item.id == detail.receiveId) {
          //       if (item.record) {
          //         item.record.push(detail)
          //       }else {
          //         item.record = []
          //         item.record.push(detail)
          //       }
          //     }
          //   }else {
          //     if (item.id == detail.sendId) {
          //       if (item.record) {
          //         item.record.push(detail)
          //       }else {
          //         item.record = []
          //         item.record.push(detail)
          //       }
          //     }
          //   }
          // })
        }
        /*发送人为当前打开聊天窗口人并且发送人不是登陆人，群发并且发送人不是登陆人*/
        if ((detail.sendId == data.form.value.id && detail.sendId != data.userInfo.value.id && detail.type != "group") || (detail.type == "group" && detail.receiveId == data.form.value.id)) {
          detail.sendDate = proxy.$tools.getDate(detail.sendDate)
          if (data.form.value.record) {
            data.form.value.record.unshift(detail)
          } else {
            data.form.value.record = [detail];
          }
        }
      }
      setTimeout(() => {
        if (messagesBoxRef && messagesBoxRef.value) {
          messagesBoxRef.value.scrollTop = messagesBoxRef.value.scrollHeight
        }
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