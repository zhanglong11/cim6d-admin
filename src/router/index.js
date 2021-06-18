import Vue from 'vue'
import Router from 'vue-router'
import appVersion from '@/views/app-version/router' //app版本管理
import { messagePushRouter } from '@/views/message-push/router' // 消息推送路由
import { OARouter } from '@/views/oa/router' // OA管理路由

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/test',
    component: () => import('@/views/test/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    name: 'Company',
    redirect: '/company/index',
    meta: { title: '企业管理', icon: 'el-icon-office-building', type: 'icon' },
    children: [
      {
        path: '/company/index',
        name: 'CompanyList',
        component: () => import('@/views/company/index'),
        hidden: true,
        meta: { title: '', activeMenu: '/' }
      },
      {
        path: '/company/update',
        name: 'Update',
        component: () => import('@/views/company/update/index'),
        hidden: true,
        meta: { title: '添加企业', activeMenu: '/' }
      },
      {
        path: '/company/perssion',
        name: 'PerssionManage',
        component: () => import('@/views/company/perssion/index'),
        hidden: true,
        meta: { title: '授权管理', activeMenu: '/' }
      },
      {
        path: '/company/companyPower',
        name: 'CompanyPower',
        hidden: true,
        component: () => import('@/views/company/companyPower'),
        meta: { title: '功能配置', activeMenu: '/' }
      }
    ]
  },
  {
    path: '/service',
    component: Layout,
    redirect: '/service/index',
    meta: { title: '服务配置', icon: 'el-icon-data-analysis' },
    children: [
      {
        path: 'index',
        name: 'ServiceList',
        component: () => import('@/views/service/index'),
        meta: { title: '服务配置', activeMenu: '/service' },
        hidden: true
      },
      {
        path: 'module/:id',
        name: 'Module',
        hidden: true,
        component: () => import('@/views/service/module/index'),
        meta: { title: '模块管理', activeMenu: '/service' }
      }
    ]
  },
  {
    path: '/template',
    name: 'Template',
    component: Layout,
    meta: { title: '服务模板', icon: 'el-icon-s-check' },
    children: [
      {
        path: '',
        name: 'ServiceTemplate',
        hidden: false,
        component: () => import('@/views/template/index')
        // meta: { title: '模版管理' }
      },
      {
        path: 'detail',
        name: 'TemplateDetail',
        hidden: true,
        component: () => import('@/views/template/detail/index'),
        meta: { title: '功能配置' }
      },
      {
        path: 'add',
        name: 'AddTemplate',
        hidden: true,
        component: () => import('@/views/template/add'),
        meta: { title: '新建模板', activeMenu: '/template' }
      },
      {
        path: 'edit',
        name: 'EditTemplate',
        hidden: true,
        component: () => import('@/views/template/add'),
        meta: { title: '编辑模板', activeMenu: '/template' }
      }
    ]
  },

  {
    path: '/group',
    name: 'Group',
    component: Layout,
    meta: { title: '权限分组', icon: 'el-icon-s-check' },
    children: [
      {
        path: '',
        name: 'PowerGoup',
        hidden: true,
        component: () => import('@/views/power-group/index')
        // meta: { title: '模版管理' }
      },
      {
        path: 'add',
        name: 'AddPowerGroup',
        hidden: true,
        component: () => import('@/views/power-group/add'),
        meta: { title: '新建分组', activeMenu: '/group' }
      },
      {
        path: 'edit',
        name: 'EditPowerGroup',
        hidden: true,
        component: () => import('@/views/power-group/add'),
        meta: { title: '编辑分组', activeMenu: '/group' }
      }
    ]
  },

  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/index',
    children: [
      {
        path: 'index',
        name: 'Setting',
        component: () => import('@/views/setting/index'),
        meta: { title: '参数配置', icon: 'el-icon-setting', type: 'icon' }
      }
    ]
  },
  appVersion, //app版本管理
  ...messagePushRouter, // 消息推送路由
  ...OARouter, // OA管理路由
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
