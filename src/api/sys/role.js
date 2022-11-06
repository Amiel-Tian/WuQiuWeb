import request from "@/utils/request";

export default {
    page(param) {
        return request({
            url: '/sysRole/page',
            method: 'get',
            params: param,
        })
    },
}