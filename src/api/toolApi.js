import request from "@/utils/request";

export default {
    getCaptcha() {
        return request({
            url: '/captcha',
            method: 'get',
        })
    },
}