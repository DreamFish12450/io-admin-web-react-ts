import React, { memo } from 'react'

import { Link, useHistory } from 'react-router-dom'

import { MenuDataItem, PageContainer, ProBreadcrumb } from '@ant-design/pro-layout'
import ProLayout from '@ant-design/pro-layout'
import { SmileOutlined, HeartOutlined } from '@ant-design/icons'
import renderRoutes from '@/router/renderRoutes'
import visual from '@/pages/Demo/static/visual.svg'
import routers from '@/router'
import { hasPermission } from '@/utils/permission'
import Manage from '@/pages/Manage'
import StuManage from '@/pages/StuManage'
import Demo from '@/pages/Demo'

interface IProperties {
  route: any
}

const IconMap = {
  smile: <SmileOutlined />,
  heart: <HeartOutlined />,
}
// const visual = require()
/**
 * 将路由中需要展示,并且拥有该权限的菜单提取出来
 * @param menus
 */
const loopMenu = (menus: MenuDataItem[]): MenuDataItem[] => {
  let list = []
  if (menus) {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].isShow) {
        let menu = loopMenu(menus[i].children as MenuDataItem[])
        menus[i].children = loopMenu(menus[i].children as MenuDataItem[])
        // console.log("menus",menus[i]);
        list.push(menus[i])
      } else {
        let menu = loopMenu(menus[i].children as MenuDataItem[])
        if (menu && menu.length != 0) {
          menu.map((e) => {
            list.push(e)
          })
        }
      }
    }
  }
  return list
}
const CustomMenu = [
  {
    path: '/Demo',
    name: '实验部分',
    key: '/Demo',
    routes: [
      {
        path: '/Demo/Demo',
        key: '/Demo/Demo',
        name: '实验',
        component: Demo,
        isShow: true,
      },
    ],
  },
]
const Layout: React.FC<IProperties> = (props): React.ReactElement => {
  const history = useHistory()

  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        fixSiderbar
        location={{ pathname: history.location.pathname }}
        menu={{
          request: async () => {
            if (sessionStorage.getItem('level') == '1' && CustomMenu.length == 1) {
              CustomMenu.push({
                name: '管理',
                path: '/Manage',
                key: '/Manage',

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
                    key: '/Manage/StuManage',
                    name: '学生管理',
                    component: StuManage,
                    isShow: true,
                  },
                ],
              })
            }
            return CustomMenu
          },
        }}
        headerContentRender={() => <ProBreadcrumb />}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '主页',
          },
          ...routers,
        ]}
        logo={() => null}
        title="虚拟仿真实验"
        onMenuHeaderClick={(e) => history.push('/discover/discover')}
        menuItemRender={(item, dom) => {
          return item.itemPath === history.location.pathname ? (
            dom
          ) : (
            <Link to={item.itemPath !== history.location.pathname && item.itemPath}>{dom}</Link>
          )
        }}
      >
        <React.Suspense fallback={<i />}>{renderRoutes(props.route.children)}</React.Suspense>
      </ProLayout>
    </div>
  )
}

export default memo(Layout)
