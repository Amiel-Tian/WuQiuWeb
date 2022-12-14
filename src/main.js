import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)
import "./assets/css/reset.css"
import "./assets/css/base.scss"
// element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//汉化
import locale from 'element-plus/lib/locale/lang/zh-cn';

app.use(ElementPlus, {locale})
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
//完整
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
//小型
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
//代码高亮组件
//预览组件
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';

import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
//编辑器使用默认样式
VMdEditor.use(vuepressTheme, {
    Prism,
    extend(md) {
        // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
        // md.set(option).use(plugin);
    },
});
//查看器使用默认样式
VMdPreview.use(vuepressTheme, {
    Prism,
    extend(md) {
        // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
        // md.set(option).use(plugin);
    },
});

//github样式
/*
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// gethub 高亮 highlightjs 核心代码
import hljs from 'highlight.js/lib/core';
// 按需引入语言包
import json from 'highlight.js/lib/languages/json';
import java from 'highlight.js/lib/languages/java';
hljs.registerLanguage('json', json);
hljs.registerLanguage('java', java);

// highlightjs引入全部语言包
import hljs from 'highlight.js';
//编辑器使用github样式
VueMarkdownEditor.use(githubTheme, {
    Hljs: hljs,
});

//预览使用github样式
VMdPreview.use(githubTheme, {
    Hljs: hljs,
});*/


// codemirror 编辑器的相关资源
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';

VMdEditor.Codemirror = Codemirror;


// 流程图
import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn';
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';

VMdEditor.use(createMermaidPlugin());
VMdPreview.use(createMermaidPlugin());
// todo
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';

VMdEditor.use(createTodoListPlugin());
VMdPreview.use(createTodoListPlugin());
// 代码快捷复制
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

VMdEditor.use(createCopyCodePlugin());
VMdPreview.use(createCopyCodePlugin());

app.use(VMdEditor);
// app.use(VueMarkdownEditor);
app.use(VMdPreview);
/*打印页面引入*/
import print from 'vue3-print-nb'
app.use(print)
//权限控制
import directive from "@/directive";

directive(app)

app.mount('#app')
