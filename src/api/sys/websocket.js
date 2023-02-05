import request from "@/utils/request";

export default {
    sentMessage(data) {
        return request({
            url: '/webSocket/sentMessage',
            method: 'post',
            data: data,
        })
    },
}