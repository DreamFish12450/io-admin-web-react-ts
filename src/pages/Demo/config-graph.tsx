import type { IProps } from './index'
import { getNodeReactComponent, NsNodeCmd } from '@antv/xflow'
import { NsGraph, XFlowNodeCommands, uuidv4 } from '@antv/xflow'
import { createHookConfig, DisposableCollection } from '@antv/xflow'
import { DND_RENDER_ID, GROUP_NODE_RENDER_ID } from './constant'
import { AlgoNode } from './react-node/algo-node'
import { GroupNode } from './react-node/group'
import type { Graph } from '@antv/x6'
import type { Node as X6Node } from '@antv/x6'
import { ObjectExt } from '@antv/x6'
import { getRegisterNode } from '@antv/xflow-extension/es/flowchart-node-panel'

function createInputPort(portMeta) {
  return {
    id: uuidv4(),
    type: NsGraph.AnchorType.INPUT,
    group: NsGraph.AnchorGroup.BOTTOM,
    tooltip: '输入桩',
    ...portMeta,
  }
}

export const useGraphHookConfig = createHookConfig<IProps>((config, proxy) => {
  // 获取 Props
  const props = proxy.getValue()
  console.log('get main props', props)
  config.setRegisterHook((hooks) => {
    const disposableList = [
      // 注册增加 react Node Render
      hooks.reactNodeRender.registerHook({
        name: 'add react node',
        handler: async (renderMap) => {
          renderMap.set(DND_RENDER_ID, AlgoNode)
          renderMap.set(GROUP_NODE_RENDER_ID, GroupNode)
        },
      }),
      // 注册修改graphOptions配置的钩子
      hooks.graphOptions.registerHook({
        name: 'custom-x6-options',
        after: 'dag-extension-x6-options',
        handler: async (options) => {
          const graphOptions: Graph.Options = {
            connecting: {
              // 是否触发交互事件
              validateMagnet() {
                // return magnet.getAttribute('port-group') !== NsGraph.AnchorGroup.TOP
                return true
              },
              // 显示可用的链接桩
              validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet }) {
                // 不允许连接到自己
                if (sourceView === targetView) {
                  return false
                }
                // 只能从上游节点的输出链接桩创建连接
                // if ( sourceMagnet.getAttribute('port-group') === NsGraph.AnchorGroup.TOP) {
                //   return false
                // }
                // 只能连接到下游节点的输入桩
                // if (targetMagnet.getAttribute('port-group') !== NsGraph.AnchorGroup.TOP) {
                //   return false
                // }
                // 没有起点的返回false
                if (!sourceMagnet) {
                  return false
                }
                if (!targetMagnet) {
                  return false
                }
                const node = targetView!.cell as any
                // 判断目标链接桩是否可连接
                const portId = targetMagnet.getAttribute('port')!
                const port = node.getPort(portId)
                return !!port
              },
            },
          }
          options.connecting = { ...options.connecting, ...graphOptions.connecting }
        },
      }),
      // 注册增加 graph event
      hooks.x6Events.registerHook({
        name: 'add',
        handler: async (events) => {
          events.push(
            {
              eventName: 'node:moved',
              callback: (e, cmds) => {
                const { node } = e
                cmds.executeCommand<NsNodeCmd.MoveNode.IArgs>(XFlowNodeCommands.MOVE_NODE.id, {
                  id: node.id,
                  position: node.getPosition(),
                })
              },
            } as NsGraph.IEvent<'node:moved'>,
            /**
             *  after edge connected to target node, targetNode need add a new port
             * */
            {
              eventName: 'edge:added',
              callback: (e, cmds) => {
                // console.log("e",e)
                const node = e.edge.getTargetNode() as any as X6Node
                // console.log("node:moved",node)
                const isCommand = ObjectExt.getByPath(e, 'options.isCommand', '.')
                console.log(isCommand)
                if (!isCommand) {
                  return
                }
                
                const belowNode = e.edge.getSourceNode() as any as X6Node
                let inputArr = node.store.data.data.inputArr || []
                // console.log("node.inputArr", belowNode)
                const index = inputArr.findIndex(d => d.id == e.edge.getTargetPortId())
                if(index < 0 ) {
                    node.store.data.data.inputArr.push({id:e.edge.getTargetPortId(), val:belowNode.id})
                }else {
                    node.store.data.data.inputArr[index] = Object.assign({}, node.store.data.data.inputArr[index],{id:e.edge.getTargetPortId(), val:belowNode.id})
                }
                // cmds.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
                //     XFlowNodeCommands.UPDATE_NODE.id,
                //     {
                //       nodeConfig: { ...nodeConfig, ...values },
                //     },
                //   )
                // cmds.executeCommand(node.id)
                // console.log("node",node.port)
                // // console.log(node.ports.)
                let res = node.port.ports.filter((val)=>{
                    return val.connected == true
                }).length < 1;
                
                if (node && false) {
                  cmds.executeCommand<NsNodeCmd.UpdateNodePort.IArgs>(XFlowNodeCommands.UPDATE_NODE_PORT.id, {
                    node: node,
                    updatePorts: async (ports) => {
                      return [...ports, createInputPort({})]
                    },
                  })
                }
              },
            } as NsGraph.IEvent<'edge:added'>,
          )
        },
      }),
    ]
    const toDispose = new DisposableCollection()
    toDispose.pushAll(disposableList)
    return toDispose
  })
})
