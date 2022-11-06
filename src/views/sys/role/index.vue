<template>
  <page-title title="权限管理"></page-title>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" v-permission="['sys:user:save']">新建权限</el-button>
      </el-col>
      <el-col></el-col>
    </el-row>
    <el-row>
      <el-table v-loading="tableDataLoad" :data="tableData" border stripe style="width: 100%">
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
          <template #default>
            <el-button size="small" @click="">编辑</el-button>
            <el-popconfirm
                @confirm="confirmDelete"
                title="确认删除?">
              <template #reference>
                <el-button size="small" type="danger" @click="">删除</el-button>
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
import {ref,unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";
import roleApi from "@/api/sys/role";

export default {
  name: "index",
  props:[],
  emits:[],
  components:{},
  setup(props ,content){
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

    }
    //监听
    watch(() => [props.info], ([newInfo],[oldInfo]) => {
      // if (newInfo){
      //   Object.assign(data.form, newInfo)
      // content.emit('update:info',newInfo)
      // }
    })
    onMounted(async () => {

    })
    let methods = {
      /*
         * 页数改变
         * */
      handleSizeChange(number){
        methods.getTableData()
      },
      /*
      * 分页数改变
      * */
      handleCurrentChange(number){
        methods.getTableData()
      },

      /*获取列表*/
      getTableData(){
        data.tableDataLoad.value = true
        let param = {}
        param = Object.assign(param, data.page)

        roleApi.page(param).then(res => {
          data.tableData.value = res.data.records
          data.page.total = res.data.total
        }).finally(() => {
          data.tableDataLoad.value = false
        })
      },

      /*
      * 确认删除
      * */
      confirmDelete(){},
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