export default [
    {
        name: 'renwushu/index',
        path: '/renwushu/index',
        meta: { title: '任务书', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/model/renwushu/index')
        }
    },
]