<template>
  <div class="page-title">
    <div class="left">
        <el-icon>
          <CollectionTag/>
        </el-icon>
      <div>
        {{ title }}
      </div>
    </div>
    <div class="right">

    </div>
  </div>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";

export default {
  name: "pageTitle",
  props: ["title"],
  emits: ["update:title"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    let data = {}
    //监听
    watch(() => [props.info], ([newInfo], [oldInfo]) => {
      // if (newInfo){
      //   Object.assign(data.form, newInfo)
      // content.emit('update:info',newInfo)
      // }
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
.page-title {
  z-index: 99999;
  color: var(--el-menu-text-color);
  background-color: #f9f9f9;
  border-bottom: 1px solid #e4e7ed;
  padding: 1rem;
  display: flex;
  margin-bottom: 0.1rem;

  .left {
    display: flex;
    align-items: center;

    .el-icon{
      background-color: #545c64;
      color: #fff;
      padding: 0.5rem;
      border-radius: 50%;
      margin-right: .5rem;
    }
  }

  .right {
    flex: 1;
  }
}
</style>