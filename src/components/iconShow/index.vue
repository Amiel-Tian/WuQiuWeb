<template>
  <ul class="icon-ul">
    <li class="icon-li" v-for="(name,index) in icons" @click="iconClick(name)">
      <div class="icon-box">
        <el-icon style="font-size: 20px;">
          <component :is="name" :index="index" :key="index"></component>
        </el-icon>
        <span>{{ name }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
import * as ElIcons from '@element-plus/icons'
import {reactive, ref, toRefs} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';

export default {
  components: {
    ...ElIcons
  },
  name: "index",
  props: ["icon"],
  emits: ["update:icon", "success"],
  setup(props, content) {
    const getData = () => {
      let icons = []
      for (const name in ElIcons) {
        icons.push(name)
      }
      return icons
    }
    const iconList = reactive({
      icons: getData()
    })
    const iconClick = function (name) {
      content.emit('update:icon', name)
      ElMessage.success("选择成功")
      content.emit('success', name)
    }
    return {
      iconClick,
      ...toRefs(iconList)
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-ul {
  overflow: hidden;
  list-style: none;
  padding: 0 !important;
  border-top: 1px solid var(--el-border-color);
  border-left: 1px solid var(--el-border-color);
  border-radius: 4px;
  display: grid;
  grid-template-columns: repeat(5, 20%);

  .icon-li {
    text-align: center;
    color: var(--el-text-color-regular);
    height: 90px;
    font-size: 13px;
    border-right: 1px solid var(--el-border-color);
    border-bottom: 1px solid var(--el-border-color);
    transition: background-color var(--el-transition-duration);

    :hover {
      background-color: var(--el-border-color-extra-light);
    }

    .icon-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>

