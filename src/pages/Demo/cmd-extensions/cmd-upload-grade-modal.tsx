import React from 'react'
import type { HookHub, ICmdHooks as IHooks, NsGraph, IModelService } from '@antv/xflow'
import { Deferred, ManaSyringe } from '@antv/xflow'
import { FormInstance, message } from 'antd'
import { Modal, Form, Input, ConfigProvider } from 'antd'

import type { IArgsBase, ICommandHandler, IGraphCommandService } from '@antv/xflow'
import { ICommandContextProvider } from '@antv/xflow'

import { CustomCommands } from './constants'

import 'antd/es/modal/style/index.css'
import { post } from '@/utils/request'

type ICommand = ICommandHandler<
  NsUploadGradeCmd.IArgs,
  NsUploadGradeCmd.IResult,
  NsUploadGradeCmd.ICmdHooks
>

export namespace NsUploadGradeCmd {
  /** Command: 用于注册named factory */
  export const command = CustomCommands.SHOW_UPLOAD_MODAL
  /** hook name */
  export const hookKey = 'UploadGrade'
  /** hook 参数类型 */
  export interface IArgs extends IArgsBase {
    nodeConfig: NsGraph.INodeConfig
    updateNodeNameService: IUpdateNodeNameService
  }
  export interface IUpdateNodeNameService {
    (newName: string, nodeConfig: NsGraph.INodeConfig, meta: NsGraph.IGraphMeta): Promise<{
      err: string | null
      nodeName: string
    }>
  }
  /** hook handler 返回类型 */
  export interface IResult {
    err: string | null
    preNodeName?: string
    currenNodetName?: string
  }
  /** hooks 类型 */
  export interface ICmdHooks extends IHooks {
    UploadGrade: HookHub<IArgs, IResult>
  }
}

@ManaSyringe.injectable()
/** 部署画布数据 */
export class UploadGradeCommand implements ICommand {
  /** api */
  @ManaSyringe.inject(ICommandContextProvider) contextProvider: ICommand['contextProvider']

  /** 执行Cmd */
  execute = async () => {
    const ctx = this.contextProvider()
    const { args, hooks: runtimeHook } = ctx.getArgs()
    const hooks = ctx.getHooks()
    const result = await hooks.UploadGrade.call(args, async args => {
      const { nodeConfig,  commandService, modelService, updateNodeNameService } = args
      const preNodeName = nodeConfig.label
      const getAppContext: IGetAppCtx = () => {
        return {
          commandService,
          modelService,
          updateNodeNameService,
        }
      }
      const newName = await showModal(nodeConfig, getAppContext)
      const x6Graph = await ctx.getX6Graph()
      const cell = x6Graph.getCellById(nodeConfig.id)
    })
    // ctx.setResult(result)
    return this
  }

  /** undo cmd */
  undo = async () => {
    if (this.isUndoable()) {
      const ctx = this.contextProvider()
      ctx.undo()
    }
    return this
  }

  /** redo cmd */
  redo = async () => {
    if (!this.isUndoable()) {
      await this.execute()
    }
    return this
  }

  isUndoable(): boolean {
    const ctx = this.contextProvider()
    return ctx.isUndoable()
  }
}

export interface IGetAppCtx {
  (): {
    graphMeta: NsGraph.IGraphMeta
    commandService: IGraphCommandService
    modelService: IModelService
    updateNodeNameService: NsUploadGradeCmd.IUpdateNodeNameService
  }
}

export type IModalInstance = ReturnType<typeof Modal.confirm>
export interface IFormProps {
  grade:number
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
}

function showModal(node: NsGraph.INodeConfig, getAppContext: IGetAppCtx) {
  /** showModal 返回一个Promise */
  const defer = new Deferred<string | void>()

  /** modal确认保存逻辑 */
  class ModalCache {
    static modal: IModalInstance
    static form: FormInstance<IFormProps>
  }

  /** modal确认保存逻辑 */
  const onOk = async () => {
    const { form, modal } = ModalCache
    const appContext = getAppContext()
    const { updateNodeNameService, graphMeta } = appContext
    try {
      modal.update({ okButtonProps: { loading: true } })
      await form.validateFields()
      const values = await form.getFieldsValue()
      const grade: number = values.grade
      let obj = {
        url: '/api/grade/update1',
        params: {
          id: sessionStorage.getItem('curStuId') || 0,
          grade1:grade,
        },
      }
      post(obj).then((res)=>{
        if(res.data.message === '更新成功') {
          message.success(res.data.message)
        }else {
          message.error(res.data.message)
        }
      })
      console.log("grade",grade)
      /** 执行 backend service */


      /** 更新成功后，关闭modal */
      onHide()
    } catch (error) {
      console.error(error)
      /** 如果resolve空字符串则不更新 */
      modal.update({ okButtonProps: { loading: false } })
    }
  }

  /** modal销毁逻辑 */
  const onHide = () => {
    modal.destroy()
    ModalCache.form = null as any
    ModalCache.modal = null as any
    container.destroy()
  }
  const checkNum = (_: any, value: number) => {
    // console.log("num", value)
    if (value >= 0 && value <=100) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('成绩必须为0-100'))
  }
  const rule = [{ required: true, message: '请输入成绩' }, { validator: checkNum }]
  /** modal内容 */
  const ModalContent = () => {
    const [form] = Form.useForm<IFormProps>()
    /** 缓存form实例 */
    ModalCache.form = form

    return (
      <div>
        <ConfigProvider>
          <Form form={form} {...layout}>
            <Form.Item
              name="grade"
              label="请打分"
              rules={rule}
            >
              <Input />
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
    )
  }
  /** 创建modal dom容器 */
  const container = createContainer()
  /** 创建modal */
  const modal = Modal.confirm({
    title: '上传成绩',
    content: <ModalContent />,
    getContainer: () => {
      return container.element
    },
    okButtonProps: {
      onClick: e => {
        e.stopPropagation()
        onOk()
      },
    },
    onCancel: () => {
      onHide()
    },
    afterClose: () => {
      onHide()
    },
  })

  /** 缓存modal实例 */
  ModalCache.modal = modal

  /** showModal 返回一个Promise，用于await */
  return defer.promise
}

const createContainer = () => {
  const div = document.createElement('div')
  div.classList.add('xflow-modal-container')
  window.document.body.append(div)
  return {
    element: div,
    destroy: () => {
      window.document.body.removeChild(div)
    },
  }
}
