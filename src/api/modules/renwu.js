import request from "@/utils/request";

export default {
    page(param) {
        return request({
            url: '/renwuInfo/page',
            method: 'get',
            params: param,
        })
    },
    datas(param) {
        return request({
            url: '/renwuInfo/datas',
            method: 'get',
            params: param,
        })
    },
    add(param) {
        return request({
            url: '/renwuInfo/add',
            method: 'post',
            data: param,
        })
    },
    update(param) {
        return request({
            url: '/renwuInfo/update',
            method: 'PUT',
            data: param,
        })
    },
    get(id) {
        return request({
            url: '/renwuInfo/get',
            method: 'get',
            params: {id : id},
        })
    },
    remove(param) {
        return request({
            url: '/renwuInfo/remove',
            method: 'PUT',
            data: param,
        })
    },
    datasPro(param) {
        return request({
            url: '/renwuProject/datas',
            method: 'get',
            params: param,
        })
    },
    addPro(param) {
        return request({
            url: '/renwuProject/add',
            method: 'post',
            data: param,
        })
    },
    updatePro(param) {
        return request({
            url: '/renwuProject/update',
            method: 'PUT',
            data: param,
        })
    },
}