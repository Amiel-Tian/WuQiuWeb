import axios from 'axios'
import {ElMessage} from 'element-plus';
import router from '@/router'

//全局变量
import APP_CONFIG from "@/config/config";
//超时时间
axios.defaults.timeout = 10000 * 60 * 2;
const api = axios.create({
    // baseURL: APP_CONFIG.VUE_APP_API_HOST_DEFAULT, // 请求的公共地址部分
    baseURL: "api", // 请求的公共地址部分
    timeout: 3000 // 请求超时时间 当请求时间超过5秒还未取得结果时 提示用户请求超时
})
// interceptors axios的拦截器对象
api.interceptors.request.use(config => {
    // 在请求头中添加token
    config.headers.Authorization = window.localStorage.getItem("javawebtoken")
    // config 请求的信息
    return config // 将配置完成的config对象返回出去 如果不返回 请求则不会进行
}, err => {
    // 请求发生错误时的处理 抛出错误
    Promise.reject(err)
})
api.interceptors.response.use(res => {
    // 我们一般在这里处理，请求成功后的错误状态码 例如状态码是500，404，403
    // res 是所有相应的信息
    if (res.data.code == "110") {
        //登录成功
        if (res.headers && res.headers.authorization) {
            localStorage.setItem('javawebtoken', res.headers.authorization)
        }
    }
    if (res.data.code == "106") {
        //用户未登录
        router.push({
            path: '/login',
        })
    }
    if (res.data.code == "115") {
        //退出登录
        if (res.headers) {
            localStorage.setItem('javawebtoken', res.headers.authorization)
            router.push({
                path: '/login',
            })
        }
    }

    return Promise.resolve(res.data)
}, err => {
    // 服务器响应发生错误时的处理
    ElMessage.error('系统错误：' + err);
    Promise.reject(err)
})

export default api
