import { http, get, del, post, put } from '@/utils/request'

import { ICaptcha, ILoginSubmit } from '@/models/ILogin'
import { IPermissions } from '@/models/IDiscover'

export const loginSubmit = (data: ILoginSubmit, params: object): Promise<string> =>{
  console.log("data",data, params)
  return post({ url: '/api/user/select', data, params })
}


export const getCaptcha = (key: string = ''): Promise<ICaptcha> => get('/common/captcha.jpg', { key })
export const getPermissionsByUserRole = (): Promise<IPermissions[]> => get('/resources/permissions/list/by/user/role')
