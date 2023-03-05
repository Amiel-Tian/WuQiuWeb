<template>
  <template v-for="(item) in menuList">
    <el-menu-item v-if=" item && item.type == '1'" @click="menuClick" :name="item.name" :index="item.path">
      <el-icon>
        <component v-if="item.icon" :is="item.icon"/>
      </el-icon>
      <span  class="text-overlength">{{ item.name }}</span>
    </el-menu-item>
    <el-sub-menu v-if="item && item.type == '0'" :index="item.id + ''">
      <template #title>
        <el-icon>
          <component v-if="item.icon" :is="item.icon"/>
        </el-icon>
        <span  class="text-overlength">{{ item.name }}</span>
      </template>
      <menu-tree @menuClick="menuClickTree" v-if="item.children" :menu-list="item.children"></menu-tree>
    </el-sub-menu>
  </template>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";

export default {
  name: "menuTree",
  props: ["menuList"],
  emits: ["update:menuList","menuClick"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    let data = {}
    //监听
    watch(() => [props.menuList], ([newMenuList], [oldMenuList]) => {

    })
    onMounted(async () => {
    })
    let methods = {
      menuClick(e){
        let datas = props.menuList
        if (e.name){
        }
        let fil = datas.filter(f => {return f.path == e.index})
        if (fil && fil.length > 0){
          content.emit('menuClick',fil[0])
          return
        }
        content.emit('menuClick',e)
      },
      menuClickTree(e){
        content.emit('menuClick',e)
      }
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

</style>