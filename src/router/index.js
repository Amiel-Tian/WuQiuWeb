import { createRouter, createWebHashHistory } from 'vue-router'
import login from "@/views/login";
import home from "@/views/index";
import sys from "@/router/sys/index";
import renwushu from "@/router/modules/renwushu";


const routes = [
    {
        path : "/login",
        name: '/login',
        component : login,
    },
    {
        path : "/",
        name: '/',
        component : home,
        children:[
            ...sys,
            ...renwushu
        ],
    },
    // ...back,
    // ...houseInfo,
]


const router = createRouter({
    history: createWebHashHistory(),
    routes:  routes
})

//路由守卫
router.beforeEach((to, from, next) => {
    // ...
    if (to.matched.length ===0) {  //如果未匹配到路由
        // from.path? next({ path:from.path}) : next('/');   //如果上级也未匹配到路由则跳转主页面，如果上级能匹配到则转上级路由
        next('/404')
    } else {
        next();    //如果匹配到正确跳转
    }
})
export default router