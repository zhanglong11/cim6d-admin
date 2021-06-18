import Layout from '@/layout/index'
export const OARouter = [
  {
    path: '/oa',
    component: Layout,
    redirect: '/oa/formMange',
    name: 'OA',
    meta: { title: 'OA管理', icon: 'el-icon-s-platform' },
    children: [
      // {
      //   path: 'list',
      //   name: 'OAList',
      //   component: () => import('../index'),
      //   meta: { title: 'OA管理' }
      // },
      {
        path: 'formGroup',
        name: 'FormGroup',
        component: () => import('../formGroup'),
        meta: { title: '表单分组' }
      },
      {
        path: 'formStyle',
        name: 'FormStyle',
        component: () => import('../formStyle'),
        meta: { title: '审批样式库' }
      },
      {
        path: 'addFormStyle',
        name: 'AddFormStyle',
        hidden: true,
        component: () => import('../formStyle/editFormStyle'),
        meta: { title: '新建审批样式', activeMenu: '/oa/formStyle' }
      },
      {
        path: 'editFormStyle',
        name: 'EditFormStyle',
        hidden: true,
        component: () => import('../formStyle/editFormStyle'),
        meta: { title: '编辑审批样式', activeMenu: '/oa/formStyle' }
      },
      {
        path: 'formMange',
        name: 'FormMange',
        component: () => import('../formMange'),
        meta: { title: '管理固定表单' }
      },
      {
        path: 'addForm',
        name: 'AddForm',
        hidden: true,
        component: () => import('../formMange/editForm'),
        meta: { title: '新建表单', activeMenu: '/oa/formMange' }
      },
      {
        path: 'editForm',
        name: 'EditForm',
        hidden: true,
        component: () => import('../formMange/editForm'),
        meta: { title: '编辑表单', activeMenu: '/oa/formMange' }
      }
      // {
      //   path: 'formPreview',
      //   name: 'FormPreview',
      //   component: () => import('../formPreview'),
      //   meta: { title: '表单预览' }
      // }
    ]
  }
]
