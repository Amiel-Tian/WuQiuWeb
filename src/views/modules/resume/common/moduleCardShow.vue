<template>
  <div class="box-s">
    <el-row v-if="info.startDate || info.endDate || info.title" style="font-size : 1rem;font-weight: bold">
      <el-col :span="12"><span>{{ info.startDate ? info.startDate.substring(0, 10) : "" }}</span>
        <span class="division" v-if="info.endDate">-</span>
        <span>{{ info.endDate ? info.endDate.substring(0, 10) : '' }}</span></el-col>
      <el-col :span="12" style="text-align: right">
        <el-icon class="link" v-if="info.links" @click="linkOpen(info.links)"><Link /></el-icon>
        {{ info.title }}
      </el-col>
    </el-row>
    <el-row class="label" v-if="info.labels || info.type">
      <el-col :span="12" >
        <span v-if="info.labels" v-for="(item,index) in info.labels.split(',')">
          <span>{{ item }}</span>
           <span class="division" v-if="index < info.labels.split(',').length-1">|</span>
        </span>
      </el-col>
      <el-col :span="12" style="text-align: right">
        {{info.type}}
      </el-col>
    </el-row>
    <el-row v-if="info.content">
      <el-col>
<!--        <div v-html="info.content.replace(/\n/g, '<br />')"></div>-->
        <el-input type="textarea" disabled autosize v-model="info.content"></el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {ref, getCurrentInstance, watch, reactive, onMounted} from "vue";

export default {
  name: "moduleCardShow",
  props: ["info", "edit"],
  emits: [],
  components: {},
  setup(props, content) {
    let data = {}
    //监听
    watch(() => [props.info], ([newContent], [oldContent]) => {

    })
    onMounted(async () => {
    })
    let methods = {
      linkOpen(url){
        window.open(url, '_blank')
      },
    }

    return {
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>
.box-s {
  min-height: 3rem;
  padding: .5rem 2rem;

  .label{
    padding: .4rem 0;
    font-size: .9rem;
    color: #65696c;
  }
  .division {
    padding: 0 .4rem;
  }
  .link{
    cursor: pointer;
  }
  .link:hover{
    color: #409eff;
  }

  ::v-deep .el-textarea__inner {
    cursor: default;
    border: none;
    box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
    resize: none;/* 这个是去掉 textarea 下面拉伸的那个标志，如下图 */
    background: none;
    padding: 0;
    font-size: 16px;
    color: #000;
  }
}
</style>