<template>
  <page-title :title="router.currentRoute.value.meta.title"></page-title>
  <el-card style="height: 93%;"
           :body-style="{ padding: '20px' , height: '100%'}"
  >
    <div class="box">
      <div class="menu" :style="{width: isOpen ? menuWidth + '%' : '0',}">
        <!--        <el-input placeholder="输入搜索" v-modules="treeInput" clearable >-->
        <!--          <template #append>-->
        <!--            <el-button icon="Search" @click="treeSearch"/>-->
        <!--          </template>-->
        <!--        </el-input>-->
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
          <el-button v-permission="['sys:business:add']" link type="primary" @click="addClick()">新增</el-button>
        </el-row>
        <el-tree
            ref="treeRef"
            :data="treeData"
            :props="treeProps"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            :current-node-key="currentTreeeNodeKey"
            @node-click="treeeNodeClick"
            :filter-node-method="filterNode"
        >
          <template #default="{ node, data }">
            <el-row justify="space-between" style="font-size: 1rem">
              <div>{{ node.label }}</div>
              <div style="padding:0 1.5rem">
                <el-tag size="small">{{ data.sort }}</el-tag>
              </div>
            </el-row>
          </template>
        </el-tree>
      </div>
      <div class="content" :style="{width: isOpen ? (100 - menuWidth) + '%' : '100%',}">
        <el-row v-if="!edit && form && form.show" justify="center" style="height: 100%;">
          <el-col :span="23" style="height: 100%;">
            <el-row>
              <el-col :span="24" class="title">{{ form.name }}</el-col>
              <el-col :span="24" class="remark">
                <el-row>
                  <el-col :span="20">
                    创建于{{ form.createDate }}，最后修改时间{{ form.updateDate }}
                  </el-col>
                  <el-col :span="4">
                    <el-button link v-permission="['sys:business:update']" type="primary" @click="editClick(form)">编辑
                    </el-button>
                    <el-popconfirm
                        @confirm="confirmDelete(form)"
                        title="确认删除?">
                      <template #reference>
                        <el-button v-permission="['sys:business:delete']" link type="danger" @click="">删除</el-button>
                      </template>
                    </el-popconfirm>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-col :span="24" class="contents">
              <el-scrollbar max-height="100%">
                <v-md-preview :text="form.content"></v-md-preview>
              </el-scrollbar>
            </el-col>
          </el-col>
        </el-row>

        <el-form v-if="edit" style="height: 100%;" ref="formRef" :model="form" label-width="10px" :rules="rules"
                 :disabled="btnLoad">
          <el-row justify="center" style="height: 100%;">
            <el-col :span="23" style="height: 100%;">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="" prop="name">
                    <el-input v-model="form.name" placeholder="请输入标题" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="" prop="parentId">
                    <el-cascader
                        style="width: 100%;"
                        v-model="form.parentId"
                        :options="treeData"
                        :props="cascaderProps"
                        clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="sort" label="">
                    <el-input-number v-model="form.sort" :min="1" :max="1000" placeholder="排序"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-col :span="24" style="height: 90%;">
                <v-md-editor v-model="form.content" height="100%"
                             @save="mdSaveClick()"
                             :disabled-menus="[]"
                             @upload-image="handleUploadImage"
                ></v-md-editor>
              </el-col>
            </el-col>
          </el-row>
        </el-form>


        <div class="switch-btn" @click="switchClick">
          <el-icon>
            <CaretLeft v-if="isOpen"/>
            <CaretRight v-if="!isOpen"/>
          </el-icon>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import {ref, unref, getCurrentInstance, watch, reactive, onMounted} from "vue";
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router";

import businessInfoApi from "@/api/modules/businessInfo";
import fileApi from "@/api/sys/file";

export default {
  name: "index",
  props: ["info"],
  emits: ["update:info"],
  components: {},
  setup(props, content) {
    const router = useRouter()
    const {proxy} = getCurrentInstance();
    const formRef = ref()
    const treeRef = ref()
    let data = {
      menuWidth: ref(16.6),
      isOpen: ref(true),
      cascaderProps: {
        children: "children",
        label: "name",
        value: "id",
        checkStrictly: true,
        emitPath: false,
      },
      treeWidth: ref(4),
      treeInput: ref(""),
      treeData: ref([]),
      treeProps: {
        children: 'children',
        label: 'name',
      },
      currentTreeeNode: ref({}),
      currentTreeeNodeKey: ref(""),
      form: ref({}),
      searchForm: ref({}),
      edit: ref(false),
      btnLoad: ref(false),
      rules: {
        name: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'change',
          },
        ],
        sort: [
          {
            required: true,
            message: '请输入排序',
            trigger: 'change',
          },
        ],
      },
    }
    //监听
    watch(() => [props.info], ([newInfo], [oldInfo]) => {

    })
    onMounted(async () => {
      methods.getTreeData()
    })
    let methods = {
      async getTreeData() {
        await businessInfoApi.treeData().then(res => {
          data.treeData.value = res.data
        })
        let key = data.currentTreeeNodeKey.value;
        if (key) {
          treeRef.value.setCurrentKey(key, true)
        }
      },
      /*
     * 刷新点击
     * */
      refreshTreeClick() {
        let node = data.currentTreeeNode.value;
        if (node) {
          data.form.value = node
          data.searchForm.value.id = node.id
          data.currentTreeeNodeKey.value = node.id
        } else {
          data.form.value = {}
          data.searchForm.value = {}
        }

        methods.getTreeData();
      },
      /*开关*/
      switchClick() {
        let isOpen = data.isOpen.value
        data.isOpen.value = !isOpen
      },
      /*
    * 树型控件点击事件
    * */
      treeeNodeClick(datas, node, TreeNode, e) {
        if (data.form.value && data.form.value.show && data.edit.value) {
          ElMessageBox.confirm(
              '内容未保存，是否退出?',
              '警告',
              {
                confirmButtonText: '退出',
                cancelButtonText: '继续编辑',
                type: 'warning',
              }
          ).then(() => {
            data.edit.value = false
            data.searchForm.value.id = datas.id
            methods.get(datas.id);
          }).catch(() => {

          })
        } else {
          data.edit.value = false
          data.searchForm.value.id = datas.id
          methods.get(datas.id);
        }
      },
      /*
      * 数过滤函数
      * */
      filterNode(value, datas) {
        if (!value) return true
        return datas.name.indexOf(value) != -1
      },
      get(id) {
        businessInfoApi.get(id).then(res => {
          data.form.value = res.data
          data.form.value.show = true
          if (!data.form.value.content) {
            data.form.value.content = ""
          }
          data.currentTreeeNode.value = res.data
        })
      },
      /*新增按钮*/
      addClick() {
        if (data.form.value && data.form.value.show && data.edit.value) {
          ElMessageBox.confirm(
              '内容未保存，是否退出?',
              '警告',
              {
                confirmButtonText: '确定',
                cancelButtonText: '继续编辑',
                type: 'warning',
              }
          ).then(() => {
            data.form.value = {}
            data.form.value.show = true
            data.edit.value = true
          }).catch(() => {

          })
        } else {
          data.form.value = {}
          data.form.value.show = true
          data.edit.value = true
        }
      },
      /*编辑按钮*/
      editClick(info) {
        data.form.value = info
        data.form.value.show = true
        data.edit.value = true
      },
      /*
     * 确认删除
     * */
      confirmDelete(row) {
        let param = row
        businessInfoApi.remove(param).then(res => {
          if (res.success) {
            ElMessage.success(res.msg)
          } else {
            ElMessage.warning(res.msg)
          }
          data.currentTreeeNode.value = undefined
          this.refreshTreeClick()
        })
      },
      treeSearch() {
        treeRef.value.filter(data.treeInput)
      },
      handleUploadImage(event, insertImage, files) {
        // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
        if (!files){
          return
        }
        let param = {
          file : files[0]
        }
        fileApi.uploadAttachment(param).then(res => {
          if (res.success){
            let data = res.data
            insertImage({
              url:data.link,
              desc: data.originalFilename,
              width: '250',
              height: 'auto',
            });
          }
        })
      },
      mdSaveClick() {
        if (!formRef) {
          return
        }
        formRef.value.validate((valid, fields) => {
          if (valid) {
            data.btnLoad.value = true
            let param = data.form.value
            if (!param.parentId) {
              param.parentId = "0"
            }
            if (param.id) {
              businessInfoApi.update(param).then(res => {
                if (res.success) {
                  ElMessage.success(res.msg)
                } else {
                  ElMessage.error(res.msg)
                }
                methods.refreshTreeClick()
                methods.treeeNodeClick(param)
                data.btnLoad.value = false;
              })
            } else {
              businessInfoApi.add(param).then(res => {
                if (res.success) {
                  ElMessage.success(res.msg)
                } else {
                  ElMessage.error(res.msg)
                }
                methods.refreshTreeClick()
                data.btnLoad.value = false;
              })
            }
            data.edit.value = false
          } else {
            ElMessage.warning("必填项未填写！")
          }
        })
      },
    }

    return {
      proxy,
      router,
      treeRef,
      formRef,
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: space-around;
  min-height: 52px;
  height: 100%;

  .menu {
    overflow: hidden;
    border-right: 1px var(--el-border-color) var(--el-border-style);
    transition: width .5s;
  }

  .content {
    position: relative;
    transition: width .5s;
    /*title*/
    .title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: .4rem;
    }

    /**/
    .remark {
      background: #f8f8f8;
      border-radius: 4px;
      color: #999aaa;
      font-size: .5rem;
      line-height: 2.2rem;
      padding: 0 1rem;
    }

    /**/
    .contents {
      height: 88%;
      box-sizing: border-box;
      border: 1px solid var(--el-card-border-color);
    }

    /*侧边栏按钮*/
    .switch-btn {
      position: absolute;
      top: 50%;
      margin-top: -24px;
      margin-left: -1px;
      width: 10px;
      height: 52px;
      line-height: 52px;
      border: 1px solid #dcdfe6;
      color: #aaa;
      font-size: 12px;
      border-radius: 0 20px 20px 0;
      cursor: pointer;
      overflow: hidden;
      z-index: 8;
    }

    .switch-btn:hover {
      background: #f9f9f9;
    }
  }
}
</style>