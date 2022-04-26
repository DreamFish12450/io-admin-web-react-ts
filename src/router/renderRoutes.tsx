import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { RouterType } from '@/router/router.type'
import { hasDefaultUri, hasPermission } from '@/utils/permission'
import { getPermissions, hasToken } from '@/utils/localStoreUtil'

const renderRoutes = (routes: RouterType[], extraProps = {}, switchProps = {}) => {
  console.log(33345)
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          render={
            props => {
              // 一些重定向操作
              if (route.redirect) {
                return <Redirect to={route.redirect}/>
              }
              let pathname = props.location.pathname
              let permissions = route.permissions || []
              // 如果是登陆状态访问登陆页面, 则跳转资源的第一个资源路径
              let permissionsStore = sessionStorage
              // 如果是免权限页面
              if (pathname === '/Login') {
                return returnRender(route, props, extraProps)
              } else if(pathname === '/'){
                console.log("pathname",pathname)
                return <Redirect to='/Login'/>
              } else {
                if(!sessionStorage.length) {
                  return <Redirect to='/Login'/>
                } else {
                  console.log("route",route)
                  return returnRender(route, props, extraProps)
                }
              }
            }
          }
        />
      ))}
      {/* <Redirect to='/Demo'/> */}
    </Switch>
  ) : null
}

const returnRender = (route: RouterType, props: any, extraProps = {}) => {
  
  return route.render ? (
    route.render({ ...props, ...extraProps, route: route })
  ) : (
    <route.component {...props} {...extraProps} route={route}/>
  )
}

export default renderRoutes
