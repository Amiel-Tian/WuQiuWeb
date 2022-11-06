<template>
  <page-title title="任务书"></page-title>
  <el-card >
    <operation></operation>
  </el-card>

  <el-card ><el-divider content-position="left">记录列表</el-divider></el-card>
  <el-card>
    <el-row>
      <el-table v-loading="tableDataLoad" :data="tableData" stripe style="width: 100%">
        <el-table-column prop="username" label="用户名" show-overflow-tooltip />
        <el-table-column prop="loginname" label="登录名" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" >
          <template #default>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:currentPage="page.pageNum"
          v-model:page-size="page.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :small="page.small"
          :disabled="false"
          :hide-on-single-page="page.onepage"
          :background="page.background"
          layout=" sizes, prev, pager, next, jumper, total"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </el-row>
  </el-card>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";
import userApi from "@/api/sys/user";
import {ElMessage} from "element-plus";

import operation from "@/views/model/renwushu/operation"
export default {
  name: "index",
  props: [],
  emits: [],
  components: {
    operation,
  },
  setup(props, content) {
    const router = useRouter()
    let data = {
      userInfo: reactive({}),
      form: reactive({}),
      tableData: ref([]),
      tableDataLoad: ref(false),
      page: reactive({
        small: true, //是否小型
        onepage: true, //是否一页不显示
        background: true, //是否有背景
        // sizes: , //多少条分页
        pageSize: 10, // 目前分页数
        pageNum: 1, //目前页数
        total: 0,//总数
      }),

    }
    //监听
    watch(data.form, () => {

    })
    onMounted(async () => {
      methods.getUserInto();
    })
    let methods = {
      getUserInto() {
        userApi.getUserInfo().then(res => {
          Object.assign(data.userInfo, res)
        })
      },
      handleSizeChange(){},
      handleCurrentChange(){},
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