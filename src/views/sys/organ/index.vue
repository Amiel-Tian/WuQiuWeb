<template>
  <el-card>
    <el-row justify="space-around">
      <el-col :span="treeWidth">
        <el-divider content-position="left">组织树</el-divider>
        <el-input placeholder="输入搜索" v-model="treeInput" clearable >
          <template #append>
            <el-button icon="Search" @click="treeSearch"/>
          </template>
        </el-input>
        <el-row justify="space-between" align="middle" style="flex: 1; padding: .5rem">
          <el-tooltip
              effect="dark"
              content="刷新"
              placement="top-start"
          >
            <el-icon class="op-btn" @click="refreshTreeClick">
              <Refresh/>
            </el-icon>
          </el-tooltip>

          <el-link v-permission="['sys:organ:save']" type="primary" @click="addClick()">{{'新增' }}</el-link>
        </el-row>
        <el-tree
            ref="treeRef"
            :data="treeData"
            :props="treeProps"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            @node-click="treeeNodeClick"
            :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <el-row justify="space-between">
              <el-tooltip
                  effect="dark"
                  :content="node.label"
                  placement="right-start"
              >
                <div class="text-overlength" style="flex: 1">{{ node.label }}</div>
              </el-tooltip>
              <div style="padding:0 1.5rem">
                <el-tag size="small">{{ data.sort}}</el-tag>
              </div>
            </el-row>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="24-treeWidth-1">
        <el-row v-show="form.name">
          <el-divider content-position="left">详细信息</el-divider>
          <el-descriptions :title="form.name" :column="2" border style="width: 100%;">
            <el-descriptions-item align="center" label="组织名称：">{{ form.name }}</el-descriptions-item>
            <el-descriptions-item align="center" label="图标：">
              <el-icon>
                <component v-if="form.icon" :is="form.icon"/>
              </el-icon>
            </el-descriptions-item>
            <el-descriptions-item align="center" label="排序：">{{ form.sort }}</el-descriptions-item>
            <el-descriptions-item align="center" label="组织编码：">{{ form.code }}</el-descriptions-item>
            <el-descriptions-item align="center" label="状态：">
              <el-tag>{{ proxy.$tools.selectDictLabel(proxy.$appConfig.STATUS,form.status || "1") }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-row>
        <el-divider content-position="left" v-if="form.type != '2'">{{ form.name ?'子项列表' : '组织列表' }}</el-divider>
        <el-form :model="searchForm" label-width="120px">
          <el-row justify="start" style="margin: .5rem">
            <el-col :span="5">
            </el-col>
            <el-col :span="5">
            </el-col>
            <el-col :span="5">
            </el-col>
            <el-col :span="5">
              <el-form-item label="组织名">
                <el-input v-model="searchForm.name" placeholder="请输入组织名" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-row justify="center">
                <el-button type="primary" @click="getTableData()">搜索</el-button>
                <el-button @click="searchForm.name = ''; getTableData()">清空</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
          <el-row justify="start" style="margin: .5rem">
          <el-link v-permission="['sys:organ:save']" v-if="form.type != '2'" type="primary" @click="addClick()">{{ form.name ?'新增子项' : '新增组织' }}</el-link>
          <el-link v-permission="['sys:organ:update']" type="warning" @click="editClick(form)" style="margin-left: .5rem">{{ form.name ?'编辑此项' : '' }}</el-link>
          <el-popconfirm
              @confirm="confirmDelete(form)"
              title="确认删除?">
            <template #reference>
              <el-link v-permission="['sys:organ:delete']" type="danger" style="margin-left: .5rem">{{ form.name ?'删除此项' : '' }}</el-link>
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
            <el-table-column prop="name" label="组织名称" show-overflow-tooltip/>
            <el-table-column prop="sort" label="排序" show-overflow-tooltip/>
            <el-table-column prop="code" label="组织编码" show-overflow-tooltip/>
            <el-table-column prop="status" label="状态" show-overflow-tooltip>
              <template #default="scope">
                <el-tag :type="scope.row.status == '0' ? 'info' : ''">{{ proxy.$tools.selectDictLabel(proxy.$appConfig.STATUS,scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="icon" label="组织图标" show-overflow-tooltip>
              <template #default="scope">
                <el-icon>
                  <component v-if="scope.row.icon" :is="scope.row.icon"/>
                </el-icon>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作">
              <template #default="scope">
                <el-button v-permission="['sys:organ:update']"  size="small" @click="editClick(scope.row)">编辑</el-button>
                <el-popconfirm
                    @confirm="confirmDelete(scope.row)"
                    title="确认删除?">
                  <template #reference>
                    <el-button v-permission="['sys:organ:delete']"  size="small" type="danger" @click="">删除</el-button>
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
import organApi from "@/api/sys/organ";

import operation from "@/views/sys/organ/operation"
import roleApi from "@/api/sys/role";
import {ElMessage} from "element-plus";

export default {
  name: "sys/organ",
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
      currentTreeeNode: ref({}),
      currentTreeeNodeKey: ref(""),
      treeProps: {
        children: 'children',
        label: 'name',
      },
      form: ref({}),
      searchForm: ref({}),
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
      methods.getTree()
      methods.getTableData()
    })
    let methods = {
      /*
      * 树型控件点击事件
      * */
      treeeNodeClick(datas, node, TreeNode, e) {
        data.form.value = datas
        data.searchForm.value.parentId = datas.id
        data.currentTreeeNode.value = datas
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
        let node = data.currentTreeeNode.value;
        if (node){
          data.form.value = node
          data.searchForm.value.parentId = node.id
          data.currentTreeeNodeKey.value = node.id
        }else{
          data.form.value = {}
          data.searchForm.value = {}
        }

        methods.getTree();
        methods.getTableData();
      },

      /*获取列表*/
      getTableData() {
        data.tableDataLoad.value = true
        let param = {}
        param = Object.assign(param, data.page.value)
        param = Object.assign(param, data.searchForm.value)

        organApi.page(param).then(res => {
          data.tableData.value = res.data.records
          data.page.value.total = res.data.total
        }).finally(() => {
          data.tableDataLoad.value = false
        })
      },

      async getTree() {
        await organApi.getTreeAll().then(res => {
          data.treeData.value = res.data.nav
        })

        let key = data.currentTreeeNodeKey.value;
        if (key) {
          treeRef.value.setCurrentKey(key, true)
        }
      },

      /*
      * 确认删除
      * */
      confirmDelete(row) {
        let param = row
        organApi.remove(param).then(res => {
          if (res.success){
            ElMessage.success(res.msg)
          }else{
            ElMessage.warning(res.msg)
          }
          data.currentTreeeNode.value = undefined
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