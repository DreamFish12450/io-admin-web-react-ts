/* eslint-disable @typescript-eslint/no-unused-vars */
import { DND_RENDER_ID, NODE_WIDTH, NODE_HEIGHT } from './constant'
import { uuidv4, NsGraph, NsGraphStatusCommand } from '@antv/xflow'
import type { NsRenameNodeCmd } from './cmd-extensions/cmd-rename-node-modal'
import type { NsNodeCmd, NsEdgeCmd, NsGraphCmd } from '@antv/xflow'
import type { NsDeployDagCmd } from './cmd-extensions/cmd-deploy'
/** mock 后端接口调用 */
export namespace MockApi {
  export const NODE_COMMON_PROPS = {
    renderKey: DND_RENDER_ID,
    width: 240,
    height: 120,
    inputVal:0,
    outputVal:0,
    inputArr:[],
    outputArr:[],
  } as const
  export const NODE_EXP_PROPS = {
    renderKey: DND_RENDER_ID,
    width: 60,
    height: 30,
    inputVal:0,
    outputVal:0,
    inputArr:[],
    outputArr:[],
  } as const
  export const NODE_BASIC_PROPS = {
    renderKey: DND_RENDER_ID,
    width: 60,
    height: 30,
    outputVal:0,
    inputArr:[],
    outputArr:[],
  } as const

  /** 查图的meta元信息 */
  export const queryGraphMeta: NsGraphCmd.GraphMeta.IArgs['graphMetaService'] = async (args) => {
    console.log('queryMeta', args)
    return { ...args, flowId: args.meta.flowId }
  }
  export const createPorts = (nodeId: string, nodeLabel?: string, leftN = 4, topN = 6, rightN = 2, bottomN = 8) => {
    const ports = [] as NsGraph.INodeAnchor[]
    let arrayLeft = ['S3', 'S2', 'S1', 'S0']
    let arrayTop = ['!Cn+4', 'A=B', 'F3', 'F2', 'F1', 'F0']
    let arrayRight = ['!Cn', 'M']
    let arrayBottom = ['B0', 'B1', 'B2', 'B3', 'A0', 'A1', 'A2', 'A3']
    if (nodeLabel == '74LS181') {
      Array(leftN)
        .fill(1)
        .forEach((item, idx) => {
          const portIdx = idx + 1
          ports.push(
            ...[
              {
                id: `${nodeId}-input-${portIdx}`,
                type: NsGraph.AnchorType.INPUT,
                group: NsGraph.AnchorGroup.LEFT,
                tooltip: `输入桩-${arrayLeft[idx]}`,
              },
            ],
          )
        })
      Array(topN)
        .fill(1)
        .forEach((item, idx) => {
          const portIdx = idx + 1 + leftN
          ports.push(
            ...[
              {
                id: `${nodeId}-input-${portIdx}`,
                type: NsGraph.AnchorType.INPUT,
                group: NsGraph.AnchorGroup.TOP,
                tooltip: `输入桩-${arrayTop[idx]}-`,
              },
            ],
          )
        })
      Array(rightN)
        .fill(1)
        .forEach((item, idx) => {
          const portIdx = idx + 1 + topN + leftN
          ports.push(
            ...[
              {
                id: `${nodeId}-input-${portIdx}`,
                type: NsGraph.AnchorType.INPUT,
                group: NsGraph.AnchorGroup.RIGHT,
                tooltip: `输入桩-${arrayRight[idx]}`,
              },
            ],
          )
        })
      Array(bottomN)
        .fill(1)
        .forEach((item, idx) => {
          const portIdx = idx + 1 + topN + leftN + rightN
          ports.push(
            ...[
              {
                id: `${nodeId}-input-${portIdx}`,
                type: NsGraph.AnchorType.INPUT,
                group: NsGraph.AnchorGroup.BOTTOM,
                tooltip: `输入桩-${arrayBottom[idx]}`,
              },
            ],
          )
        })
    } else if (nodeLabel === '0桩' || nodeLabel === '1桩') {
      Array(1)
        .fill(1)
        .forEach((item, idx) => {
          const portIdx = idx + 1 + leftN
          ports.push(
            ...[
              {
                id: `${nodeId}-output-${portIdx}`,
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.TOP,
                tooltip: `输出桩`,
              },
            ],
          )
        })
    } else if (nodeLabel === '输出桩') {
      Array(1)
        .fill(1)
        .forEach((item, idx) => {
          const portIdx = idx + 1 + leftN
          ports.push(
            ...[
              {
                id: `${nodeId}-input-${portIdx}`,
                type: NsGraph.AnchorType.INPUT,
                group: NsGraph.AnchorGroup.BOTTOM,
                tooltip: `输入桩`,
              },
            ],
          )
        })
    } else if (nodeLabel !== '74LS182') {
      Array(1)
        .fill(1)
        .forEach((item, idx) => {
          const portIdx = idx + 1 + leftN
          ports.push(
            ...[
              {
                id: `${nodeId}-output-${portIdx}`,
                type: NsGraph.AnchorType.OUTPUT,
                group: NsGraph.AnchorGroup.TOP,
                tooltip: `输出桩`,
              },
            ],
          )
        })
      Array(2)
        .fill(1)
        .forEach((item, idx) => {
          const portIdx = idx + 1 + leftN
          ports.push(
            ...[
              {
                id: `${nodeId}-input-${portIdx}`,
                type: NsGraph.AnchorType.INPUT,
                group: NsGraph.AnchorGroup.BOTTOM,
                tooltip: `输入桩`,
              },
            ],
          )
        })
    }
    return ports
  }
  /** 加载图数据的api */
  export const loadGraphData = async (meta: NsGraph.IGraphMeta) => {
    const nodes: NsGraph.INodeConfig[] = [
      // {
      //     ...NODE_COMMON_PROPS,
      //     id: 'node1',
      //     label: '算法节点-1',
      //     ports: createPorts('node1'),
      // },
      // {
      //     ...NODE_COMMON_PROPS,
      //     id: 'node2',
      //     label: '算法节点-2',
      //     ports: createPorts('node2'),
      // },
      // {
      //     ...NODE_COMMON_PROPS,
      //     id: 'node3',
      //     label: '算法节点-3',
      //     ports: createPorts('node3'),
      // },
      // {
      //     ...NODE_COMMON_PROPS,
      //     id: 'node4',
      //     label: '算法节点-4',
      //     ports: createPorts('node4'),
      // },
    ]
    const edges: NsGraph.IEdgeConfig[] = [
      // {
      //     id: uuidv4(),
      //     source: 'node1',
      //     target: 'node2',
      //     sourcePortId: 'node1-output-1',
      //     targetPortId: 'node2-input-1',
      // },
      // {
      //     id: uuidv4(),
      //     source: 'node1',
      //     target: 'node3',
      //     sourcePortId: 'node1-output-1',
      //     targetPortId: 'node3-input-1',
      // },
      // {
      //     id: uuidv4(),
      //     source: 'node1',
      //     target: 'node4',
      //     sourcePortId: 'node1-output-1',
      //     targetPortId: 'node4-input-1',
      // },
    ]
    return { nodes, edges }
  }
  /** 保存图数据的api */
  export const saveGraphData: NsGraphCmd.SaveGraphData.IArgs['saveGraphDataService'] = async (
    meta: NsGraph.IGraphMeta,
    graphData: NsGraph.IGraphData,
  ) => {
    console.log('saveGraphData api', meta, graphData)
    return {
      success: true,
      data: graphData,
    }
  }
  /** 部署图数据的api */
  export const deployDagService: NsDeployDagCmd.IDeployDagService = async (
    meta: NsGraph.IGraphMeta,
    graphData: NsGraph.IGraphData,
  ) => {
    console.log('deployService api', meta, graphData)
    return {
      success: true,
      data: graphData,
    }
  }

  /** 添加节点api */
  export const addNode: NsNodeCmd.AddNode.IArgs['createNodeService'] = async (args: NsNodeCmd.AddNode.IArgs) => {
    console.info('addNode service running, add node:', args)

    const { id, ports = createPorts(id, args.nodeConfig.label), groupChildren } = args.nodeConfig

    const nodeId = id || uuidv4()
    /** 这里添加连线桩 */
    var node: NsNodeCmd.AddNode.IArgs['nodeConfig'];
    if(args.nodeConfig.label === '0桩'){
        node = {
            ...NODE_BASIC_PROPS,
            ...args.nodeConfig,
            id: nodeId,
            ports: ports,
            
          }
    }
    else if(args.nodeConfig.label === '1桩'){
        node = {
            ...NODE_BASIC_PROPS,
            ...args.nodeConfig,
            id: nodeId,
            ports: ports,
            outputVal:1
          }
    }
    else if (args.nodeConfig.label !== '74LS181' && args.nodeConfig.label !== '74LS182') {
      node = {
        ...NODE_EXP_PROPS,
        ...args.nodeConfig,
        id: nodeId,
        ports: ports,
      }
      /** group没有链接桩 */
    }
    else{
      node = {
        ...NODE_COMMON_PROPS,
        ...args.nodeConfig,
        id: nodeId,
        ports: ports,
      }
      /** group没有链接桩 */
      if (groupChildren && groupChildren.length) {
        node.ports = []
      }
      return node
    }
    if (groupChildren && groupChildren.length) {
        node.ports = []
      }
      return node
  }

  /** 更新节点 name，可能依赖接口判断是否重名，返回空字符串时，不更新 */
  export const renameNode: NsRenameNodeCmd.IUpdateNodeNameService = async (name, node, graphMeta) => {
    console.log('rename node', node, name, graphMeta)
    return { err: null, nodeName: name }
  }

  /** 删除节点的api */
  export const delNode: NsNodeCmd.DelNode.IArgs['deleteNodeService'] = async (args) => {
    console.info('delNode service running, del node:', args.nodeConfig.id)
    return true
  }

  /** 添加边的api */
  export const addEdge: NsEdgeCmd.AddEdge.IArgs['createEdgeService'] = async (args) => {
    console.info('addEdge service running, add edge:', args)
    const { edgeConfig } = args
    return {
      ...edgeConfig,
      id: uuidv4(),
    }
  }

  /** 删除边的api */
  export const delEdge: NsEdgeCmd.DelEdge.IArgs['deleteEdgeService'] = async (args) => {
    console.info('delEdge service running, del edge:', args)
    return true
  }

  let runningNodeId = 0
  const statusMap = {} as NsGraphStatusCommand.IStatusInfo['statusMap']
  let graphStatus: NsGraphStatusCommand.StatusEnum = NsGraphStatusCommand.StatusEnum.DEFAULT
  export const graphStatusService: NsGraphStatusCommand.IArgs['graphStatusService'] = async () => {
    console.log("statusMap", statusMap)

    return {
      graphStatus: graphStatus,
      statusMap: statusMap,
    }
  }
  export const stopGraphStatusService: NsGraphStatusCommand.IArgs['graphStatusService'] = async () => {
    Object.entries(statusMap).forEach(([, val]) => {
      const { status } = val as { status: NsGraphStatusCommand.StatusEnum }
      if (status === NsGraphStatusCommand.StatusEnum.PROCESSING) {
        val.status = NsGraphStatusCommand.StatusEnum.ERROR
      }
    })
    return {
      graphStatus: NsGraphStatusCommand.StatusEnum.ERROR,
      statusMap: statusMap,
    }
  }
}
