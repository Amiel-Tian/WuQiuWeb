<template>
  <el-card style="height: 90%;" body-style="height: 100%;">
    <el-row justify="space-around" style="height: 100%;">
      <el-col :span="treeWidth">
        <el-input placeholder="输入搜索" v-model="treeInput" clearable>
          <template #append>
            <el-button icon="Search" @click="treeSearch"/>
          </template>
        </el-input>
        <el-row justify="space-between" align="middle" style="flex: 1; padding: .5rem; ">
          <el-tooltip
              effect="dark"
              content="刷新"
              placement="top-start"
          >
            <el-icon class="op-btn" @click="refreshTreeClick">
              <Refresh/>
            </el-icon>
          </el-tooltip>
        </el-row>
        <el-tree
            ref="treeRef"
            :data="treeData"
            :props="treeProps"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            @node-click="treeeNodeClick"
            :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <el-row justify="space-between">
              <el-tooltip
                  effect="dark"
                  :content="node.label"
                  placement="right-start"
              >
                <div class="text-overlength" style="flex: 1">{{ node.label }}</div>
              </el-tooltip>
            </el-row>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="24-treeWidth-1" style="height: 100%;">
        <div class="chat" v-show="form.id">
          <div class="head">{{ form.username }}
          </div>
          <div class="content" ref="contentRef">
            <div v-for="item in form.record">
              <div class="date"
                   :style="item.sendId == userInfo.id ? 'display: flex;justify-content: end;' : 'display: flex;'">
                {{ item.sendDate }}
              </div>
              <div :style="item.sendId == userInfo.id ? 'display: flex;justify-content: end;' : 'display: flex;'">
                <div class="message-box" :style="item.sendId == userInfo.id ? 'background-color: #c9e7ff' : ''">
                  {{ item.message }}
                  <!--                {{ item.sendDate }}-->
                </div>
              </div>
            </div>
          </div>
          <div class="input">
            <el-row></el-row>
            <el-input v-model="form.message" type="textarea" :rows="5" resize="none"></el-input>
            <el-row justify="end">
              <el-button @click="sendMessage()">发送</el-button>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router";
import useClipboard from "vue-clipboard3";
import userApi from "@/api/sys/user";
import websocket from "@/utils/websocket";
import websocketApi from "@/api/sys/websocket";

export default {
  name: "index",
  props: [],
  emits: [],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const {proxy} = getCurrentInstance();

    const treeRef = ref();
    const contentRef = ref();
    let data = {
      treeWidth: ref(4),
      treeInput: ref(""),
      treeData: ref([]),
      treeProps: {
        children: 'children',
        label: 'username',
      },
      currentTreeeNode: ref({}),
      form: ref({}),
      userInfo: ref({}),

    }
    //监听
    watch(() => [props.info], ([newInfo], [oldInfo]) => {
      // if (newInfo){
      //   Object.assign(data.form, newInfo)
      // content.emit('update:info',newInfo)
      // }
    })
    onMounted(async () => {
      methods.loadDictList()
      methods.getUserInto()

      websocket.connectWebsocket()
    })
    let methods = {
      getUserInto() {
        userApi.getUserInfo().then(res => {
          data.userInfo.value = res.data
        })
      },
      loadDictList() {
        userApi.datas().then(res => {
          data.treeData.value = res.data
        })

      },
      treeSearch() {
        treeRef.value.filter(data.treeInput)
      },
      /*
     * 树型控件点击事件
     * */
      treeeNodeClick(datas, node, TreeNode, e) {
        data.form.value = datas
        data.currentTreeeNode.value = datas

        let param = {
          sendId: datas.id,
          receiveId: data.userInfo.value.id,
        }
        websocketApi.datas(param).then(res => {
          if (res.success) {
            if (res.data) {
              data.form.value.record = res.data
              contentRef.value.scrollTop = contentRef.value.scrollHeight
            }
          }
        })
      },
      /*
      * 过滤函数
      * */
      filterNode(value, datas) {
        if (!value) return true
        return datas.name.indexOf(value) != -1
      },
      refreshTreeClick() {
      },
      sendMessage() {
        // websocket.webSocketSend({message : data.form.message})
        let detail = {
          sendId: data.userInfo.value.id,
          receiveId: data.form.value.id,
          message: data.form.value.message,
          sendDate: proxy.$tools.getDate(),
        }
        if (data.form.value.record) {
          data.form.value.record.push(detail)
        } else {
          data.form.value.record = [detail]
        }

        contentRef.value.scrollTop = contentRef.value.scrollHeight
        websocketApi.sentMessage(detail)
      },


    }

    //监听接收消息
    window.addEventListener('receive', function (event) {
      let detail = JSON.parse(event.detail)
      detail.sendDate = proxy.$tools.getDate(detail.sendDate)

      if (detail.sendId == data.form.value.id && detail.sendId != data.userInfo.id) {
        if (data.form.value.record) {
          data.form.value.record.push(detail)
        } else {
          data.form.value.record = [detail]
        }

        contentRef.value.scrollTop = contentRef.value.scrollHeight
      }
      // ElMessage.success(event.detail)
    }, false);


    return {
      proxy,
      router,
      treeRef,
      contentRef,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .head {
    height: 3rem;
    line-height: 3rem;
    border-bottom: 1px #65696c solid;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: .5rem;

    .date {
      padding: .2rem;
      font-size: .1rem;
      color: #969696;
    }

    .message-box {
      padding: .5rem;
      max-width: 35%;
      background-color: #f2f2f2;
      border-radius: 4px;
    }
  }

  .input {
    height: 10rem;
  }
}
</style>