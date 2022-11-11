<template>
  <el-drawer
      size="70%"
      v-model="drawer"
      :show-close="false"
  >
    <template #header="{ close, titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">{{form ? form.id ? form.dictName || '编辑' : '新增' : '新增' }}</h4>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left">
          <CircleCloseFilled/>
        </el-icon>
        关闭
      </el-button>
    </template>
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
      <el-button type="primary" v-permission="['sys:user:save']">新建数据</el-button>
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
  </el-drawer>
</template>

<script>
import {useRouter} from "vue-router";
import {onMounted, reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";

import dictType from "@/api/sys/dictType";
import dictData from "@/api/sys/dictData";
import userApi from "@/api/sys/user";
export default {
  name: "index",
  props: ["id","drawer"],
  emits: [ "update:drawer", "success"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    let data = {
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

      search: ref({}),
      form: ref({}),
      btnLoad: ref(false),
    }

    //监听
    watch(() => [props.drawer], ([drawer]) => {
      content.emit('update:drawer', drawer)
      if (drawer) {
        if (props.id) {
          dictType.get(props.id).then(res => {
            data.form.value = res.data || {}
            data.search.value.dictId =data.form.value.id || ""
            methods.getTableData()
          })
        }else{
          data.form.value = {}
        }
      }
    })
    onMounted(async () => {

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
      handleSelectionChange(val) {
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
        param = Object.assign(param, data.search)

        dictData.page(param).then(res => {
          data.tableData.value = res.data.records
          data.page.total = res.data.total
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
      router,
      ...data,
      ...methods
    }
  }
}
</script>

<style scoped>

</style>