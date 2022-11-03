import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
import "./assets/css/reset.css"
import "./assets/css/base.scss"
// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//汉化
import locale from 'element-plus/lib/locale/lang/zh-cn';
app.use(ElementPlus,{locale})
//注册element 图标
import * as Elicons from "@element-plus/icons-vue";
for (let i in Elicons) {
    app.component(i, Elicons[i])
}
// import * as Icons from '@element-plus/icons'
// for (let i in Icons) {
//     app.component(i, Icons[i])
// }

//注册路由
import router from './router/index.js'
app.use(router)

//全局变量
import APP_CONFIG from "@/config/config";
app.config.globalProperties.$appConfig = APP_CONFIG

app.mount('#app')
