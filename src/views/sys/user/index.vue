<template>
  <page-title title="人员管理"></page-title>
  <el-card>
    <el-row justify="start" style="margin: .5rem">
      <el-button type="primary" @click="addClick()" v-permission="['sys:user:save']">新建用户</el-button>
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
      <el-table v-loading="tableDataLoad" :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" width="55" label="序号"/>
        <el-table-column prop="username" label="用户名" show-overflow-tooltip/>
        <el-table-column prop="loginname" label="登录名" show-overflow-tooltip/>
        <el-table-column prop="statu" label="状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag>{{ scope.row.statu }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" show-overflow-tooltip/>
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button v-permission="['sys:user:update']" size="small" @click="editClick(scope.row)">编辑</el-button>
            <el-popconfirm
                @confirm="confirmStatus"
                title="是否更改状态?">
              <template #reference>
                <el-button v-permission="['sys:user:statu']" size="small" :type="scope.row.statu == '1' ? 'warning' : 'primary'" @click="">
                  {{ scope.row.statu == '1' ? '停用' : '启用' }}</el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
                @confirm="confirmDelete"
                title="确认删除?">
              <template #reference>
                <el-button v-permission="['sys:user:delete']" size="small" type="danger" @click="removeClick()">删除</el-button>
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

  <operation v-model:drawer="drawer" :id="form.id" @success="drawer = false;getTableData()"></operation>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";

import userApi from "@/api/sys/user"
import operation from "@/views/sys/user/operation"
export default {
  name: "index",
  props: [],
  emits: [],
  components: {operation},
  setup(props, content) {
    const router = useRouter()
    let data = {
      tableData: ref([]),
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

      form: ref({}),
      drawer: ref(false)
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
      /*
      * 页数改变
      *
      * */
      handleSizeChange(number) {
        methods.getTableData()
      },
      /*
      * 分页数改变
      * */
      handleCurrentChange(number) {
        methods.getTableData()
      },

      /*
      * 刷新点击
      * */
      refreshClick(){
        methods.getTableData();
      },

      /*获取列表*/
      getTableData() {
        data.tableDataLoad.value = true
        let param = {}
        param = Object.assign(param, data.page.value)

        userApi.page(param).then(res => {
          data.tableData.value = res.data.records
          data.page.value.total = res.data.total
        }).finally(() => {
          data.tableDataLoad.value = false
        })
      },

      /*确认删除按键*/
      confirmDelete() {
      },
      /*确认修改*/
      confirmStatus() {
      },

      addClick(){
        data.form.value= {}
        data.drawer.value = true
      },
      editClick(row){
        data.form.value = row
        data.drawer.value = true
      },
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