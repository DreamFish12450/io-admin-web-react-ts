import React from 'react'
import Layout from '@/layout'
import Login from '@/pages/Login'

import { RouterType } from '@/router/router.type'
import NoPage from '@/pages/NoPage'
import Home from '@/pages/Home'
import Demo from '@/pages/Demo'
import Manage from '@/pages/Manage'
import StuManage from '@/pages/StuManage'
export const noPermission: RouterType[] = [
  {
    path: '/login',
    component: Login,
    exact: true,
    key: '/login',
    isShow: false,
  },
  {
    path: '/404',
    component: Layout,
    children: [
      {
        key: '404',
        component: NoPage,
        isShow: false,
      }
    ]
  },
  {
    name: '管理',
    path: '/Manage',
    key: '/Manage',
    component: Layout,
    exact: true,
    isShow:true,
    children: [
      {
        path: '/Manage/Manage',
        key: '/Manage/Manage',
        name: '成绩管理',
        component: Manage,
        exact: true,
        isShow: true,
      },
      {
        path: '/Manage/StuManage',
        key:'/Manage/StuManage',
        name: '学生管理',
        exact: true,
        component:StuManage,
        isShow: true,
      }
    ]
  },
  {
    path: '/Demo',
    key:'/Demo',
    component: Layout,
    isShow:true,
    exact: true,
    name: '实验部分',
    children: [
      {
        path: '/Demo/Demo',
        key: '/Demo/Demo',
        name:'实验',
        exact: true,
        component: Demo,
        isShow: true,
      }
    ]
  },
]

const routers: RouterType[] = [
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/discover/discover',
  //   exact: true,
  //   key: '/',
  //   isShow: false,
  // },
  // {
  //   path: '/discover',
  //   component: Layout,
  //   redirect: '/discover/discover',
  //   key: '/discover/discover',
  //   exact: true,
  //   isShow: false,
  // },
  // {
  //   path: '/discover',
  //   key: '/discover',
  //   name: '仪表盘',
  //   component: Layout,
  //   isShow: true,
  //   permissions: ['get'],
  //   children: [
  //     {
  //       path: '/discover/discover',
  //       key: '/discover/discover',
  //       component: React.lazy(() => import('@/pages/Discover')),
  //       exact: true,
  //       name: '仪表盘',
  //       isShow: true,
  //       permissions: ['get:discover'],
  //     },
  //     {
  //       path: '/discover/test',
  //       key: '/discover/test',
  //       component: React.lazy(() => import('@/pages/Test')),
  //       exact: true,
  //       name: '测试',
  //       isShow: true,
  //       permissions: ['get:discover:test'],
  //     },
  //     {
  //       path: '/discover/home',
  //       key: '/discover/home',
  //       component: React.lazy(() => import('@/pages/Home')),
  //       exact: true,
  //       name: '首页',
  //       isShow: true,
  //       permissions: ['get:discover:home'],
  //     },
  //   ],
  // },
  // {
  //   path: '/discover/demo',
  //   component: Layout,
  //   redirect: '/discover/demo',
  //   key: '/discover/demo',
  //   exact: true,
  //   isShow: true,
  //   name: 'Demo',
  //   permissions: ['get:discover:demo'],
  // },
  ...noPermission,
]

export default routers
