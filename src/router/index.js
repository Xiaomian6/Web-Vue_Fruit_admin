import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: 'dashboard',
    //hidden: true,
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/useradmin',
    component: Layout,
    meta: { title: '用户管理', icon: 'peoples', roles: ['admin'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/useradmin/index'),
        meta: { title: '用户管理', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/storeadmin',
    component: Layout,
    name: '管理店铺后台',
    meta: { title: '管理店铺后台', icon: '' +
        '店铺' },
    children: [
      {
        path: 'storeinfo',
        name: '店铺信息',
        component: () => import('@/views/storeadmin/storeinfo'),
        meta: { title: '店铺信息', icon: '50店铺-线性' }
      },
      {
        path: 'commodityaudit',
        name: '商品上架审核',
        component: () => import('@/views/storeadmin/commodityaudit'),
        meta: { title: '商品上架审核', icon: '发货' }
      },
      {
        path: 'ordermanagement',
        name: '订单管理',
        component: () => import('@/views/storeadmin/ordermanagement'),
        meta: { title: '订单管理', icon: '订单' }
      }
    ]
  },
  {
    path: '/purchaseadmin',
    component: Layout,
    name: '管理采购后台',
    meta: { title: '管理采购后台', icon: '采购自营' },
    children: [
      {
        path: 'purchaseinfo',
        name: '采购方信息',
        component: () => import('@/views/purchaseadmin/purchaseinfo'),
        meta: { title: '采购方信息', icon: '用户-圆' }
      },
      {
        path: 'taskreview',
        name: '任务审核',
        component: () => import('@/views/purchaseadmin/taskreview'),
        meta: { title: '任务审核', icon: '任务' }
      }
    ]
  },
  {
    path: '/acquisitionadmin',
    component: Layout,
    name: '管理收购后台',
    meta: { title: '管理收购后台', icon: '政府采购管理' },
    children: [
      {
        path: 'acquisitioninfo',
        name: '收购方信息',
        component: () => import('@/views/acquisitionadmin/acquisitioninfo'),
        meta: { title: '收购方信息', icon: '用户-圆' }
      },
      {
        path: 'taskreview',
        name: '任务审核',
        component: () => import('@/views/acquisitionadmin/taskreview'),
        meta: { title: '任务审核', icon: '任务' }
      }
    ]
  },
  {
    path: '/transportadmin',
    component: Layout,
    name: '管理运输后台',
    meta: { title: '管理运输后台', icon: '快递' },
    children: [
      {
        path: 'transportinfo',
        name: '运输方信息',
        component: () => import('@/views/transportadmin/transportinfo'),
        meta: { title: '运输方信息', icon: '用户-圆' }
      },
      {
        path: 'taskreview',
        name: '任务审核',
        component: () => import('@/views/transportadmin/taskreview'),
        meta: { title: '任务审核', icon: '任务' }
      }
    ]
  },
  {
    path: '/authentication',
    component: Layout,
    name: '认证入驻管理',
    meta: { title: '认证入驻管理', icon: '职位身份' },
    children: [
      {
        path: 'authenticateapply',
        name: '申请认证用户',
        component: () => import('@/views/authentication/authenticateapply'),
        meta: { title: '申请认证用户', icon: '申请' }
      },
      {
        path: 'authenticatesuccess',
        name: '认证成功用户',
        component: () => import('@/views/authentication/authenticatesuccess'),
        meta: { title: '认证成功用户', icon: '认证用户' }
      },
      {
        path: 'authenticatefail',
        name: '认证失败用户',
        component: () => import('@/views/authentication/authenticatefail'),
        meta: { title: '认证失败用户', icon: '失败' }
      }
    ]
  },
  {
    path: '/customeradmin',
    component: Layout,
    name: '客服管理',
    meta: { title: '客服管理', icon: '客服' , roles: ['admin']},
    children: [
      {
        path: 'index',
        name: '客服管理',
        component: () => import('@/views/customeradmin/index'),
        meta: { title: '客服管理', icon: '客服' }
      }
    ]
  },
  {
    path: '/financeadmin',
    component: Layout,
    name: '财务管理',
    meta: { title: '财务管理', icon: 'recharge_fill' , roles: ['admin']},
    children: [
      {
        path: 'authenticatecash',
        name: '认证入驻押金',
        component: () => import('@/views/financeadmin/authenticatecash'),
        meta: { title: '认证入驻押金', icon: '转账' }
      },
      {
        path: 'taskcase',
        name: '任务押金',
        component: () => import('@/views/financeadmin/taskcase'),
        meta: { title: '任务押金', icon: '红包' }
      }
    ]
  },
  {
    path: '/commentadmin',
    component: Layout,
    name: '评论管理',
    meta: { title: '评论管理', icon: 'comments' ,roles: ['admin']},
    children: [
      {
        path: 'index',
        name: '评论管理',
        component: () => import('@/views/commentadmin/index'),
        meta: { title: '评论管理', icon: 'comments' }
      }
    ]
  },
  {
    path: '/datastatistics',
    component: Layout,
    name: '数据统计',
    meta: { title: '数据统计', icon: '监控', roles: ['admin']},
    children: [
      {
        path: 'index',
        name: '数据统计',
        component: () => import('@/views/datastatistics/index'),
        meta: { title: '数据统计', icon: '监控' }
      }
    ]
  }, /*
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },*/

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
