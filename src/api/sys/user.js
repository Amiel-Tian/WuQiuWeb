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
    page(param) {
        return request({
            url: '/sysUser/page',
            method: 'get',
            params: param,
        })
    },
    add(param) {
        return request({
            url: '/sysUser/add',
            method: 'post',
            data: param,
        })
    },
    update(param) {
        return request({
            url: '/sysUser/update',
            method: 'PUT',
            data: param,
        })
    },
    remove(param) {
        return request({
            url: '/sysUser/remove',
            method: 'PUT',
            data: param,
        })
    },
    get(id) {
        return request({
            url: '/sysUser/get',
            method: 'get',
            params: {id : id},
        })
    },
}