<template>
  <el-card>
    <el-form :model="searchForm" label-width="120px">
      <el-row justify="start" style="margin: .5rem">
        <el-col :span="5">
        </el-col>
        <el-col :span="5">
        </el-col>
        <el-col :span="5">
          <el-form-item label="角色名">
            <el-input v-model="searchForm.name" placeholder="请输入角色名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="角色编码">
            <el-input v-model="searchForm.code" placeholder="请输入角色编码" clearable/>
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
      <el-button type="primary" @click="addClick()" v-permission="['sys:role:save']">新建角色</el-button>
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
        <el-table-column prop="name" label="角色名" show-overflow-tooltip/>
        <el-table-column prop="code" label="角色编码" show-overflow-tooltip>
          <template #default="scope">
            <el-tag>{{ scope.row.code }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag :type="scope.row.status == '0' ? 'info' : ''">{{ proxy.$tools.selectDictLabel(proxy.$appConfig.STATUS,scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button v-permission="['sys:role:update']" size="small" @click="editClick(scope.row)">编辑</el-button>
            <el-popconfirm
                @confirm="confirmStatus(scope.row)"
                title="是否更改状态?">
              <template #reference>
                <el-button v-permission="['sys:role:status']" size="small"
                           :type="scope.row.status == '1' ? 'warning' : 'primary'" @click="">
                  {{ scope.row.status == '1' ? '停用' : '启用' }}
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
                @confirm="confirmDelete(scope.row)"
                title="确认删除?">
              <template #reference>
                <el-button v-permission="['sys:role:delete']" size="small" type="danger" @click="">删除</el-button>
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
import roleApi from "@/api/sys/role";

import operation from "@/views/sys/role/operation"
import userApi from "@/api/sys/user";
import {ElMessage} from "element-plus";

export default {
  name: "sys/roles",
  props: [],
  emits: [],
  components: {operation},
  setup(props, content) {
    const router = useRouter()
    const {proxy} = getCurrentInstance();
    let data = {
      tableData: ref([]),
      tableDataLoad: ref(false),
      form: ref({}),
      searchForm: ref({}),
      page: ref({
        small: true, //是否小型
        onepage: true, //是否一页不显示
        background: true, //是否有背景
        // sizes: , //多少条分页
        pageSize: 10, // 目前分页数
        pageNum: 1, //目前页数
        total: 0,//总数
      }),

      drawer: ref(false),

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
      refreshClick() {
        methods.getTableData();
      },

      /*获取列表*/
      getTableData() {
        data.tableDataLoad.value = true
        let param = {}
        param = Object.assign(param, data.page.value)
        param = Object.assign(param, data.searchForm.value)

        roleApi.page(param).then(res => {
          data.tableData.value = res.data.records
          data.page.value.total = res.data.total
        }).finally(() => {
          data.tableDataLoad.value = false
        })
      },

      /*
      * 确认删除
      * */
      confirmDelete(row) {
        let param = row
        roleApi.remove(param).then(res => {
          if (res.success){
            ElMessage.success(res.msg)
          }else{
            ElMessage.warning(res.msg)
          }
          this.getTableData()
        })
      },
      /*确认修改*/
      confirmStatus(row) {
        let param = row
        if (param.status == "0") {
          param.status = "1"
        } else {
          param.status = "0"
        }
        roleApi.update(param).then(res => {
          if (res.success) {
            ElMessage.success(res.msg)
          } else {
            ElMessage.warning(res.msg)
          }
          this.getTableData()
        })
      },
      addClick() {
        data.form.value = {}
        data.drawer.value = true
      },
      editClick(row) {
        data.form.value = row
        data.drawer.value = true
      },
    }

    return {
      router,
      proxy,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>