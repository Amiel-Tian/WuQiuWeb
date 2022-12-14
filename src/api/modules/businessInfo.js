import request from "@/utils/request";

export default {
    page(param) {
        return request({
            url: '/businessInfo/page',
            method: 'get',
            params: param,
        })
    },
    datas(param) {
        return request({
            url: '/businessInfo/datas',
            method: 'get',
            params: param,
        })
    },
    add(param) {
        return request({
            url: '/businessInfo/add',
            method: 'post',
            data: param,
        })
    },
    update(param) {
        return request({
            url: '/businessInfo/update',
            method: 'PUT',
            data: param,
        })
    },
    get(id) {
        return request({
            url: '/businessInfo/get',
            method: 'get',
            params: {id : id},
        })
    },
    remove(param) {
        return request({
            url: '/businessInfo/remove',
            method: 'PUT',
            data: param,
        })
    },
    treeData() {
        return request({
            url: '/businessInfo/treeData',
            method: 'get',
        })
    },
}