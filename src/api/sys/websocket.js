import request from "@/utils/request";

export default {
    sentMessage(data) {
        return request({
            url: '/sysWebSocket/sentMessage',
            method: 'post',
            data: data,
        })
    },
    datas(param) {
        return request({
            url: '/sysWebSocket/datas',
            method: 'get',
            params:param,
        })
    },
}