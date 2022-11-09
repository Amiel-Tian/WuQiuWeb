<template>
  <page-title title="任务书"></page-title>
  <el-card >
    <operation :info="form" @success="getTableData()"></operation>
  </el-card>

  <el-card>
    <el-divider content-position="left">记录列表</el-divider>
    <el-row justify="start" style="margin: .5rem">
      <el-link type="primary" @click="copyAll">批量复制</el-link>
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
        <el-table-column prop="contractNo" label="合同编号" show-overflow-tooltip />
        <el-table-column prop="customerName" label="客户名称" show-overflow-tooltip />
        <el-table-column prop="applicant" label="申请人" show-overflow-tooltip />
        <el-table-column prop="recipient" label="接收人" show-overflow-tooltip />
        <el-table-column prop="startDate" label="开始时间" show-overflow-tooltip />
        <el-table-column prop="endDate" label="结束时间" show-overflow-tooltip />
        <el-table-column prop="workTime" label="工作时长" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" >
          <template #default="scope">
            <el-button size="small" @click="editClick(scope.row)">编辑</el-button>
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
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";
import userApi from "@/api/sys/user";
import {ElMessage} from "element-plus";

import operation from "@/views/model/renwushu/operation"
import renwuApi from "@/api/model/renwu";
import useClipboard from "vue-clipboard3";
export default {
  name: "index",
  props: [],
  emits: [],
  components: {
    operation,
  },
  setup(props, content) {
    const router = useRouter()
    const { toClipboard } = useClipboard()

    let data = {
      userInfo: ref({}),
      form: ref({}),
      search: ref({}),
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

    }
    //监听
    watch(data.form, () => {

    })
    onMounted(async () => {
      methods.getUserInto();
      methods.getTableData();
    })
    let methods = {
      getUserInto() {
        userApi.getUserInfo().then(res => {
          data.userInfo.value = res
        })
      },

      handleSizeChange(){},
      handleCurrentChange(){},
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
        param = Object.assign(param, data.search.value)

        renwuApi.datas(param).then(res => {
          data.tableData.value = res.data
          data.page.value.total = 0
        }).finally(() => {
          data.tableDataLoad.value = false
        })
      },
      /*表格选择事件*/
      handleSelectionChange(val){
        data.tableSelect.value = val;
      },

      /*
      * 编辑
      * */
      editClick(row){
        data.form.value = row
      },
      /*确认删除*/
      confirmDelete(row){
        renwuApi.remove(row).then(res => {
          if (res.success) {
            ElMessage.success(res.msg)
          }else{
            ElMessage.warning(res.msg)
          }
          this.getTableData()
        })
      },
      /*批量复制*/
      async copyAll() {
        let copyDate = "";
        if (data.tableData.value) {
          data.tableData.value.forEach(item => {
            copyDate += item.contractNo || ""
            copyDate += item.customerName ? " " + item.customerName : ""
            copyDate += item.applicant ? "_" + item.applicant : ""
            copyDate += item.recipient ? "to" + item.recipient : ""
            copyDate += item.startDate ? " " + item.startDate : ""
            copyDate += item.endDate ? "-" + item.endDate : ""
            copyDate += item.workTime ? " " + item.workTime + "小时" : ""
            copyDate += item.context ? "\n" + item.context + "" : ""
            copyDate += "\n";
            copyDate += "\n";
          })
        }
        try {
          await toClipboard(copyDate)
          ElMessage.success("复制成功");
        } catch (e) {
          ElMessage.error("复制失败" + e);
        }

      },
    }

    return {
      router,
      toClipboard,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>