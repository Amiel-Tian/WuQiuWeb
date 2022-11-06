import captcha from "@/components/captcha";
import pageTitle from "@/components/pageTitle";

const components = {
    install: function(Vue){
        Vue.component('captcha', captcha)
        Vue.component('pageTitle', pageTitle)
    }
}
export default components