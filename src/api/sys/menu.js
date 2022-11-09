import request from "@/utils/request";

export default {
    getNav() {
        return request({
            url: '/sysMenu/nav',
            method: 'get',
        })
    },
    getNavAll() {
        return request({
            url: '/sysMenu/navAll',
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
    datas(param) {
        return request({
            url: '/sysMenu/datas',
            method: 'get',
            params: param,
        })
    },
    get(id) {
        return request({
            url: '/sysMenu/get',
            method: 'get',
            params: {id : id},
        })
    },
    add(param) {
        return request({
            url: '/sysMenu/add',
            method: 'post',
            data: param,
        })
    },
    update(param) {
        return request({
            url: '/sysMenu/update',
            method: 'PUT',
            data: param,
        })
    },
    remove(param) {
        return request({
            url: '/sysMenu/remove',
            method: 'PUT',
            data: param,
        })
    },
}