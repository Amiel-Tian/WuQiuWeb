import request from "@/utils/request";

export default {
    getNav() {
        return request({
            url: '/sysMenu/nav',
            method: 'get',
        })
    },
}