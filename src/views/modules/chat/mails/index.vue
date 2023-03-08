<template>

  <el-row justify="space-around" style="height: 100%; box-shadow:#666 0 0 .2rem">
    <el-col :span="treeWidth" class="flex-column" style="background-color: #f0f0f1;">
      <div class="header flex-center">
        <el-input
            v-model="searchForm.name"
            placeholder="搜索"
            class="input-with-select"
        >
          <template #prepend>
            <el-button icon="Search"/>
          </template>
        </el-input>
        <el-tooltip
            effect="dark"
            content="创建群聊"
            placement="right-end"
        >
          <el-icon class="btn" @click="addGroup"><Plus /></el-icon>
        </el-tooltip>
      </div>
      <div class="list-box">
        <div v-for="(item, index) of treeAll"
             :class="item.select ? 'line line-select' : 'line'"
             @click="lineClick(item)"
        >
          <el-row justify="space-between">
            <div class="flex-center">
              <el-icon class="icon">
                <component v-if="item.icon" :is="item.icon" :index="index" :key="index"></component>
                <component v-if="!item.icon" :is="'Histogram'" :index="index" :key="index"></component>
              </el-icon>
            </div>
            <div class="text-overlength flex-center" style="flex: 1; padding: 0 .3rem">
              {{ item.name }}
            </div>
            <div class="flex-center">
              <el-icon style="color:#94979c">
                <ArrowRightBold/>
              </el-icon>
            </div>
          </el-row>
        </div>
      </div>
    </el-col>
    <el-col :span="24-treeWidth" class="flex-column" style="background-color: #f6f6f7">
      <div class="header" style="font-size: 20px; font-weight: bold;">
        <div class="flex-center">
          {{ selectRootForm.name }}
        </div>
      </div>
      <el-row justify="space-around" class="messages-box" style="overflow:hidden;">
        <el-col :span="treeWidth" class="flex-column" style="border-right: 1px solid #e5e6e7;overflow-y: auto">
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
              <el-row justify="space-between" v-if="!data.userId">
                <div class="flex-center">
                  <el-icon>
                    <Folder/>
                  </el-icon>
                </div>
                <div class="text-overlength" style="flex: 1; padding: 0 .3rem">{{ node.label }}</div>
              </el-row>
              <el-row justify="space-between" v-if="data.userId">
                <div class="text-overlength" style="flex: 1; padding: 0 .3rem">{{ formatUser(data.userId) }}</div>
              </el-row>
            </template>
          </el-tree>
        </el-col>
        <el-col :span="24-treeWidth" class="details">
          <div v-if="form.username" class="user">
            <div class="username">{{form.username}}</div>
            <div style="padding: 1rem 0">
              <el-button type="primary" @click="sendMessClick()">发送消息</el-button>
            </div>
          </div>
          <div v-else class="organ">
            <div style="color: #0075bc;font-size: 20px">{{selectRootForm.name}}</div>
            <div style="font-size: 18px; font-weight: bold;padding: 1rem 0">{{form.name}}</div>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router";
import organApi from "@/api/sys/organ";
import userApi from "@/api/sys/user";
import router from "@/router";

export default {
  name: "modules/mails",
  props: ["info"],
  emits: ["update:info"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const {proxy} = getCurrentInstance();
    const treeRef = ref()
    let data = {
      treeWidth: ref(5),
      searchForm: ref({}),
      userList: ref([]),
      treeAll: ref([]),
      treeData: ref([]),
      treeProps: {
        children: 'children',
        label: 'name',
      },
      selectRootForm: ref({}),
      form: ref({}),
    }
    //监听
    watch(() => [props.info], ([newInfo], [oldInfo]) => {
      // if (newInfo){
      //   Object.assign(data.form, newInfo)
      // content.emit('update:info',newInfo)
      // }
    })
    onMounted(async () => {
      methods.loadDictList();
    })
    let methods = {
      loadDictList() {
        userApi.datas().then(res => {
          data.userList.value = res.data
        })
        organApi.getTreeAllAndUser().then(res => {
          data.treeAll.value = res.data.nav
          if (data.treeAll.value) {
            data.treeAll.value[0].select = true
            data.selectRootForm.value = data.treeAll.value[0]
            data.treeData.value = data.treeAll.value[0].children
          }
        })
      },

      lineClick(param) {
        data.selectRootForm.value = param
        data.form.value = {}
        data.treeData.value = param.children
        data.treeAll.value.forEach(item => {
          if (item.id == param.id) {
            item.select = true
          } else {
            item.select = false
          }
        })

      },
      formatUser(id){
        let users = data.userList.value
        let user = users.filter(item => {return item.id == id})
        if (user && user[0]){
          return user[0].username
        }
        return ""
      },
      /*创建群聊*/
      addGroup(){},
      /*
     * 树型控件点击事件
     * */
      treeeNodeClick(datas, node, TreeNode, e) {
        data.form.value = datas
        if (data.form.value.userId){
          let users = data.userList.value
          let user = users.filter(item => {return item.id == data.form.value.userId})
          if (user && user[0]){
            data.form.value = user[0]
          }
        }
      },
      /*
      * 数过滤函数
      * */
      filterNode(value, datas) {
        if (!value) return true
        return datas.name.indexOf(value) != -1
      },
      treeSearch() {
        treeRef.value.filter(data.searchForm.name)
      },
      sendMessClick(){
        let user = data.form.value
        router.push({
          path: '/modules/messages',
          query: user,
        })
      },
    }

    return {
      proxy,
      router,
      treeRef,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>