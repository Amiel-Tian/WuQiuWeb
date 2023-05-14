<template>
  <div style="background-color: #FFF">
    <el-row>
      <el-col style="position: relative" :span="24" :class="['row',  {'out-height':out}]"
              :style="windowWidth < 1000? 'height:14rem':''">
        <div class="mask"></div>
        <div class="text">
          <div>
            个
            <span class="diagonal">/</span>
            人
            <span class="diagonal">/</span>
            简
            <span class="diagonal">/</span>
            历
          </div>
          <div class="english">Personal resume</div>
        </div>
        <el-row justify="end" align="middle">
          <div :class="form.headPortrait ? 'image-box':'image-box bg-none'">
            <div class="name">{{ form.name }}</div>
            <el-avatar shape="square" :fit="'cover'" :size="180" :src="form.headPortrait"
                       :class="form.headPortrait ? '':'bg-none'"/>
          </div>
        </el-row>
      </el-col>
      <el-col class="info-box" @mouseenter="mouseenterEev" @mouseleave="mouseleaveEnv"
              :style="windowWidth < 1000? 'margin-top: 6rem':''">
        <div class="menu" v-show="mouseFlag">
          <el-button circle @click="editClick">
            <el-icon>
              <EditPen/>
            </el-icon>
          </el-button>
        </div>
        <el-row justify="center">
          <el-col :span="23">
            <el-row>
              <el-col :span="8">年龄：<span>{{ form.age }}</span></el-col>
              <el-col :span="16">性别：<span>{{ form.sex }}</span></el-col>
              <el-col :span="8">身高：<span>{{ form.height }}</span></el-col>
              <!--          <el-col :span="16">电话：<span>{{form.telephone}}</span></el-col>-->
              <el-col :span="16">专业：<span>{{ form.major }}</span></el-col>
              <el-col :span="8">学历：<span>{{ form.education }}</span></el-col>
              <el-col :span="16">邮箱：<span>{{ form.mailbox }}</span></el-col>
              <el-col :span="8">住址：<span>{{ form.currentAddress }}</span></el-col>
              <el-col :span="16">学校：<span>{{ form.graduationSchool }}</span></el-col>
            </el-row>
          </el-col>

        </el-row>
        <!--        <div v-for="(item,index) of list">{{index}}</div>-->
      </el-col>
    </el-row>
  </div>


  <el-dialog
      v-model="dialogVisible"
      title="编辑基础信息"
      width="60%"
  >
    <div class="dialog-content">
      <el-form :model="form" ref="formRef" label-width="5rem">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄：">
              <el-date-picker
                  style="width: 100%;"
                  v-model="form.birthday"
                  type="date"
                  placeholder="出生日期"
                  :disabled-date="disabledDate"
                  :shortcuts="shortcuts"
                  value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别：">
              <el-select v-model="form.sex" placeholder="请选择" style="width: 100%;">
                <!--                <el-option-->
                <!--                    v-for="item in resumeContentGroup"-->
                <!--                    :key="item.value"-->
                <!--                    :label="item.name"-->
                <!--                    :value="item.value"-->
                <!--                />-->
                <el-option key="1" label="男" value="男"></el-option>
                <el-option key="2" label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身高：">
              <el-input-number v-model="form.height" :min="1" style="width: 100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业：">
              <el-input v-model="form.major"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历：">
              <el-input v-model="form.education"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱：">
              <el-input v-model="form.mailbox"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="住址：">
              <el-input v-model="form.currentAddress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学校：">
              <el-input v-model="form.graduationSchool"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false;">返回</el-button>
        <el-button type="primary" @click="subment">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {ref, getCurrentInstance, watch, reactive, onMounted, toRef} from "vue";

import resumeInfoApi from "@/api/modules/resume/resumeInfo";
import resumeContentApi from "@/api/modules/resume/resumeContent";
import {ElMessage} from "element-plus";

export default {
  name: "index",
  props: ["info"],
  emits: ["refresh"],
  components: {},
  setup(props, content) {
    let data = {
      list: ref(1000),
      out: ref(true),
      form: ref(props.info),
      dialogVisible: ref(false),
      mouseFlag: ref(false),
      // 屏幕宽度
      windowWidth: ref(0),
      // 屏幕高度
      windowHeight: ref(0),
      shortcuts : [
        {
          text: 'Today',
          value: new Date(),
        },
        {
          text: 'Yesterday',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
          },
        },
        {
          text: 'A week ago',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
          },
        },
      ]
    }

    //监听
    watch(() => [props.info], ([newInfo], [oldInfo]) => {
      data.form.value = newInfo
    })

    onMounted(async () => {
      methods.getWindowResize()
    })

    let methods = {
      getWindowResize() {
        data.windowWidth.value = window.innerWidth
        data.windowHeight.value = window.innerHeight
      },

      mouseenterEev() {
        data.mouseFlag.value = true
      },
      mouseleaveEnv() {
        data.mouseFlag.value = false
      },
      editClick() {
        data.dialogVisible.value = true
      },
      subment() {
        data.dialogVisible.value = false

        let param = data.form.value
        if (param.id) {
          resumeInfoApi.update(param).then(res => {
            content.emit('refresh');
            ElMessage({
              type: 'success',
              message: `success`,
            })
          })
        }
      },
      disabledDate(time) {
        return time.getTime() > Date.now()
      }
    }

    return {
      ...data,
      ...methods
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-none {
  background: none !important;
  --el-avatar-bg-color: none !important;
}

.row {
  height: 35rem;
  transition: all 1s;
  background-image: url("~@/assets/images/bg.png");
  background-size: cover;
  background-position: center center;

  .text {
    position: absolute;
    top: 1rem;
    left: 2rem;
    color: #14191d;
    font-size: 3rem;

    .diagonal {
      color: #666;
      font-size: 1.4rem;
    }

    .english {
      font-size: 1.4rem;
      text-align: right;
      font-style: italic;
    }
  }

  .image-box {
    z-index: 99;
    position: absolute;
    bottom: -6rem;
    right: .5rem;
    padding: .4rem;
    background-color: var(--white);
    //border: 1px solid var(--el-card-border-color);
    .name {
      position: absolute;
      right: 100%;
      font-size: 2rem;
      color: #14191d;
      top: 2rem;
      width: 7rem;
    }
  }

  .mask {
    width: 100%;
    height: 100%;
    transition: all 1s;
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.out-height {
  height: 10rem;

  .mask {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
  }
}

.info-box {
  position: relative;
  box-sizing: border-box;

  .menu {
    z-index: 99;
    position: absolute;
    right: 50%;
    top: .5rem;
    padding: 0 .5rem;
    background-color: var(--white);
  }

  .el-row {
    //font-size: 1.2rem;
    .el-col {
      line-height: 2rem;
    }
  }
}

.info-box:hover {
  border: 1px #65696c dashed;
}

::v-deep .el-avatar {
  --el-avatar-bg-color: var(--white);
}
</style>