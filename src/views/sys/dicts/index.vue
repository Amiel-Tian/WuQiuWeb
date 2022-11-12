<template>
  <page-title :title="router.currentRoute.value.meta.title"></page-title>

  <el-card>
    <el-form :model="form" label-width="120px">
      <el-row justify="start" style="margin: .5rem">
        <el-col :span="5">
          <!--          <el-form-item label="角色名称">-->
          <!--            <el-input v-model="form.name" placeholder="请输入角色名称" clearable/>-->
          <!--          </el-form-item>-->
        </el-col>
        <el-col :span="5">
        </el-col>
        <el-col :span="5">
        </el-col>
        <el-col :span="5">
        </el-col>
        <el-col :span="4">
          <el-row justify="center">
            <el-button @click="">搜索</el-button>
            <el-button @click="">清空</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <el-row justify="start" style="margin: .5rem">
      <el-button type="primary" v-permission="['sys:dict:save']" @click="addClick">新建字典</el-button>
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
        <el-table-column prop="dictName" label="字典名" show-overflow-tooltip/>
        <el-table-column prop="dictType" label="字典编码" show-overflow-tooltip/>
        <el-table-column prop="cascaded" label="是否级联" show-overflow-tooltip>
          <template #default="scope">
            <el-tag >{{ proxy.$tools.selectDictLabel(proxy.$appConfig.DICTTREE,scope.row.cascaded) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isSys" label="字典类型" show-overflow-tooltip>
          <template #default="scope">
            <el-tag>{{ proxy.$tools.selectDictLabel(proxy.$appConfig.DICTTYPE,scope.row.isSys) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" show-overflow-tooltip>
          <template #default="scope">
            <el-tag>{{ proxy.$tools.selectDictLabel(proxy.$appConfig.STATUS,scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button v-permission="['sys:dict:update']" size="small" @click="editClick(scope.row)">编辑</el-button>
            <el-button v-permission="['sys:dict:data']" size="small" type="primary"  @click="dataClick(scope.row)">字典项</el-button>
            <el-popconfirm
                @confirm="confirmDelete(scope.row)"
                title="确认删除?">
              <template #reference>
                <el-button v-permission="['sys:dict:delete']" size="small" type="danger" @click="">删除</el-button>
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
  <dict-data v-model:drawer="drawerData" :id="form.id" ></dict-data>
</template>

<script>
import {ref,unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";

import operation from "@/views/sys/dicts/operation"
import dictData from "@/views/sys/dicts/operation/dictData"
import userApi from "@/api/sys/user";
import dictType from "@/api/sys/dictType";
import roleApi from "@/api/sys/role";
import {ElMessage} from "element-plus";

export default {
  name: "index",
  props:[],
  emits:[],
  components:{
    operation,
    dictData
  },
  setup(props ,content){
    const router = useRouter()
    const {proxy} = getCurrentInstance();
    let data = {
      form: ref({}),
      tableData: ref([]),
      tableSelect: ref([]),
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

      drawer: ref(false),
      drawerData: ref(false),
    }
    //监听
    watch(() => [props.info], ([newInfo],[oldInfo]) => {
      // if (newInfo){
      //   Object.assign(data.form, newInfo)
      // content.emit('update:info',newInfo)
      // }
    })
    onMounted(async () => {
      methods.getTableData();
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
      /*
      * 获取列表
      *
      * */
      getTableData() {
        data.tableDataLoad.value = true
        let param = {}
        param = Object.assign(param, data.page)

        dictType.page(param).then(res => {
          data.tableData.value = res.data.records
          data.page.total = res.data.total
        }).finally(() => {
          data.tableDataLoad.value = false
        })
      },
      /*点击新增*/
      addClick() {
        data.form.value = {}
        data.drawer.value = true
      },
      /*点击编辑*/
      editClick(row) {
        data.form.value = row
        data.drawer.value = true
      },
      /*点击数据*/
      dataClick(row){
        data.form.value = row
        data.drawerData.value = true
      },

      /*
      * 确认删除
      *
      * */
      confirmDelete(row) {
        let param = row
        dictType.remove(param).then(res => {
          if (res.success){
            ElMessage.success(res.msg)
          }else{
            ElMessage.warning(res.msg)
          }
          this.getTableData()
        })
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