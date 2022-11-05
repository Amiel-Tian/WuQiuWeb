<template>
  <el-container style="height: 100%;">

    <el-aside :width="menuRightCollapse ? 'auto' : '220px'" class="aside">
      <el-scrollbar>
        <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            text-color="#fff"
            class="el-menu-vertical-demo"
            default-active="1"
            :collapse="menuRightCollapse"
            :router="true"
            :default-active="routerPath"
        >
          <menu-tree v-model:menu-list="menuList"></menu-tree>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>

      <el-header>
        <el-menu
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
        >
          <el-menu-item index="0" @click="menuRightCollapse = !menuRightCollapse">_
            <el-icon @click="">
              <Menu/>
            </el-icon>
          </el-menu-item>

          <div class="flex-grow"/>
          <!--    <el-menu-item index="1"></el-menu-item>-->
          <el-sub-menu index="2">
            <template #title>{{ userInfo.username }}</template>
            <el-menu-item index="2-1" @click="onSubmit">退出登录</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-header>

      <el-main>
        <router-view name="index"></router-view>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";

import userApi from "@/api/sys/user";
import menuApi from "@/api/sys/menu";
import menuTree from "@/views/menu/menuTree";

export default {
  name: "index",
  props: [],
  emits: [],
  components: {menuTree},
  setup(props, content) {
    const router = useRouter()
    const routerPath = ref(router.currentRoute.value.path)

    let data = {
      routerPath: ref(""),
      userInfo: reactive({
        username: "--"
      }),
      menuList: ref([]),
      menuRightCollapse: ref(false),
    }
    //监听
    watch(() => [props.info], ([newInfo], [oldInfo]) => {

    })
    onMounted(async () => {
      methods.getUserInto()
    })
    let methods = {
      getUserInto() {
        userApi.getUserInfo().then(res => {
          Object.assign(data.userInfo, res)
        })
        menuApi.getNav().then(resnav => {
          data.menuList.value = resnav.data.nav
        })
      },

      onSubmit() {
        userApi.logout()
      }
    }

    return {
      router,
      routerPath,
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
.el-main{
  --el-main-padding: .5rem 1rem;
}
.el-header {
  padding: 0;
}
</style>