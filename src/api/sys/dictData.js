import request from "@/utils/request";

export default {
    page(param) {
        return request({
            url: '/sysDictData/page',
            method: 'get',
            params: param,
        })
    },
    datas(param) {
        return request({
            url: '/sysDictData/datas',
            method: 'get',
            params: param,
        })
    },
    get(id) {
        return request({
            url: '/sysDictData/get',
            method: 'get',
            params: {id : id},
        })
    },
    add(param) {
        return request({
            url: '/sysDictData/add',
            method: 'post',
            data: param,
        })
    },
    update(param) {
        return request({
            url: '/sysDictData/update',
            method: 'PUT',
            data: param,
        })
    },
    remove(param) {
        return request({
            url: '/sysDictData/remove',
            method: 'PUT',
            data: param,
        })
    },
}