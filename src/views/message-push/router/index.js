import Layout from '@/layout/index'
// 消息推送路由
export const messagePushRouter = [
  {
    path: '/message-push',
    component: Layout,
    redirect: '/message-push/config',
    name: 'MessagePush',
    meta: { title: '消息推送配置', icon: 'el-icon-s-promotion' },
    children: [
      {
        path: 'config',
        name: 'MessagePushConfig',
        component: () => import('@/views/message-push/index'),
        meta: { title: '消息推送配置' }
      },
      {
        path: 'config-details',
        name: 'MessagePushConfigDetails',
        hidden: true,
        component: () => import('@/views/message-push/config-details'),
        meta: { title: '推送配置详情', activeMenu: '/message-push/config' }
      }
    ]
  }
]
