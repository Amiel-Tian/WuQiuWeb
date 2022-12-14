export default [
    {
        name: 'renwushu/index',
        path: '/renwushu/index',
        meta: {title: '任务书', icon: ''},
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/modules/renwushu/index')
        }
    }, {
        name: 'business/index',
        path: '/business/index',
        meta: {title: '业务信息', icon: ''},
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/modules/business/index')
        }
    },
    {
        name: 'resume/show',
        path: '/resume/show',
        meta: {title: '个人简历', icon: ''},
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/modules/resume/show')
        }
    },
]