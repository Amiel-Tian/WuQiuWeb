import captcha from "@/components/captcha";
import pageTitle from "@/components/pageTitle";
import iconShow from "@/components/iconShow"

const components = {
    install: function(Vue){
        Vue.component('captcha', captcha)
        Vue.component('pageTitle', pageTitle)
        Vue.component('iconShow', iconShow)
    }
}
export default components