import request from "@/utils/request";

export default {
    page(param) {
        return request({
            url: '/sysRole/page',
            method: 'get',
            params: param,
        })
    },
    datas(param) {
        return request({
            url: '/sysRole/datas',
            method: 'get',
            params: param,
        })
    },
    get(id) {
        return request({
            url: '/sysRole/get',
            method: 'get',
            params: {id : id},
        })
    },
    add(param) {
        return request({
            url: '/sysRole/add',
            method: 'post',
            data: param,
        })
    },
    update(param) {
        return request({
            url: '/sysRole/update',
            method: 'PUT',
            data: param,
        })
    },
}