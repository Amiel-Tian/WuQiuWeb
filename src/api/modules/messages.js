import request from "@/utils/request";

export default {
    sentMessage(data) {
        return request({
            url: '/messages/sentMessage',
            method: 'post',
            data: data,
        })
    },
    datas(param) {
        return request({
            url: '/messages/datas',
            method: 'get',
            params:param,
        })
    },
    getUserRecord(param) {
        return request({
            url: '/messages/getUserRecord',
            method: 'get',
            params:param,
        })
    },
}