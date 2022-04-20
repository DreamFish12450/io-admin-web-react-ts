import React, { FC } from 'react'
import { Layout, Icon, Menu, Dropdown } from 'antd'
import { connect, useDispatch } from 'react-redux'

import { siderCollapsedSelector } from '@/store/settings/selectors'
import { toggleSiderCollapsed } from '@/store/settings/actions'
import { deleteToken } from '@/store/user/actions'
import './header.scss'

const { Header } = Layout

interface DuHeaderProps {
  siderCollapsed: boolean
}

const DuHeader: FC<DuHeaderProps> = props => {
  const { siderCollapsed } = props
  const dispatch = useDispatch()

  function toggleSider() {
    dispatch(toggleSiderCollapsed({ siderCollapsed: !siderCollapsed }))
  }

  function logout() {
    dispatch(deleteToken())
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <span>用户</span>
      </Menu.Item>
      <Menu.Item>
        <span onClick={logout}>退出登录</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Header className='du-header'>
        <Icon
          className='trigger'
          type={siderCollapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={toggleSider}
        />
        <Dropdown overlay={menu} trigger={['click']}>
          <div className='header-avatar-wrapper'>
            <img alt='' src={require('@/assets/images/logo.jpg')} />
          </div>
        </Dropdown>
      </Header>
    </>
  )
}

export default connect(siderCollapsedSelector)(DuHeader)
