<template>
  <el-row justify="space-around" style="height: 100%; box-shadow:#666 0 0 .2rem">
    <el-col :span="treeWidth" class="flex-column" style="background-color: #f0f0f1">
      <div class="header">
        <el-input
            v-model="searchForm.name"
            placeholder="搜索"
            class="input-with-select"
            @input=""
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
          <div class="flex-center">
            <span class="text-overlength" style="padding-right: .3rem">{{ item.username }}</span>
            <el-tag v-if="item.type == 'group'" size="small" >群</el-tag>
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
        <el-col :span="24-massageExpandWidth" class="flex-column tree-box" style="border-right: 1px solid #e5e6e7">
            <div class="messages-box" ref="messagesBoxRef">
              <el-scrollbar ref="messagesBoxScrollRef">
                <div ref="recordRef" style="padding: 0 .5rem 1rem .5rem;">
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
              </el-scrollbar>
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
        <el-col :span="massageExpandWidth" class="expand-box">
          <div class="group-title">群成员</div>
          <div class="group-user flex-center" v-for="item in form? form.users ? form.users.split(',') : [] : []">
            <el-icon ><UserFilled /></el-icon>
            {{ userFormat(item) }}
          </div>
        </el-col>
      </el-row>

    </el-col>
  </el-row>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted, onActivated} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter, useRoute} from "vue-router";
import messagesApi from "@/api/modules/messages";
import userApi from "@/api/sys/user";

export default {
  name: "modules/messages",
  props: ["info"],
  emits: ["update:info"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const route = useRoute()
    const {proxy} = getCurrentInstance();
    const messagesBoxRef = ref();
    const messagesBoxScrollRef = ref();
    const recordRef = ref();
    let data = {
      treeWidth: ref(5),
      searchForm: ref({}),
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
      massageExpandWidth: ref(0),
    }
    //监听
    // watch(() => [messagesBoxRef.value], ([newInfo], [oldInfo]) => {
    //   console.log(newInfo)
    // })
    onActivated(async () => {
      await methods.getUserRecord();
      await methods.load();
    })
    onMounted(async () => {
      methods.loadDictList();
      await methods.getUserInfo();
      await methods.getUserRecord();
      await methods.load();
    })
    let methods = {
      async load() {
        let userList = data.userList.value
        let userQuery = route.query

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
        data.massageExpandWidth.value = 0
        if (user.type == 'group'){
          data.massageExpandWidth.value = 3
        }
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
          if (messagesBoxScrollRef && messagesBoxScrollRef.value) {
            messagesBoxScrollRef.value.setScrollTop(recordRef.value.clientHeight)
          }
        } else {
          if (data.scrollHeight.value != 0) {
            if (messagesBoxScrollRef && messagesBoxScrollRef.value) {
              let c = recordRef.value.clientHeight - data.scrollHeight.value
              messagesBoxScrollRef.value.setScrollTop(c)
            }
          }
        }

        let scrollHeight = recordRef.value.clientHeight;
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
          messagesBoxScrollRef.value.setScrollTop(recordRef.value.clientHeight)
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

        let sendId = "";
        if (detail.type == "group"){
          sendId = detail.receiveId
        }else{
          sendId = detail.sendId
        }
        //当前打开窗口（接收人是当前窗口id）
        if (sendId == data.form.value.id) {
          let show = false;
          //发送人不是自己
          if (detail.sendId != data.userInfo.value.id){
            show = true;
          }
          if (show){
            detail.sendDate = proxy.$tools.getDate(detail.sendDate)
            if (data.form.value.record) {
              data.form.value.record.unshift(detail)
            } else {
              data.form.value.record = [detail];
            }
          }
          setTimeout(() => {
            if (messagesBoxRef && messagesBoxRef.value) {
              messagesBoxScrollRef.value.setScrollTop(recordRef.value.clientHeight)
            }
          }, 20)
        }else{
          let show = false
          let filter = []
          //如果不是群聊
          if (detail.type != "group"){
            show = true
            filter = data.userList.value.filter(item => {
              return item.id == detail.sendId
            })
          }
          //如果是群聊
          else if(detail.type == "group"){
            show = true
            filter = data.userList.value.filter(item => {
              return item.id == detail.receiveId
            })
          }
          if (show){
            filter.forEach(item => {
              if (item.record) {
                item.record.push(detail)
              } else {
                item.record = []
                item.record.push(detail)
              }
            })
          }
        }
      }
    }, false);
    return {
      proxy,
      router,
      messagesBoxRef,
      messagesBoxScrollRef,
      recordRef,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>