export default [
    {
        name: 'renwushu/index',
        path: '/renwushu/index',
        meta: {title: '任务书', icon: '', keepalive : true},
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/modules/renwushu/index')
        }
    }, {
        name: 'business/index',
        path: '/business/index',
        meta: {title: '项目文档', icon: '',keepalive : true},
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/modules/business/index')
        }
    },
    {
        name: 'resume/show',
        path: '/resume/show',
        meta: {title: '个人简历', icon: '',keepalive : true},
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/modules/resume/show')
        }
    },
    {
        name: 'ireport/xmlToLowerCase',
        path: '/ireport/xmlToLowerCase',
        meta: {title: '变量转小写', icon: '',keepalive : true},
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/modules/ireport/xmlToLowerCase')
        }
    },
]