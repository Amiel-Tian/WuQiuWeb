<template>
  <page-title :title="router.currentRoute.value.meta.title"></page-title>
  <el-card>
    <el-row justify="space-around">
      <el-col :span="treeWidth">
        <el-divider content-position="left">菜单树</el-divider>
        <el-input placeholder="输入搜索" v-model="treeInput" clearable >
          <template #append>
            <el-button icon="Search" @click="treeSearch"/>
          </template>
        </el-input>
        <el-row justify="start" align="middle" style="flex: 1; padding: .5rem">
          <el-tooltip
              effect="dark"
              content="刷新"
              placement="top-start"
          >
            <el-icon class="op-btn" @click="refreshTreeClick">
              <Refresh/>
            </el-icon>
          </el-tooltip>
        </el-row>
        <el-tree
            ref="treeRef"
            :data="treeData"
            :props="treeProps"
            @node-click="treeeNodeClick"
            :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <el-row justify="space-between">
              <div>{{ node.label }}</div>
              <div style="padding:0 1.5rem">
                <el-tag size="small">{{ proxy.$tools.selectDictLabel(proxy.$appConfig.MENUTYPE,data.type) }}</el-tag>
              </div>
            </el-row>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="24-treeWidth-1">
        <el-row v-show="form.name">
          <el-divider content-position="left">详细信息</el-divider>
          <el-descriptions :title="form.name" :column="2" border style="width: 100%;">
            <el-descriptions-item align="center" label="菜单名称：">{{ form.name }}</el-descriptions-item>
            <el-descriptions-item align="center" label="图标：">
              <el-icon>
                <component v-if="form.icon" :is="form.icon"/>
              </el-icon>
            </el-descriptions-item>
            <el-descriptions-item align="center" label="菜单类型：">
              <el-tag size="small">{{ proxy.$tools.selectDictLabel(proxy.$appConfig.MENUTYPE,form.type) }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item align="center" label="排序：">{{ form.sort }}</el-descriptions-item>
            <el-descriptions-item align="center" label="授权编码：">{{ form.perms }}</el-descriptions-item>
            <el-descriptions-item align="center" label="状态：">
              <el-tag>{{ proxy.$tools.selectDictLabel(proxy.$appConfig.STATUS,form.status || "1") }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item align="center" label="菜单地址：">{{ form.path }}</el-descriptions-item>
          </el-descriptions>
        </el-row>
        <el-divider content-position="left" v-if="form.type != '2'">{{ form.name ?'子项列表' : '菜单列表' }}</el-divider>
        <el-row justify="start" style="margin: .5rem">
          <el-link v-permission="['sys:menu:save']" v-if="form.type != '2'" type="primary" @click="addClick()">{{ form.name ?'新增子项' : '新增菜单' }}</el-link>
          <el-link v-permission="['sys:menu:update']" type="warning" @click="editClick(form)" style="margin-left: .5rem">{{ form.name ?'编辑此项' : '' }}</el-link>
          <el-popconfirm
              @confirm="confirmDelete(form)"
              title="确认删除?">
            <template #reference>
              <el-link v-permission="['sys:menu:delete']" type="danger" style="margin-left: .5rem">{{ form.name ?'删除此项' : '' }}</el-link>
            </template>
          </el-popconfirm>
          <el-row justify="end" v-if="form.type != '2'" align="middle" style="flex: 1">
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
        <el-row  v-if="form.type != '2'">
          <el-table v-loading="tableDataLoad" :data="tableData" border stripe style="width: 100%">
            <el-table-column type="index" width="55" label="序号"/>
            <el-table-column prop="name" label="菜单名称" show-overflow-tooltip/>
            <el-table-column prop="sort" label="排序" show-overflow-tooltip/>
            <el-table-column prop="type" label="菜单类型" show-overflow-tooltip>
              <template #default="scope">
                <el-tag>{{ proxy.$tools.selectDictLabel(proxy.$appConfig.MENUTYPE,scope.row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="path" label="菜单地址" show-overflow-tooltip/>
            <el-table-column prop="perms" label="授权编码" show-overflow-tooltip/>
            <el-table-column prop="status" label="状态" show-overflow-tooltip>
              <template #default="scope">
                <el-tag :type="scope.row.status == '0' ? 'info' : ''">{{ proxy.$tools.selectDictLabel(proxy.$appConfig.STATUS,scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="icon" label="菜单图标" show-overflow-tooltip>
              <template #default="scope">
                <el-icon>
                  <component v-if="scope.row.icon" :is="scope.row.icon"/>
                </el-icon>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template #default="scope">
                <el-button v-permission="['sys:menu:update']"  size="small" @click="editClick(scope.row)">编辑</el-button>
                <el-popconfirm
                    @confirm="confirmDelete(scope.row)"
                    title="确认删除?">
                  <template #reference>
                    <el-button v-permission="['sys:menu:delete']"  size="small" type="danger" @click="">删除</el-button>
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
      </el-col>
    </el-row>
  </el-card>

  <operation v-model:drawer="drawer" :id="editId" :parent-id="parentId" @success="drawer = false; refreshTreeClick()"></operation>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {useRouter} from "vue-router";
import menuApi from "@/api/sys/menu";

import operation from "@/views/sys/menu/operation"
import roleApi from "@/api/sys/role";
import {ElMessage} from "element-plus";

export default {
  name: "index",
  props: [],
  emits: [],
  components: {operation},
  setup(props, content) {
    const router = useRouter()
    const {proxy} = getCurrentInstance();
    const treeRef = ref()
    let data = {
      treeWidth: ref(4),
      treeInput: ref(""),
      treeData: ref([]),
      treeProps: {
        children: 'children',
        label: 'name',
      },
      form: ref({}),
      search: ref({}),
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

      editId: ref(""),
      parentId: ref(""),
      drawer: ref(false),
    }
    //监听搜索框
    watch(data.treeInput, (value) => {
      treeRef.value.filter(value)
    })

    onMounted(async () => {
      methods.getNav()
      methods.getTableData()
    })
    let methods = {
      /*
      * 树型控件点击事件
      * */
      treeeNodeClick(datas, node, TreeNode, e) {
        data.form.value = datas
        data.search.value.parentId = datas.id
        methods.getTableData();
      },
      /*
      * 数过滤函数
      * */
      filterNode(value, datas) {
        if (!value) return true
        return datas.name.indexOf(value) != -1
      },
      treeSearch() {
        treeRef.value.filter(data.treeInput)
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
      refreshTreeClick() {
        data.form.value = {}
        data.search.value = {}

        methods.getNav();
        methods.getTableData();
      },

      /*获取列表*/
      getTableData() {
        data.tableDataLoad.value = true
        let param = {}
        param = Object.assign(param, data.page.value)
        param = Object.assign(param, data.search.value)

        menuApi.page(param).then(res => {
          data.tableData.value = res.data.records
          data.page.value.total = res.data.total
        }).finally(() => {
          data.tableDataLoad.value = false
        })
      },

      getNav() {
        menuApi.getNavAll().then(res => {
          data.treeData.value = res.data.nav
        })
      },

      /*
      * 确认删除
      * */
      confirmDelete(row) {
        let param = row
        menuApi.remove(param).then(res => {
          if (res.success){
            ElMessage.success(res.msg)
          }else{
            ElMessage.warning(res.msg)
          }
          this.refreshTreeClick()
        })
      },
      /*
      * 新增
      *
      * */
      addClick() {
        data.editId.value = undefined
        data.parentId.value = data.form.value.id
        data.drawer.value = true
      },
      /*
      * 编辑按钮
      *
      * */
      editClick(row) {
        data.editId.value = row.id
        data.drawer.value = true
      },
    }

    return {
      router,
      proxy,
      treeRef,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>

</style>