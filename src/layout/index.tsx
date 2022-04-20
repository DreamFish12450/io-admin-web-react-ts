import React, { memo } from 'react'

import { Link, useHistory } from 'react-router-dom'

import { MenuDataItem, PageContainer } from '@ant-design/pro-layout'
import ProLayout from '@ant-design/pro-layout'
import { SmileOutlined, HeartOutlined } from '@ant-design/icons'
import renderRoutes from '@/router/renderRoutes'

import routers from '@/router'
import { hasPermission } from '@/utils/permission'
import Manage from '@/pages/Manage'
import StuManage from '@/pages/StuManage'
import Demo from '@/pages/Demo'

interface IProperties {
  route: any
}

const IconMap = {
  smile: <SmileOutlined/>,
  heart: <HeartOutlined/>,
}

/**
 * 将路由中需要展示,并且拥有该权限的菜单提取出来
 * @param menus
 */
const loopMenu = (menus: MenuDataItem[]): MenuDataItem[] => {
  let list = []
  if (menus) {
    for (let i = 0; i < menus.length; i++) {

      if(menus[i].isShow){
        let menu = loopMenu(menus[i].children as MenuDataItem[])
        menus[i].children = loopMenu(menus[i].children as MenuDataItem[])
        // console.log("menus",menus[i]);
        list.push(menus[i])
      } else {
          let menu = loopMenu(menus[i].children as MenuDataItem[])
          if (menu && menu.length != 0) {
            menu.map(e => {
                list.push(e)
            })
          }
        }
      // TODO 权限管理
      // let permissions = menus[i].permissions || []
      // if (menus[i].isShow && hasPermission(permissions, 1)) {
      //   menus[i].children = loopMenu(menus[i].children as MenuDataItem[])
      //   list.push(menus[i])
      // } else {
      //   let menu = loopMenu(menus[i].children as MenuDataItem[])
      //   if (menu && menu.length != 0) {
      //     menu.map(e => {
      //       if (hasPermission(e.permissions || [], 1)) {
      //         list.push(e)
      //       }
      //     })
      //   }
      // }
    }
  }
  // console.log("list",list)
  return list
} 
const CustomMenu =  [
  {
    name: '管理',
    path: '/Manage',
    key: '/Manage',
    isShow:true,
    routes: [
      {
        path: '/Manage/Manage',
        key: '/Manage/Manage',
        name: '成绩管理',
        component: Manage,
        isShow: true,
      },
      {
        path: '/Manage/StuManage',
        key:'/Manage/StuManage',
        name: '学生管理',
        component:StuManage,
        isShow: true,
      }
    ]
  },
  {
    path: '/Demo',
    name: 'Demo',
    key: '/Demo',
    routes: [
      {
        path: '/Demo/Demo',
        key: '/Demo/Demo',
        name: '实验',
        component: Demo,
        isShow: true,
      },
    ]
  },
];
const Layout: React.FC<IProperties> = (props): React.ReactElement => {
  const history = useHistory()

  return (
    <ProLayout
      style={{
        height: 800,
      }}
      fixSiderbar
      location={{ pathname: history.location.pathname }}
      menu={{ request: async () => CustomMenu }}
      onMenuHeaderClick={(e) => history.push('/discover/discover')}
      menuItemRender={
        (item, dom) => {
          return item.itemPath === history.location.pathname ? (
            dom) :
            (<Link to={item.itemPath !== history.location.pathname && item.itemPath}>{dom}</Link>)
        }
      }
    >
      <React.Suspense fallback={<i/>}>{renderRoutes(props.route.children)}</React.Suspense>
    </ProLayout>
  )
}

export default memo(Layout)
