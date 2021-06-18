import Layout from '@/layout/index'
export default {
  path: '/app-version',
  component: Layout,
  redirect: '/app-version/list',
  name: 'AppVersion',
  meta: { title: 'App版本管理', icon: 'el-icon-magic-stick' },
  children: [
    {
      path: 'list',
      name: 'AppVersionList',
      component: () => import('@/views/app-version/index'),
      meta: { title: 'App版本' }
    },
    {
      path: 'record-list/:appCode',
      name: 'AppVersionRecordList',
      hidden: true,
      component: () => import('@/views/app-version/versionRecordList'),
      meta: { title: '版本记录', activeMenu: '/app-version/list' }
    }
  ]
}
