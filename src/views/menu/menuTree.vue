<template>
  <template v-for="(item) in menuList">
    <el-menu-item v-if=" item && item.type == '1'" :index="item.path">
      <el-icon>
        <component v-if="item.icon" :is="item.icon"/>
      </el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>
    <el-sub-menu v-if="item && item.type == '0'" :index="item.id + ''">
      <template #title>
        <el-icon>
          <component v-if="item.icon" :is="item.icon"/>
        </el-icon>
        <span>{{ item.title }}</span>
      </template>
      <menu-tree v-if="item.children" :menu-list="item.children"></menu-tree>
    </el-sub-menu>
  </template>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";

export default {
  name: "menuTree",
  props: ["menuList"],
  emits: ["update:menuList"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    let data = {}
    //监听
    watch(() => [props.menuList], ([newMenuList], [oldMenuList]) => {

    })
    onMounted(async () => {
    })
    let methods = {}

    return {
      router,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>