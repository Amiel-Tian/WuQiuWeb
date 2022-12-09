export default [
    {
        name: 'markdown/index',
        path: '/markdown/index',
        meta: { title: 'Markdown', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/markdown/index')
        }
    },
]