import  tool from '@/utils/tool'

// 检测是否有权限
// 使用Vue.directive声明自定义指令permission
export default(app) => {
    app.directive('permission',{
        mounted(el, binding, vnode) {
            const permission = binding.value
            const result = tool.havePermission(permission)
            const tagName = el.localName
            if (!result) {
                el.remove()
            }
        }
    })
}
