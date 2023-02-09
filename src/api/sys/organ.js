import request from "@/utils/request";

export default {
    getTreeAll() {
        return request({
            url: '/sysOrgan/treeAll',
            method: 'get',
        })
    },
    getTreeAllAndUser() {
        return request({
            url: '/sysOrgan/treeAllAndUser',
            method: 'get',
        })
    },
    page(param) {
        return request({
            url: '/sysOrgan/page',
            method: 'get',
            params: param,
        })
    },
    datas(param) {
        return request({
            url: '/sysOrgan/datas',
            method: 'get',
            params: param,
        })
    },
    get(id) {
        return request({
            url: '/sysOrgan/get',
            method: 'get',
            params: {id : id},
        })
    },
    add(param) {
        return request({
            url: '/sysOrgan/add',
            method: 'post',
            data: param,
        })
    },
    update(param) {
        return request({
            url: '/sysOrgan/update',
            method: 'PUT',
            data: param,
        })
    },
    remove(param) {
        return request({
            url: '/sysOrgan/remove',
            method: 'PUT',
            data: param,
        })
    },
}