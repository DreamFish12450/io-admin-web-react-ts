import React, { ReactNode } from 'react'
import { Switch, Route, SwitchProps, Redirect } from 'react-router-dom'
import { RouteConfig } from 'react-router-config'
// import Cookies from 'js-cookie'

/**
 * 加上路由鉴权的路由渲染
 * 参考实现   https://github.com/ReactTraining/react-router/blob/master/packages/react-router-config/modules/renderRoutes.js
 * @param  routes
 * @param  authed     是否已授权
 * @param  loginPath  未授权重定向至登录页
 * @param  extraProps
 * @param  switchProps
 */
function renderRoutes(
  routes: Array<RouteConfig> | undefined,
  authed: boolean = false,
  loginPath: string = '/login',
  extraProps: any = {},
  switchProps: SwitchProps = {}
): ReactNode {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route: RouteConfig | any, idx: number) => (
        <Route
          key={route.key || idx}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={props => {
            if (authed && route.path === loginPath) {
              window.history.back()
            }
            if (authed || route.path === loginPath || !route.requireAuth) {
              return route.render ? (
                route.render({ ...props, ...extraProps, route: route })
              ) : (
                <route.component {...props} {...extraProps} route={route} />
              )
            } else {
              return (
                <Redirect
                  to={{ pathname: loginPath, state: { from: props.location } }}
                />
              )
            }
          }}
        />
      ))}
    </Switch>
  ) : null
}

export default renderRoutes
