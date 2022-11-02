import { createRouter, createWebHashHistory } from 'vue-router'
import login from "@/views/login";
import home from "@/views/index";


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
    },
    // ...back,
    // ...houseInfo,
]


const router = createRouter({
    history: createWebHashHistory(),
    routes:  routes
})

export default router