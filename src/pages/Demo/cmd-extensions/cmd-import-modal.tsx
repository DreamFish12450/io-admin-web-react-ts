import React from 'react'
import {
  HookHub,
  ICmdHooks as IHooks,
  NsGraph,
  IModelService,
  IGraphPipelineCommand,
  XFlowEdgeCommands,
  NsEdgeCmd,
  uuidv4,
  XFlowNodeCommands,
  NsNodeCmd,
  NsGroupCmd,
} from '@antv/xflow'
import { Deferred, ManaSyringe } from '@antv/xflow'
import { FormInstance, Select } from 'antd'
import { Modal, Form, Input, ConfigProvider } from 'antd'
import { IRequest } from '@/utils/request.type'
import { post } from '@/utils/request'
// import { DND_RENDER_ID } from '../static/constant'
import { judge } from '@/utils/evalRPN'
// import { NsImportModuleCmd } from './cmd-extensions/cmd-import-modal'
// import { CustomCommands } from './cmd-extensions/constants'
import type { IArgsBase, ICommandHandler, IGraphCommandService } from '@antv/xflow'
import { ICommandContextProvider } from '@antv/xflow'


import 'antd/es/modal/style/index.css'
import { TOOLBAR_ITEMS } from '../config-toolbar'
import { DND_RENDER_ID, GROUP_NODE_RENDER_ID } from '../constant'
import { CustomCommands } from './constants'

type ICommand = ICommandHandler<NsImportModuleCmd.IArgs, NsImportModuleCmd.IResult, NsImportModuleCmd.ICmdHooks>

export namespace NsImportModuleCmd {
  /** Command: 用于注册named factory */
  export const command = CustomCommands.SHOW_IMPORT_MODAL
  /** hook name */
  export const hookKey = 'renameNode'
  /** hook 参数类型 */
  export interface IArgs extends IArgsBase {
    res: any
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
    renameNode: HookHub<IArgs, IResult>
  }
}

@ManaSyringe.injectable()
/** 部署画布数据 */
export class ImportModuleCommand implements ICommand {
  /** api */
  @ManaSyringe.inject(ICommandContextProvider) contextProvider: ICommand['contextProvider']

  /** 执行Cmd */
  execute = async () => {
    const ctx = this.contextProvider()
    const { args, hooks: runtimeHook } = ctx.getArgs()
    const hooks = ctx.getHooks()
    const result = await hooks.renameNode.call(args, async (args) => {
      const { res, commandService, modelService, updateNodeNameService } = args
      // const preNodeName = nodeConfig.label

      const getAppContext: IGetAppCtx = () => {
        return {
          commandService,
          modelService,
          updateNodeNameService,
        }
      }

      // const x6Graph = await ctx.getX6Graph()
      // const cell = x6Graph.getCellById(nodeConfig.id)

      // if (!cell || !cell.isNode()) {
      //   throw new Error(`${nodeConfig.id} is not a valid node`)
      // }
      /** 通过modal 获取 new name */
      const newName = await showModal(res, getAppContext)
      /** 更新 node name  */
      //   if (newName) {
      //     const cellData = cell.getData<NsGraph.INodeConfig>()
      //     cell.setData({ ...cellData, label: newName } as NsGraph.INodeConfig)
      //     return { err: null, preNodeName, currenNodetName: newName }
      //   }
      //   return { err: null, preNodeName, currenNodetName: '' }
    })

    ctx.setResult(result)
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
    updateNodeNameService: NsImportModuleCmd.IUpdateNodeNameService
  }
}

export type IModalInstance = ReturnType<typeof Modal.confirm>
export interface IFormProps {
  newNodeName: string
  stuId?: string
  moduleLabel: string
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
}

function showModal(res: any, getAppContext: IGetAppCtx) {
  /** showModal 返回一个Promise */
  const defer = new Deferred<string | void>()

  /** modal确认保存逻辑 */
  class ModalCache {
    static modal: IModalInstance
    static form: FormInstance<IFormProps>
    static res: any
  }

  /** modal确认保存逻辑 */
  const onOk = async () => {
    const { form, modal } = ModalCache
    const appContext = getAppContext()
    const { updateNodeNameService, graphMeta, commandService } = appContext
    try {
      modal.update({ okButtonProps: { loading: true } })
      await form.validateFields()
      const values = await form.getFieldsValue()
      const newName: string = values.newNodeName
      const moduleLabelName: string = values.moduleLabel
      const childrenList = []
      let num = 15
      const groupChildrenId: string[] = []
      res = ModalCache.res.find((c) => {
        return c.label === moduleLabelName
      })
      console.log(res, '++', commandService)
      /** 执行 backend service */
      if (res) {
        let formulaArr = res.formula.split('+')
        let xBais = 1
        formulaArr.forEach((element: string) => {
          const stack: any[] = []
          let output = element.split('-')[0]
          let oldOutputPort: string
          let childId: string
          let inputArr = element.split('-')[1].split(',')
          inputArr = inputArr.filter((v: any) => {
            return judge(v)
          })
          var yBais = 1
          inputArr.forEach(async (v: string, index: number) => {
            console.log('yBais', yBais)
            let oid = uuidv4()
            groupChildrenId.push(oid)
            const args: NsNodeCmd.AddNode.IArgs = {
              nodeConfig: {
                label: v,
                renderKey: DND_RENDER_ID,
                id: oid,
                x: 50 + xBais * 90,
                y: 50 - yBais++ * 80,
              },
            }
            if (index > 0) {
              let tempOldPort
              commandService.executeCommandPipeline([
                {
                  commandId: XFlowNodeCommands.ADD_NODE.id,
                  getCommandOption: async () => {
                    return {
                      args: args,
                    }
                  },
                } as IGraphPipelineCommand<NsNodeCmd.AddNode.IArgs>,
                {
                  commandId: XFlowEdgeCommands.ADD_EDGE.id,
                  getCommandOption: async () => {
                    let resInput
                    await window.app.getNodeById(oid).then((targetData) => {
                      resInput = targetData?.port.ports.find((v: any) => {
                        return v?.connected !== true && v?.type == 'input'
                      }).id
                      tempOldPort = targetData?.port.ports.find((v: any) => {
                        return v?.connected !== true && v?.type == 'output'
                      }).id
                    })
                    let EdgeArgs: NsEdgeCmd.AddEdge.IArgs = {
                      edgeConfig: {
                        id: uuidv4(),
                        source: childId,
                        target: oid,
                        targetPortId: resInput,
                        sourcePortId: oldOutputPort,
                      },
                    }
                    return {
                      args: { ...EdgeArgs },
                    }
                  },
                } as IGraphPipelineCommand<NsEdgeCmd.AddEdge.IArgs>,
              ])
              childId = oid
              oldOutputPort = tempOldPort || ''
            } else {
              await commandService.executeCommand(XFlowNodeCommands.ADD_NODE.id, args)
              childId = oid
              await window.app.getNodeById(oid).then((targetData) => {
                oldOutputPort = targetData?.port.ports.find((v: any) => {
                  return v?.connected !== true && v?.type == 'output'
                }).id
                console.log('oldOutputPort', oldOutputPort)
              })
            }
          })
          xBais += 1
        })
        // const groupChildren = cells.map((cell) => cell.id)
        commandService.executeCommand<NsGroupCmd.AddGroup.IArgs>(TOOLBAR_ITEMS.ADD_GROUP, {
          nodeConfig: {
            id: uuidv4(),
            renderKey: GROUP_NODE_RENDER_ID,
            groupChildren: groupChildrenId,
            label: res.label,
          },
        })
        console.log('groupChildrenId', groupChildrenId)
      }

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
    ModalCache.res = null as any
    container.destroy()
  }

  /** modal内容 */
  const ModalContent = () => {
    const [form] = Form.useForm<IFormProps>()
    const [labelName, setLabelName] = React.useState(res[0].label)
    /** 缓存form实例 */
    ModalCache.form = form
    ModalCache.res = res
    return (
      <div>
        <ConfigProvider>
          <Form form={form} {...layout} initialValues={{}}>
            <Form.Item name="moduleLabel" label="模块名" rules={[{ required: true, message: '请选择' }]}>
              {/* <Select defaultValue={provinceData[0]} style={{ width: 120 }} onChange={handleProvinceChange}>
                {provinceData.map((province) => (
                  <Select.Option key={province}>{province}</Select.Option>
                ))}
              </Select> */}
              <Select style={{ width: 120 }} value={labelName}>
                {res.map((l: any) => (
                  <Select.Option key={l.label}>{l.label}</Select.Option>
                ))}
              </Select>
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
    title: '导入',
    content: <ModalContent />,
    getContainer: () => {
      return container.element
    },
    okButtonProps: {
      onClick: (e) => {
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
