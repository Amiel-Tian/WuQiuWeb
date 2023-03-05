export default [
    {
        name: 'modules/messages',
        path: '/modules/messages',
        meta: { title: '消息', icon: '' ,keepalive : true},
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/modules/chat/messages')
        }
    },
    {
        name: 'modules/mails',
        path: '/modules/mails',
        meta: { title: '通讯录', icon: '' ,keepalive : true},
        components: {
            //index为声明的router-view的name
            index: () =>
                import ('@/views/modules/chat/mails')
        }
    },
]