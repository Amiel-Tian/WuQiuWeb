<template>
  <page-title title="人员管理"></page-title>
  <el-card>
    <el-form :model="searchForm" label-width="120px">
      <el-row justify="start" style="margin: .5rem">
        <el-col :span="5">
        </el-col>
        <el-col :span="5">
        </el-col>
        <el-col :span="5">
        </el-col>
        <el-col :span="5">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-row justify="center">
            <el-button type="primary" @click="getTableData()">搜索</el-button>
            <el-button @click="searchForm = {}; getTableData()">清空</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-row justify="start" style="margin: .5rem">
      <el-button type="primary" v-permission="['sys:user:save']">新建用户</el-button>
      <el-row justify="end" align="middle" style="flex: 1">
        <el-tooltip
            effect="dark"
            content="刷新"
            placement="top-start"
        >
          <el-icon class="op-btn" @click="refreshClick">
            <Refresh/>
          </el-icon>
        </el-tooltip>
      </el-row>
    </el-row>
    <el-row>
      <el-table v-loading="tableDataLoad" :data="tableData" @selection-change="handleSelectionChange" border stripe style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="55" label="序号"/>
        <el-table-column prop="name" label="角色名" show-overflow-tooltip/>
        <el-table-column prop="code" label="角色编码" show-overflow-tooltip>
          <template #default="scope">
            <el-tag>{{ scope.row.code }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button v-permission="['sys:user:update']" size="small" @click="">编辑</el-button>
            <el-popconfirm
                @confirm="confirmDelete"
                title="确认删除?">
              <template #reference>
                <el-button v-permission="['sys:user:delete']" size="small" type="danger" @click="">删除</el-button>
              </template>
            </el-popconfirm>
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
import {ElMessage, ElMessageBox} from 'element-plus';

import userApi from "@/api/sys/user"

export default {
  name: "index",
  props: [],
  emits: [],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const {proxy} = getCurrentInstance();
    let data = {
      statusList: ref([]),
      tableData: ref([]),
      tableSelect: ref([]),
      tableDataLoad: ref(false),
      page: ref({
        small: true, //是否小型
        onepage: true, //是否一页不显示
        background: true, //是否有背景
        // sizes: , //多少条分页
        pageSize: 10, // 目前分页数
        pageNum: 1, //目前页数
        total: 0,//总数
      }),
      searchForm: ref({}),
      search: ref({}),
    }
    //监听
    watch(() => [props.info], ([newInfo], [oldInfo]) => {
      // if (newInfo){
      //   Object.assign(data.form, newInfo)
      // content.emit('update:info',newInfo)
      // }
    })
    onMounted(async () => {
      methods.getTableData()
    })
    let methods = {
      loadDictList(){
        let statusList = proxy.$tools.selectDict(proxy.$appConfig.STATUS)
        data.statusList.value = statusList
      },
      /*
      * 页数改变
      *
      * */
      handleSizeChange(number) {
        methods.getTableData()
      },
      /*
      * 分页数改变
      *
      * */
      handleCurrentChange(number) {
        methods.getTableData()
      },

      /*
      * 刷新点击
      *
      * */
      refreshClick() {
        methods.getTableData();
      },
      /*表格选择事件*/
      handleSelectionChange(val){
        data.tableSelect.value = val;
      },
      clearSearchForm(){},
      /*
      * 获取列表
      *
      * */
      getTableData() {
        data.tableDataLoad.value = true
        let param = {}
        param = Object.assign(param, data.page.value)
        param = Object.assign(param, data.searchForm.value)

        userApi.page(param).then(res => {
          data.tableData.value = res.data.records
          data.page.value.total = res.data.total
        }).finally(() => {
          data.tableDataLoad.value = false
        })
      },

      /*
      * 确认删除
      *
      * */
      confirmDelete() {
      },
    }

    return {
      proxy,
      router,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>