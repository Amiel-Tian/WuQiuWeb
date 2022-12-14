import request from "@/utils/request";

export default {
    datas(params){
        return request({
            url: '/resumeContent/dates',
            method: 'get',
            params: params
        })
    },
    get(params){
        return request({
            url: '/resumeContent/get',
            method: 'get',
            params: params
        })
    },
    add(data) {
        return request({
            url: '/resumeContent/add',
            method: 'post',
            data: data
        })
    },
    update(data) {
        return request({
            url: '/resumeContent/update',
            method: 'put',
            data: data
        })
    },
    delete(data) {
        return request({
            url: '/resumeContent/delete',
            method: 'delete',
            data: data
        })
    },
}