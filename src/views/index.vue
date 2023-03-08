<template>
  <el-container v-loading="loading" style="height: 100%;">

    <el-aside :width="menuRightCollapse ? 'auto' : '220px'" class="aside">
      <el-scrollbar>
        <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            text-color="#fff"
            class="el-menu-vertical-demo"
            :collapse="menuRightCollapse"
            :router="true"
            :default-active="routerPath"
        >
          <menu-tree v-model:menu-list="menuList"></menu-tree>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>

      <el-header style="height: auto">
        <div>
          <el-menu
              class="el-menu-demo"
              mode="horizontal"
              :ellipsis="false"
          >
            <el-menu-item index="0" @click="menuRightCollapse = !menuRightCollapse">
              <div>
                <el-icon>
                  <Fold v-show="!menuRightCollapse"/>
                  <Expand v-show="menuRightCollapse"/>
                </el-icon>
              </div>
            </el-menu-item>

            <div class="flex-grow flex-center">
              <div >
                {{route.meta.title}}
              </div>
            </div>
            <el-sub-menu index="2">
              <template #title>{{ userInfo.username }}</template>
              <el-menu-item index="2-1" @click="toPersonal">个人信息</el-menu-item>
              <el-menu-item index="2-5" @click="onSubmit">退出登录</el-menu-item>
            </el-sub-menu>
          </el-menu>
          <div class="tags-box-scroll" ref="tagsBoxScrollBoxRef" @wheel="handleScroll">
            <el-scrollbar ref="tagsBoxScrollRef">
              <div class="tags-box" ref="tagsBoxRef">
                <div v-for="(item, index) in editableTabs" @click="tabClick(item)"
                     :class="item.name == editableTabsValue ? 'tag-box flex-center tag-box-active' : 'tag-box flex-center'">
                  <div class="tag-dian"></div>
                  <div class="tag-message">{{ item.title }}</div>
                  <el-icon @click.stop="removeTab(item, index)" class="tag-coles">
                    <Close/>
                  </el-icon>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-header>

      <el-main>
        <router-view name="index" v-slot="{ Component }">
          <keep-alive ref="keepAliveRef" :include="includeList">
            <component :is="Component" :key="route.name" v-if="route.meta.keepalive" />
          </keep-alive>
          <component :is="Component" :key="route.name" v-if="!route.meta.keepalive" />
        </router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted, onBeforeUnmount, computed, onActivated} from "vue";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";

import userApi from "@/api/sys/user";
import menuApi from "@/api/sys/menu";
import menuTree from "@/views/sys/menu/menuTree";
import dictTypeApi from "@/api/sys/dictType";

import websocket from "@/utils/websocket";
import {ElScrollbar} from "element-plus";
export default {
  name: "index",
  props: [],
  emits: [],
  components: {menuTree},
  setup(props, content) {
    const router = useRouter()
    const route = useRoute()

    const tagsBoxScrollBoxRef = ref()
    const tagsBoxScrollRef = ref()
    const tagsBoxRef = ref()
    const keepAliveRef = ref()
    let data = {
      routerPath: ref(router.currentRoute.value.path),
      userInfo: ref({
        username: "--"
      }),
      menuList: ref([]),
      menuRightCollapse: ref(false),
      loading: ref(false),
      editableTabsValue: ref(""),//打开的路由path
      includeList : ref([]),//历史打开路由name
      editableTabs: ref([]),//历史打开的路由对象
      tagScroll: ref(0),//历史打开的路由对象
      code: ref(106),
    }
    //监听
    watch(() => route,(newVal,oldVal)=>{
      if(newVal.meta.keepalive && data.includeList.value.indexOf(newVal.name) === -1){
        data.includeList.value.push(newVal.name);
      }
      let val = {
        name : newVal.meta.title,
        path : newVal.path,
      }
      methods.menuClick(val)
    },{deep:true}) // 开启深度监听

    onMounted(async () => {
      await methods.getUserInfo()
      //如果状态正常且未连接
      if (!websocket.isConnection() && data.code.value != 106){
          await websocket.connectWebsocket()
      }
      //刷新后路由操作
      methods.routerLoad()
    })
    let methods = {
      async getUserInfo() {
        data.loading.value = true
        await userApi.getUserInfo().then(res => {
          if (res.success) {
            data.userInfo.value = res.data
            data.code.value = res.code
          }
        })
        await menuApi.getNav().then(resnav => {
          if (resnav.success) {
            data.menuList.value = resnav.data.nav
            sessionStorage.setItem('permission', resnav.data.authoritys)
            data.loading.value = false
          }
        })
        await  dictTypeApi.getTreeDict().then(resdict => {
          if (resdict.success) {
            sessionStorage.setItem('dictionaries', JSON.stringify(resdict.data))
          }
        })
      },

      routerLoad(){
        let rou = router.currentRoute.value
        if(rou && rou.meta.keepalive && data.includeList.value.indexOf(rou.name) === -1){
          rou.title = rou.meta.title
          rou.content = rou.path
          data.editableTabsValue.value = rou.path;
          data.includeList.value.push(rou.name)
          rou.name = rou.path
          data.editableTabs.value.push(rou)
        }
      },
      onSubmit() {
        websocket.closeWebSocket()
        userApi.logout()
      },
      toPersonal() {
        router.push({
          path: '/sys/user/personal',
        })
      },
      menuClick(e) {
        let fil = data.editableTabs.value.filter(f => {
          return f.name == e.path
        })
        if (fil && fil.length > 0) {
          data.editableTabsValue.value = e.path
        } else {
          data.editableTabs.value.push({
            title: e.name,
            name: e.path,
            content: e.path,
          })
          data.editableTabsValue.value = e.path
          setTimeout(() => {
            let scorWidth = tagsBoxScrollBoxRef.value.clientWidth
            let boxWidth = tagsBoxRef.value.clientWidth
            if (boxWidth > scorWidth){
              let tag = boxWidth - scorWidth
              data.tagScroll.value = tag
              tagsBoxScrollRef.value.setScrollLeft(tag)
            }
          }, 20)

        }

      },
      tabClick(tabsPaneContext) {
        data.editableTabsValue.value = tabsPaneContext.name
        data.routerPath.value = tabsPaneContext.name
        router.push({
          path: tabsPaneContext.name,
        })
      },
      handleScroll(event){
        const delta = Math.sign(event.deltaY); // 获取鼠标滚动方向，1表示向下滚动，-1表示向上滚动
        let scorWidth = tagsBoxScrollBoxRef.value.clientWidth
        let boxWidth = tagsBoxRef.value.clientWidth
        let tag = JSON.parse(JSON.stringify(data.tagScroll.value))
        if (boxWidth > scorWidth || tag != 0){
          if (delta == 1){
            if (tag < (boxWidth - scorWidth)) {
                data.tagScroll.value = tag + 20
            }
          }else{
            if (tag > 0) {
              if (tag - 10 < 0){
                data.tagScroll.value = 0
              }else{
                  data.tagScroll.value = tag - 20
              }
            }
          }
          tagsBoxScrollRef.value.setScrollLeft(tag)
        }
      },
      removeTab(targetName, index) {
        let tags = data.editableTabs.value;
        let tagsName = data.includeList.value;
        //关掉的是当前打开的
        if (targetName.name == data.editableTabsValue.value){
          if (tags.length > 1){
            let i = index;
            if (index == 0){
              i = index + 1
              router.push({
                path: tags[i].name,
              })
            }else if (index == tags.length-1){
              i = index - 1
              router.push({
                path: tags[i].name,
              })
            }else {
              i = index - 1
              router.push({
                path: tags[i].name,
              })
            }

            data.editableTabsValue.value = tags[i].name
            data.routerPath.value = tags[i].name
          }else{
            router.push({
              path: "/",
            })
          }
        }
        //清除缓存
        const cachedInstances = keepAliveRef.value.cache;
        for (const key in cachedInstances) {
          const cachedInstance = cachedInstances[key].instance;
          if (cachedInstance && cachedInstance.$options.name === targetName.name) {
            cachedInstance.$destroy(); // 销毁指定组件实例，从而清除缓存
          }
        }
        tags.splice(index, 1)
        tagsName.splice(index, 1)
      },
    }
    onBeforeUnmount(() => {
      websocket.closeWebSocket()
    })

    return {
      router,
      route,
      keepAliveRef,
      tagsBoxScrollBoxRef,
      tagsBoxScrollRef,
      tagsBoxRef,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-grow {
  flex-grow: 1;
}

.aside {
  .el-menu {
    height: 100vh;
  }
}

.el-main {
  --el-main-padding: .5rem 1rem;
}

.el-header {
  padding: 0;

  .tags-box-scroll{
    overflow: hidden;
    position: relative;
    white-space: nowrap;
    background-color: #fff;
  }
  .tags-box{
    padding: .1rem;
    display: inline-flex;

    //white-space: nowrap;
    .tag-box{
      cursor: pointer;
      display: inline-flex;
      padding: .5rem 1rem;
      border-left: 1px solid #f4f4f4;
      border-right: 1px solid #f4f4f4;
      color: rgb(51, 51, 51);
      font-size: 14px;
      .tag-dian{
        width: .5rem;
        height: .5rem;
        border-radius: 1rem;
        background-color: #DDDDDDFF;
      }
      .tag-message{
        margin-left: .5rem;
      }
      .tag-coles{
        display: none;
        border-radius: 1rem;
        margin: .1rem 0 0 .5rem;
        &:hover{
          color: #FFFFFF;
          background-color: #a8abb2;
        }
      }

      &:hover{
        color: #4d70ff;
        .tag-dian{
          background-color: #4d70ff;
        }
        .tag-coles{
          display: inline-flex;
        }
      }
    }
    .tag-box-active{
      background-color: rgba(64,158,255,.08);
      color: #4d70ff;
      .tag-dian{
        background-color: #4d70ff;
      }
      .tag-coles{
        display: inline-flex;
      }
      @extend .tag-box
    }
  }
}
</style>