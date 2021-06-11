import axios, { AxiosRequestConfig, AxiosError, AxiosResponse, AxiosPromise } from 'axios'
import { IRequest, IResponse } from '@/utils/request.type'
import { message } from 'antd'

// https://cn.vitejs.dev/guide/env-and-mode.html#env-variables
const isDevelopment = import.meta.env.DEV

const request = axios.create({
  // 若需要vite代理，这里就不要设置
  // baseURL: 'https://qqlykm.cn',
  // timeout: 10 * 1000,
})

// 添加一个请求的拦截
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 配置代理后，在这里统一设置前缀，不必在api中每个都添加
    config.url = '/api' + config.url
    // 设置统一header头
    config.headers['Authorization'] =
      'Bearer eyJhbGciOiJSUzI1NiJ9.eyJERVRBSUxTIjoie1wiYWNjb3VudE5vbkV4cGlyZWRcIjp0cnVlLFwiYWNjb3VudE5vbkxvY2tlZFwiOnRydWUsXCJjcmVkZW50aWFsc05vbkV4cGlyZWRcIjp0cnVlLFwiZW5hYmxlZFwiOnRydWUsXCJpZFwiOjEsXCJyb2xlc1wiOltcInJvbGVfYWRtaW5cIixcInJvbGVfdXNlclwiXSxcInVzZXJuYW1lXCI6XCJyb290XCJ9IiwiZXhwIjoxNjI0MDI1Mzc2fQ.azHQZYjRxvcN4KYpOl7DcK79HEck9x8mLXMZSvNNBox-M9ILiU8piXlL_OwgUO37MxhyEmIac8KAHj9KNrDLK2o3OjKJRF6JqptuVS1AcfjZ_tCd8ubFbwr67SjoecG1SRVrthXAlX2_yJrv_Xp2gdn83L-djyzHhdWPiKYZ04s'
    return config
  },
  (error: AxiosError) => {
    message.error(error.message)
    return Promise.reject(error)
  },
)

// 响应拦截
request.interceptors.response.use(
  (resp: AxiosResponse<IResponse<any>>) => {
    const { data } = resp

    if (data.code !== 200) {
      message.error(data.msg)
    }

    return data.data as any
  },
  (error: AxiosError) => {
    message.error(error.message)
    return Promise.reject(error)
  },
)

const get = (url: string, params?: object, headers?: object): Promise<any> => {
  return new Promise((resolve) => {
    request({ url, method: 'GET', params, headers: headers })
      .then((res) => resolve(res))
      .catch((e) => console.error(e))
  })
}

const post = ({ url, params, headers }: IRequest<any>): Promise<any> => {
  return new Promise((resolve) => {
    request({ url, method: 'POST', params, headers })
      .then((res) => resolve(res))
      .catch((e) => console.error(e))
  })
}

const del = (url: string, params?: object, headers?: object): Promise<any> => {
  return new Promise((resolve) => {
    request({ url, method: 'DELETE', params, headers })
      .then((res) => resolve(res))
      .catch((e) => console.error(e))
  })
}

const put = ({ url, params, headers }: IRequest<any>): Promise<any> => {
  return new Promise((resolve) => {
    request({ url, method: 'PUT', params, headers })
      .then((res) => resolve(res))
      .catch((e) => console.error(e))
  })
}

const http = ({ url, method, params, headers }: IRequest<any>): Promise<any> => {
  return new Promise((resolve) => {
    request({ url, method, params, headers })
      .then((res) => resolve(res))
      .catch((e) => console.error(e))
  })
}

export { http, get, post, del, put }
