import request from "@/utils/request";

export default {
    getUserInfo() {
        return request({
            url: '/getUserInfo',
            method: 'get',
        })
    },

    login(data) {
        return request({
            url: '/login',
            method: 'post',
            data: data
        })
    },
    logout() {
        return request({
            url: '/logout',
            method: 'get',
        })
    },
}