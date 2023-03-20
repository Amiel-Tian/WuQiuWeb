<template>
  <!--
  {{ proxy.$tools.selectDictLabel(proxy.$appConfig.STATUS,scope.row.status) }}
  v-permission="['sys:dict:update']"
  -->
  <el-dialog
      v-model="drawer"
      title="创建群聊"
      width="30%"
      draggable
      :before-close="handleClose"
  >
    <el-row style="height: 25rem;">
      <el-col :span="12" class="flex-column box" style="border-right: 1px solid rgb(229, 230, 231);">
        <el-input
            v-model="searchForm.name"
            placeholder="搜索"
            class="input-with-select"
            @input="treeSearch()"
        >
          <template #prepend>
            <el-button icon="Search"/>
          </template>
        </el-input>
        <el-scrollbar>
          <el-tree
              ref="treeRef"
              :data="treeAll"
              :props="treeProps"
              node-key="id"
              highlight-current
              show-checkbox
              :expand-on-click-node="false"
              @check="handleCheck"
              @check-change="handleCheckChange"
              :filter-node-method="filterNode"
              :render-after-expand="false"
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
        </el-scrollbar>
      </el-col>
      <el-col :span="12" class="flex-column box">
        <div class="check-num" v-if="checkUsers && checkUsers.filter(f => {return f.userId}) && checkUsers.filter(f => {return f.userId}).length > 0">已选择{{checkUsers.filter(f => {return f.userId}).length}}个联系人</div>
        <div style="flex: 1;overflow:hidden;">
          <el-scrollbar>
            <div v-for="(item, index) in checkUsers">
              <div class="check-user" v-if="item.userId">
                <div class="user-icon"></div>
                <div class="user-name">{{ formatUser(item.userId) }}</div>
                <div class="user-del">
                  <el-icon @click.stop="removeTab(item, index)" class="tag-coles">
                    <Close/>
                  </el-icon>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div style="display: flex;justify-content: center;">
          <el-button type="primary" @click="subment" style="width: 8rem;">
            创建群聊
          </el-button>
          <el-button @click="handleClose" style="width: 8rem;">取消</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>

</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router";
import userApi from "@/api/sys/user";

export default {
  name: "index",
  props: ["drawer", "treeAll"],
  emits: ["update:drawer"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const {proxy} = getCurrentInstance();

    const treeRef = ref();
    let data = {
      userList: ref([]),
      searchForm: ref({}),
      treeProps: {
        children: 'children',
        label: 'name',
      },
      checkUsers: ref([]),//选择的user对象
      userInfo: ref({}),
      checkedChange: ref({}),//当前选择的节点信息
    }
    //监听
    watch(() => [props.drawer], ([drawer]) => {
      content.emit('update:drawer', drawer)
    })
    onMounted(async () => {
      await methods.getUserInfo()
      methods.load()
    })
    let methods = {
      async getUserInfo() {
        await userApi.getUserInfo().then(res => {
          data.userInfo.value = res.data
        })
      },
      load() {
        userApi.datas().then(res => {
          data.userList.value = res.data
        })
      },
      handleClose() {
        content.emit('update:drawer', false)
      },
      formatUser(id) {
        let users = data.userList.value
        let user = users.filter(item => {
          return item.id == id
        })
        if (user && user[0]) {
          return user[0].username
        }
        return ""
      },
      /**
   * 树型控件选择事件
   * 先执行CheckChange
   * */
      handleCheckChange(checkedNodes, change, childChange){
        data.checkedChange.value={
          checkedNodes : checkedNodes,
          change : change,
        }
      },
      handleCheck(checkedNodes,checkedKeys,halfCheckedNodes,halfCheckedKeys) {
        let checkedChange = data.checkedChange.value

        let ids = []
        //如果当前选择的是用户，操作所有相同用户状态
        if (checkedChange.checkedNodes.userId){
          let tree = JSON.parse(JSON.stringify(props.treeAll))
          let checkIds = checkedKeys.checkedNodes.map((item, index) => {
            return item.userId
          }).join(",").split(',')

          if (checkedChange.change){
            ids = methods.treeRepeatId(tree, checkIds, "")
          }else{
            ids = methods.treeRepeatId(tree, checkIds, checkedChange.checkedNodes.userId)
          }
          console.log(ids, checkIds, tree, checkedChange)
          treeRef.value.setCheckedKeys(ids, false)
        }

        //获取选择的用户
        let checkUsers = []
        for (const node of checkedKeys.checkedNodes) {
          if (checkUsers.filter(f => {return f.userId == node.userId}).length == 0 && ids.indexOf(node.id) > -1){
            checkUsers.push(node)
          }
        }
        data.checkUsers.value = checkUsers
      },
      /**返回树中相同userid的id，或去掉相同userid的id
      * @param tree 树
      * @param checkId 选择的所有userId
      * @param nocheckId 取消选择的userId
      * */
      treeRepeatId(tree, checkId, nocheckId) {
        let ids = []
        if (tree) {
          for (let item of tree) {
            if (item.children && item.children.length > 0) {
              let childIds = methods.treeRepeatId(item.children, checkId, nocheckId)
              ids = ids.concat(childIds)
            } else {
              if (item.userId && checkId.indexOf(item.userId) > -1 && nocheckId != item.userId) {
                ids.push(item.id)
              }
            }
          }
        }
        return ids
      },
      /**
      * 数过滤函数
      * */
      filterNode(value, datas) {
        if (!value) return true
        return methods.formatUser(datas.userId).indexOf(value) != -1
      },
      treeSearch() {
        treeRef.value.filter(data.searchForm.value.name)
      },
      /*删除用户*/
      removeTab(item, index){
        let checkUsers =  data.checkUsers.value

        let checkIds = checkUsers.map((item, index) => {
          return item.userId
        }).join(",").split(',')
        let tree = JSON.parse(JSON.stringify(props.treeAll))
        let ids = methods.treeRepeatId(tree, checkIds, item.userId)
        let users = checkUsers.filter(f => {return f.userId != item.userId})
        data.checkUsers.value = users
        treeRef.value.setCheckedKeys(ids, false)
      },
      subment(){
        let checkUserIds =  []
        let checkUsers =  data.checkUsers.value
        let groupName = ""
        let checkUserNames = []

        //只保留用户
        checkUsers = data.checkUsers.value.filter(f => {return f.userId})

        if (checkUsers && checkUsers.length > 0) {
          checkUserNames = checkUsers.map((item, index) => {
            return methods.formatUser(item.userId)
          }).join(",").split(',')
          if (checkUserNames.length > 3){
            groupName = checkUserNames.slice(0.3).join("、")
          }else {
            groupName = checkUserNames.join("、")
          }
          checkUserIds = checkUsers.map((item, index) => {
            return item.userId
          }).join(",").split(',')
          if (checkUserIds.indexOf(data.userInfo.value.id) == -1){
            checkUserIds.push(data.userInfo.value.id)
            groupName += "、" + data.userInfo.value.username
          }
          if (checkUserIds && checkUserIds.length > 0) {
            let param = {
              username : groupName,
              type: "group",
              users: checkUserIds.join(",")
            }
            userApi.add(param).then(res => {
              if (res.success) {
                ElMessage.success(res.msg);
              }else{
                ElMessage.warning(res.msg);
              }
            },err => {
              ElMessage.error(err);
            })
          }
        }

        methods.handleClose()
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
.box{
  padding: .5rem;
}
.check-num{
  font-weight: bold;
}
.check-user{
  display: flex;
  padding: .5rem .1rem;
  justify-content: space-between;

  .user-name{
    flex: 1;
  }
  .user-del{
    padding: 0 .5rem;

    .tag-coles{
      border-radius: 1rem;
      margin: .1rem 0 0 .5rem;
      &:hover{
        color: #FFFFFF;
        background-color: #a8abb2;
      }
    }
  }
  &:hover{
    background-color: var(--hover-color);
  }
}
</style>