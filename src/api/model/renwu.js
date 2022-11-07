import request from "@/utils/request";

export default {
    page(param) {
        return request({
            url: '/renwuInfo/page',
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
}