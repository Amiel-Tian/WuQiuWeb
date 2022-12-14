import request from "@/utils/request";

export default {
    datas(params){
        return request({
            url: '/resumeInfo/dates',
            method: 'get',
            params: params
        })
    },
    get(params){
        return request({
            url: '/resumeInfo/get',
            method: 'get',
            params: params
        })
    },
    add(data) {
        return request({
            url: '/resumeInfo/add',
            method: 'post',
            data: data
        })
    },
    update(data) {
        return request({
            url: '/resumeInfo/update',
            method: 'put',
            data: data
        })
    },
    jurisdiction(data) {
        return request({
            url: '/resumeInfo/jurisdiction',
            method: 'post',
            params: data
        })
    },
}