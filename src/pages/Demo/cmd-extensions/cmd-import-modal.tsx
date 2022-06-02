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
  XFlowGroupCommands,
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
import { IBuildNode } from '@/models/ILogin'
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
      console.log('res', res)
      res = ModalCache.res.find((c) => {
        return c.label === moduleLabelName
      })
      console.log(res, '++', commandService)
      /** 执行 backend service */
      sessionStorage.setItem('curStuId', res.stuId)
      const commandPipeline: IGraphPipelineCommand<any>[] = []
      if (res) {
        let formulaArr = res.formula.split('+')
        let xBais = 1
        
        formulaArr.forEach((element: string) => {
          let count = 0
          let yBais = 1
          const stack: any[] = []
          let output = element.split('-')[0]
          let oldOutputPort: string
          let childId: string
          let inputArr = element.split('-')[1].split(',')
          const half = Math.ceil(inputArr.length / 2)
          const middleArr = inputArr.splice(0, half)
          const frontArr = inputArr.splice(-half)
          // 通过二叉树的前序和中序来还原二叉树
          function restoreTreeByFrontAndMiddle(frontArr, middleArr) {
            // 逻辑判断
            if (!frontArr || frontArr.length === 0 || !middleArr || middleArr.length === 0 || frontArr === middleArr)
              return null
            // 获取前序遍历的跟节点, 左子树的长度, 前序左子树，前序右子树， 中序左子树， 中序右子树
            let rootNode: IBuildNode = {
                label: frontArr[0] as string,
                checked: false,
              },
              index = middleArr.indexOf(frontArr[0]),
              frontArrLeft = frontArr.slice(1, index + 1),
              frontArrRight = frontArr.slice(index + 1, frontArr.length),
              middleArrLeft = middleArr.slice(0, index),
              middleArrRight = middleArr.slice(index + 1, middleArr.length)
            rootNode.left = restoreTreeByFrontAndMiddle(frontArrLeft, middleArrLeft)
            rootNode.right = restoreTreeByFrontAndMiddle(frontArrRight, middleArrRight)

            return rootNode
          }
          
          const stack1: number[] = []
          let pNode = restoreTreeByFrontAndMiddle(frontArr, middleArr)
          function preOrderTraverse1(root) {
            if (root != null) {
              if (true) {
                let oid = !root.checked ? uuidv4() : root.id
                let leftId = uuidv4()
                let rightId = uuidv4()
                if (root.left) {
                  root.left.checked = true
                  root.left.fatherId = oid
                  groupChildrenId.push(leftId)
                  root.left.id = leftId
                }
                !root.checked?groupChildrenId.push(oid):null
                if (root.right) {
                  root.right.checked = true
                  root.right.fatherId = oid
                  groupChildrenId.push(rightId)
                  root.right.id = rightId
                }
                yBais = !judge(root.label)?yBais++:yBais
                console.log("ybais",yBais)
                const rootArgs: NsNodeCmd.AddNode.IArgs = {
                  nodeConfig: {
                    label: root.label,
                    renderKey: DND_RENDER_ID,
                    id: oid,
                    x: 50 + xBais * 90,
                    y: 50 + yBais * 80,
                  },
                }
                const leftArgs: NsNodeCmd.AddNode.IArgs = {
                  nodeConfig: {
                    label: root.left ? root.left.label : '',
                    renderKey: DND_RENDER_ID,
                    id: leftId,
                    x: 0 + xBais * 90,
                    y: 120 + yBais * 90,
                  },
                }
                const rightArgs: NsNodeCmd.AddNode.IArgs = {
                  nodeConfig: {
                    label: root.right ? root.right.label : '',
                    renderKey: DND_RENDER_ID,
                    id: rightId,
                    x: 100 + xBais * 90,
                    y: 120 + yBais * 90,
                  },
                }
                !root.checked?commandPipeline.push({
                  commandId: XFlowNodeCommands.ADD_NODE.id,
                  getCommandOption: async () => {
                    return {
                      args: rootArgs,
                    }
                  },
                } as IGraphPipelineCommand<NsNodeCmd.AddNode.IArgs>):null
                !root.checked?count++: null
                root.left&&judge(root.left.label)
                  ? commandPipeline.push({
                      commandId: XFlowNodeCommands.ADD_NODE.id,
                      getCommandOption: async () => {
                        return {
                          args: leftArgs,
                        }
                      },
                    } as IGraphPipelineCommand<NsNodeCmd.AddNode.IArgs>)
                  : null
                  root.left&&judge(root.left.label)?count++: null
                root.right&&judge(root.right.label)
                  ? commandPipeline.push({
                      commandId: XFlowNodeCommands.ADD_NODE.id,
                      getCommandOption: async () => {
                        return {
                          args: rightArgs,
                        }
                      },
                    } as IGraphPipelineCommand<NsNodeCmd.AddNode.IArgs>)
                  : null
                root.left&&judge(root.left.label)
                  ? commandPipeline.push({
                      commandId: XFlowEdgeCommands.ADD_EDGE.id,
                      getCommandOption: async () => {
                        let resInput
                        let oldOutputPort
                        await window.app.getNodeById(oid).then((targetData) => {
                          resInput = targetData?.port.ports.find((v: any) => {
                            return v?.connected !== true && v?.type == 'input'
                          }).id
                        })
                        await window.app.getNodeById(leftId).then((targetData) => {
                          oldOutputPort = targetData?.port.ports.find((v: any) => {
                            return v?.connected !== true && v?.type == 'output'
                          }).id
                        })
                        let EdgeArgs: NsEdgeCmd.AddEdge.IArgs = {
                          edgeConfig: {
                            id: uuidv4(),
                            source: leftId,
                            target: oid,
                            targetPortId: resInput,
                            sourcePortId: oldOutputPort,
                          },
                        }
                        return {
                          args: { ...EdgeArgs },
                        }
                      },
                    } as IGraphPipelineCommand<NsEdgeCmd.AddEdge.IArgs>)
                  : null
                root.right&&judge(root.right.label)
                  ? commandPipeline.push({
                      commandId: XFlowEdgeCommands.ADD_EDGE.id,
                      getCommandOption: async () => {
                        let resInput
                        let oldOutputPort
                        await window.app.getNodeById(oid).then((targetData) => {
                          resInput = targetData?.port.ports.find((v: any) => {
                            return v?.connected !== true && v?.type == 'input'
                          }).id
                        })
                        await window.app.getNodeById(rightId).then((targetData) => {
                          oldOutputPort = targetData?.port.ports.find((v: any) => {
                            return v?.connected !== true && v?.type == 'output'
                          }).id
                        })
                        let EdgeArgs: NsEdgeCmd.AddEdge.IArgs = {
                          edgeConfig: {
                            id: uuidv4(),
                            source: rightId,
                            target: oid,
                            targetPortId: resInput,
                            sourcePortId: oldOutputPort,
                          },
                        }
                        return {
                          args: { ...EdgeArgs },
                        }
                      },
                    } as IGraphPipelineCommand<NsEdgeCmd.AddEdge.IArgs>)
                  : null
              }
              root.right&&judge(root.right.label)?count++: null
              root.checked = true
              // if(judge(root.label)) yBais++
              yBais = Math.ceil(Math.log2(count-1) + 1)
              console.log("log",yBais,'id',count,'label',root.label);
              // if(stack1.indexOf(root.id) < 0) stack1.push(root.id)
              // yBais+=judge(root.label)
              preOrderTraverse1(root.left)
              preOrderTraverse1(root.right)
            }
          }
          preOrderTraverse1(pNode)
          console.log("stack1",stack1)
          xBais++
        })
        // const groupChildren = cells.map((cell) => cell.id)
        // console.log("groupChildrenId.push(rightId)",groupChildrenId)
        let groupArgs:NsGroupCmd.AddGroup.IArgs = {
            nodeConfig: {
            id: uuidv4(),
            renderKey: GROUP_NODE_RENDER_ID,
            groupChildren: groupChildrenId,
            label: res.label,
          },
        }
        commandPipeline.push({
          commandId: XFlowGroupCommands.ADD_GROUP.id,
          getCommandOption: async () => {
            return {
              args: {...groupArgs},
            }
          },
        })
        commandService.executeCommandPipeline(commandPipeline)

        // console.log('groupChildrenId', groupChildrenId)
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
    const [labelArr, setLabelArr] = React.useState(res)
    /** 缓存form实例 */
    ModalCache.form = form
    let stuArr: string[] = []
    let labelToStuArr = {}
    if (sessionStorage.getItem('level') == '1') {
      res.forEach((e) => {
        if (stuArr.indexOf(e.stuId) < 0) stuArr.push(e.stuId)
        if (Object.keys(labelToStuArr).indexOf(e.stuId.toString()) < 0) {
          labelToStuArr[e.stuId] = [{ label: e.label }]
        } else {
          labelToStuArr[e.stuId].push({ label: e.label })
        }
      })
    }
    const handleStuChange = (value) => {
      setLabelArr(labelToStuArr[value])
      setLabelName(labelToStuArr[value][0])
      console.log('ModalCache.res', ModalCache.res, labelToStuArr[value])
      ModalCache.res = res.filter((e) => {
        return e.stuId == value
      })
    }
    ModalCache.res = res
    return (
      <div>
        <ConfigProvider>
          <Form form={form} {...layout} initialValues={{}}>
            <Form.Item
              name="nameLabel"
              label="学生名"
              rules={[{ required: sessionStorage.getItem('level') == '1' ? true : false, message: '请选择' }]}
              style={{ display: sessionStorage.getItem('level') == '1' ? 'flex' : 'none' }}
            >
              <Select style={{ width: 120 }} onChange={handleStuChange}>
                {stuArr.map((stu) => (
                  <Select.Option key={stu}>{stu}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="moduleLabel" label="模块名" rules={[{ required: true, message: '请选择' }]}>
              <Select style={{ width: 120 }} value={labelName}>
                {labelArr.map((l: any) => (
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
