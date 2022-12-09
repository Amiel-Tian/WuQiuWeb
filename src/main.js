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

//全局变量、方法
import APP_CONFIG from "@/config/config";
app.config.globalProperties.$appConfig = APP_CONFIG
import tool from "@/utils/tool";
app.config.globalProperties.$tools = tool
//注册全局组件
import components from "@/components";
app.use(components)
/*注册markdown组件*/
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
//代码高亮组件
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
//预览组件
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';

import Prism from 'prismjs';
// highlightjs 核心代码
// import hljs from 'highlight.js/lib/core';
// // 按需引入语言包
// import json from 'highlight.js/lib/languages/json';
// import java from 'highlight.js/lib/languages/java';
// hljs.registerLanguage('json', json);
// hljs.registerLanguage('java', java);

// highlightjs引入全部语言包
import hljs from 'highlight.js';
VueMarkdownEditor.use(githubTheme, {
    Hljs: hljs,
    extend(md) {
        // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
        // md.set(option).use(plugin);
    },
});
VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
app.use(VueMarkdownEditor);
app.use(VMdPreview);

//权限控制
import directive from "@/directive";
directive(app)

app.mount('#app')
