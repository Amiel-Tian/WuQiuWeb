import request from "@/utils/request";

export default {
    page(param) {
        return request({
            url: '/sysDictType/page',
            method: 'get',
            params: param,
        })
    },
    datas(param) {
        return request({
            url: '/sysDictType/datas',
            method: 'get',
            params: param,
        })
    },
    get(id) {
        return request({
            url: '/sysDictType/get',
            method: 'get',
            params: {id : id},
        })
    },
    add(param) {
        return request({
            url: '/sysDictType/add',
            method: 'post',
            data: param,
        })
    },
    update(param) {
        return request({
            url: '/sysDictType/update',
            method: 'PUT',
            data: param,
        })
    },
    remove(param) {
        return request({
            url: '/sysDictType/remove',
            method: 'PUT',
            data: param,
        })
    },
}