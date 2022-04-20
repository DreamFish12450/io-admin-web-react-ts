import React, { FC, ReactNode, useEffect, useState } from 'react'
import { Layout, Menu, Icon } from 'antd'
import { connect, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { RouteConfig } from 'react-router-config'

import { siderCollapsedSelector } from '@/store/settings/selectors'
import { toggleSiderCollapsed } from '@/store/settings/actions'
import './sider.scss'

const { Sider } = Layout
const { SubMenu } = Menu

/**
 * siderCollapsed 侧边栏是否折叠
 * routes         路由配置文件
 */
export interface DuSiderProps {
  siderCollapsed: boolean
  routes?: Array<RouteConfig>
}

const DuSider: FC<DuSiderProps> = props => {
  const { siderCollapsed, routes } = props
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(['Dashboard'])

  useEffect(() => {
    setDefaultSelectedKeys(defaultSelectedKeys => {
      defaultSelectedKeys.push(location.pathname)
      return defaultSelectedKeys
    })
  }, [defaultSelectedKeys, location.pathname])

  function onToggleSider(broken: boolean) {
    dispatch(toggleSiderCollapsed({ siderCollapsed: broken }))
  }

  function handleSiderClick(route: RouteConfig) {
    history.replace(`${route.path}`)
    document.title = route.meta.title
  }

  /**
   * render sider menu
   * @param   routes
   * @return  menuNode
   */
  function renderSiderMenu<T extends RouteConfig>(routes: Array<T>): ReactNode {
    let menuNode: Array<ReactNode> = []
    menuNode = routes.map(route => {
      const subRoutes: Array<RouteConfig> = route.routes || []
      if (route.name === '404') {
        return null
      }
      /**
       * 无子路由，初始渲染
       */
      if (subRoutes.length <= 0) {
        return (
          <Menu.Item
            key={String(route.path)}
            onClick={() => handleSiderClick(route)}
          >
            <Icon type={route.meta.icon} />
            <span className='nav-text'>{route.name}</span>
          </Menu.Item>
        )
      }
      /**
       * 有子路由，递归渲染
       */
      return (
        <SubMenu
          key={route.name}
          title={
            <span>
              <Icon type={route.meta.icon} />
              <span>{route.name}</span>
            </span>
          }
        >
          {renderSiderMenu(subRoutes)}
        </SubMenu>
      )
    })

    return menuNode
  }

  return (
    <>
      <Sider
        breakpoint='lg'
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0
        }}
        trigger={null}
        collapsed={siderCollapsed}
        onBreakpoint={broken => {
          onToggleSider(broken)
        }}
      >
        <div className='logo' />
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={defaultSelectedKeys}
        >
          {routes && renderSiderMenu(routes)}
        </Menu>
      </Sider>
    </>
  )
}

export default connect(siderCollapsedSelector)(DuSider)
