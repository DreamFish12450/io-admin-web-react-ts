import React, { memo, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { message } from 'antd'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { MobileOutlined } from '@ant-design/icons'

import { ICaptcha, ILoginSubmit } from '@/models/ILogin'
import { getPermissionsByUserRole, loginSubmit } from '@/api/system'
import { getCaptcha } from '@/api/system'
import { setPermissions, setToken } from '@/utils/localStoreUtil'
import './style.default.css'
import './bootstrap.min.css'
import { post } from '@/utils/request'
interface IProperties {}

const Login: React.FC<IProperties> = (props): React.ReactElement => {
  const history = useHistory()
  const [captcha, setCaptcha] = useState({} as ICaptcha)

  useEffect(() => {
    getCaptchaHandler()
  }, [])

  const getCaptchaHandler = () => {
    getCaptcha(captcha.key).then((res) => {
      setCaptcha(res)
    })
  }

  const onFinish = (values: ILoginSubmit | any): any => {
    console.log('values', values)
    let obj = {
      url: '/api/user/login',
      params: values,
    }
    post(obj).then((res) => {
      if (res.data.message === 'ok') {
        message.success('登陆成功')
        sessionStorage.setItem("level",res.data.data.level)
        sessionStorage.setItem("id",res.data.data.id)
        setTimeout(() => {
          history.replace('/Demo/Demo')
        }, 500)
      } else {
        message.error(res.data.message)
      }
    })
  }

  return (
    <div className="page login-page">
      <div className="container d-flex align-items-center">
        <div className="form-holder has-shadow">
          <div className="row">
            <div className="col-lg-6">
              <div className="info d-flex align-items-center">
                <div className="content">
                  <div className="logo">
                    <h1>计算机组成原理</h1>
                    <h1>虚拟仿真实验平台</h1>
                  </div>
                  <p>Computer Composition Principle Virtual Simulation Experiment Platform </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 bg-white">
              <div className="form d-flex align-items-center">
                <div className="content">
                  <div className="align-items-center">
                    <div>
                      <div
                        style={{
                          width: 330,
                          margin: 'auto',
                        }}
                      >
                        <ProForm
                          onFinish={onFinish}
                          submitter={{
                            searchConfig: {
                              submitText: '登录',
                            },
                            render: (_: any, dom: any) => dom.pop(),
                            submitButtonProps: {
                              size: 'large',
                              style: {
                                width: '100%',
                              },
                            },
                          }}
                        >
                          <div
                            style={{
                              marginTop: 12,
                              textAlign: 'center',
                              marginBottom: 40,
                            }}
                          ></div>
                          <ProFormText
                            fieldProps={{
                              size: 'large',
                              prefix: <MobileOutlined />,
                            }}
                            name="id"
                            placeholder="请输入账号"
                            rules={[
                              {
                                required: true,
                                message: '请输入账号!',
                              },
                            ]}
                          />
                          <ProFormText
                            fieldProps={{
                              size: 'large',
                              prefix: <MobileOutlined />,
                            }}
                            name="password"
                            placeholder="请输入密码"
                            rules={[
                              {
                                required: true,
                                message: '请输入密码!',
                              },
                            ]}
                          />
                          <img src={captcha.image} alt=""  />
                        </ProForm>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Login)
