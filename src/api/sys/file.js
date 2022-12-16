import request from "@/utils/request";

export default {
    getByIds(params) {
        return request({
            url: '/sysFile/getByIds',
            method: 'get',
            params: params
        })
    },
    uploadAttachment(params) {
        return request({
            url: '/sysFile/uploadAttachment',
            method: 'post',
            data: params,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        },)
    },
}