/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NsNodeCmd, NsEdgeCmd, IMenuOptions, NsGraph } from '@antv/xflow'
import type { NsRenameNodeCmd } from './cmd-extensions/cmd-rename-node-modal'
import { createCtxMenuConfig, MenuItemType } from '@antv/xflow'
import { IconStore, XFlowNodeCommands, XFlowEdgeCommands } from '@antv/xflow'
import { DeleteOutlined, EditOutlined, StopOutlined ,UploadOutlined} from '@ant-design/icons'
import { CustomCommands } from './cmd-extensions/constants'
import { MockApi } from './service'
import { groupEnd } from 'console'
import { inOrder, judge } from '../../utils/evalRPN'
import { IRequest } from '@/utils/request.type'
import { post } from '@/utils/request'
import { notification } from 'antd'
import { NsUploadGradeCmd } from './cmd-extensions/cmd-upload-grade-modal'
/** menuitem 配置 */
export namespace NsMenuItemConfig {
  /** 注册菜单依赖的icon */
  IconStore.set('DeleteOutlined', DeleteOutlined)
  IconStore.set('EditOutlined', EditOutlined)
  IconStore.set('StopOutlined', StopOutlined)
  IconStore.set('UploadOutlined',UploadOutlined )
  export const DELETE_EDGE: IMenuOptions = {
    id: XFlowEdgeCommands.DEL_EDGE.id,
    label: '删除边',
    iconName: 'DeleteOutlined',
    onClick: async ({ target, commandService }) => {
      commandService.executeCommand<NsEdgeCmd.DelEdge.IArgs>(XFlowEdgeCommands.DEL_EDGE.id, {
        edgeConfig: target.data as NsGraph.IEdgeConfig,
      })
    },
  }

  export const DELETE_NODE: IMenuOptions = {
    id: XFlowNodeCommands.DEL_NODE.id,
    label: '删除节点',
    iconName: 'DeleteOutlined',
    onClick: async ({ target, commandService }) => {
      commandService.executeCommand<NsNodeCmd.DelNode.IArgs>(XFlowNodeCommands.DEL_NODE.id, {
        nodeConfig: { id: target.data.id },
      })
    },
  }

  export const EMPTY_MENU: IMenuOptions = {
    id: 'EMPTY_MENU_ITEM',
    label: '暂无可用',
    isEnabled: false,
    iconName: 'DeleteOutlined',
  }

  export const RENAME_NODE: IMenuOptions = {
    id: CustomCommands.SHOW_RENAME_MODAL.id,
    label: '重命名',
    isVisible: true,
    iconName: 'EditOutlined',
    onClick: async ({ target, commandService }) => {
      const nodeConfig = target.data as NsGraph.INodeConfig
      commandService.executeCommand<NsRenameNodeCmd.IArgs>(CustomCommands.SHOW_RENAME_MODAL.id, {
        nodeConfig,
        updateNodeNameService: MockApi.renameNode,
      })
    },
  }

  export const UPLOAD_GRADE: IMenuOptions = {
    id: CustomCommands.SHOW_UPLOAD_MODAL.id,
    label: '上传成绩',
    isVisible: sessionStorage.getItem("level") == '1'?true:false,
    iconName: 'UploadOutlined',
    onClick: async ({ target, commandService }) => {
      const nodeConfig = target.data as NsGraph.INodeConfig
      commandService.executeCommand<NsUploadGradeCmd.IArgs>(CustomCommands.SHOW_UPLOAD_MODAL.id, {
        nodeConfig,
        updateNodeNameService: MockApi.renameNode,
      })
    },
  }
  export const SEPARATOR: IMenuOptions = {
    id: 'separator',
    type: MenuItemType.Separator,
  }

  export const UPLOAD_NODE: IMenuOptions = {
    id: 'UPLOAD',
    label: '上传节点',
    iconName: 'DeleteOutlined',
    onClick: async ({ target, commandService }) => {
      console.log('target?.data?.groupChildren', target?.data)
      // console.log('UPLOADTARGET', target)
      const map: any[] = []
      let resMap: any[] = []
      let finalData: string
      let inputNum = 1
      let outputNum = 1
      let inputPort = []
      let outputPort = []
      let asyncFunc = []
      const getChild = (e: string) => {
        return new Promise((resolve1) => {
          let a = window.app
            .getNodeById(e)
            .then(async (data: any) => {
              return new Promise(function (resolve, reject) {
                if (data.store.data.data.label === '输出桩') {
                  outputPort.push(`output${outputNum++}`)
                  resolve(data.store.data.data.inputArr[0].val)
                } else if (data.store.data.data.label === '0桩' || data.store.data.data.label === '1桩') {
                  inputPort.push({
                    id: data.store.data.data.id,
                    no: `input${inputNum++}`,
                  })
                }
              })
            })
            .then((res: any) => {
              window.app.getNodeById(res).then((val: any) => {
                console.log('inputPort', inputPort)
                inOrder(val.store.data.data).then((v) => {
                  v.forEach((e, k) => {
                    if (!judge(e)) {
                      inputPort.forEach((i) => {
                        if (i.id === e) {
                          return (v[k] = i.no)
                        } else {
                          return v[k]
                        }
                      })
                    }
                  })
                  resMap.push(v)
                  resolve1(finalData)
                })
              })
            })
        })
      }
      let temp1 = 1
      let resultArr = ''
      const asyncFun = await Promise.all(
        target?.data?.groupChildren.map(async (e: string, index: number) => {
          await getChild(e)
            .then((val: any) => {
              const output = outputPort.pop()
              if (temp1 < outputNum) {
                if (temp1 === outputNum - 1) {
                  resultArr += output + '-' + resMap[temp1 - 1].toString()
                  let obj: IRequest<any> = {
                    url: '/api/module/insert',
                    params: { inputNum: inputNum, outputNum: outputNum, stuId: '1', label: target?.data?.label || '' ,formula:resultArr},
                  }
                  post(obj).then((res) => {
                    if(res.data.message === '更新成功'){
                      notification.open({
                        message: 'Success',
                        description: '上传成功',
                      })
                    }
                  })
                  console.log('resultArr', resultArr)
                } else {
                  resultArr += output + '-' + resMap[temp1 - 1].toString() + '+'
                }
                temp1 += 1
              }
            })
            .catch((err) => {
              console.log(err)
            })
            .finally(() => {})
          return 111
        }),
      )
    },
  }
}

export const useMenuConfig = createCtxMenuConfig((config) => {
  config.setMenuModelService(async (target, model, modelService, toDispose) => {
    const { type, cell } = target
    console.log(type)
    switch (type) {
      /** 节点菜单 */
      case 'node':
        model.setValue({
          id: 'root',
          type: MenuItemType.Root,
          submenu: [NsMenuItemConfig.DELETE_NODE, NsMenuItemConfig.RENAME_NODE, NsMenuItemConfig.UPLOAD_NODE,NsMenuItemConfig.UPLOAD_GRADE],
        })
        break
      /** 边菜单 */
      case 'edge':
        model.setValue({
          id: 'root',
          type: MenuItemType.Root,
          submenu: [NsMenuItemConfig.DELETE_EDGE],
        })
        break
      /** 画布菜单 */
      case 'blank':
        model.setValue({
          id: 'root',
          type: MenuItemType.Root,
          submenu: [NsMenuItemConfig.EMPTY_MENU],
        })
        break
      /** 默认菜单 */
      default:
        model.setValue({
          id: 'root',
          type: MenuItemType.Root,
          submenu: [NsMenuItemConfig.EMPTY_MENU],
        })
        break
    }
  })
})
