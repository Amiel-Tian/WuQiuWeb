export default [
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
        name: 'sys/roles',
        path: '/sys/roles',
        meta: { title: '权限管理', icon: '' },
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
        name: 'sys/dicts',
        path: '/sys/dicts',
        meta: { title: '字典管理', icon: '' },
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/sys/dicts')
        }
    },
]