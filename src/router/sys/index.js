export default [
    {
        name: '404',
        path: '/404',
        meta: { title: '404', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/error/404')
        }
    },
    {
        name: '500',
        path: '/500',
        meta: { title: '500', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/error/500')
        }
    },
    {
        name: 'sys/user',
        path: '/sys/user',
        meta: { title: '用户管理', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/user')
        }
    },
    {
        name: 'sys/user/personal',
        path: '/sys/user/personal',
        meta: { title: '个人中心', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/user/personal')
        }
    },
    {
        name: 'sys/roles',
        path: '/sys/roles',
        meta: { title: '角色管理', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/role')
        }
    },
    {
        name: 'sys/menus',
        path: '/sys/menus',
        meta: { title: '菜单管理', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/menu')
        }
    },
    {
        name: 'sys/organ',
        path: '/sys/organ',
        meta: { title: '组织管理', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/organ')
        }
    },
    {
        name: 'sys/dicts',
        path: '/sys/dicts',
        meta: { title: '字典管理', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/dicts')
        }
    },
    {
        name: 'tools/markdown',
        path: '/tools/markdown',
        meta: { title: 'Markdown', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/tools/markdown')
        }
    },
    {
        name: 'tools/icon',
        path: '/tools/icon',
        meta: { title: '图标', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/tools/icon')
        }
    },
    {
        name: 'tools/other',
        path: '/tools/other',
        meta: { title: '其他工具', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/tools/other')
        }
    },
    {
        name: 'websocket/index',
        path: '/websocket/index',
        meta: { title: 'websocket', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/websocket/index')
        }
    },
]