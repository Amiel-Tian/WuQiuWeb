import request from "@/utils/request";

export default {
    getNav() {
        return request({
            url: '/sysMenu/nav',
            method: 'get',
        })
    },
    page(param) {
        return request({
            url: '/sysMenu/page',
            method: 'get',
            params: param,
        })
    },
}