/* eslint-disable @typescript-eslint/no-unused-vars */
import { uuidv4 } from '@antv/xflow'
import { XFlowNodeCommands } from '@antv/xflow'
import { DND_RENDER_ID } from './constant'
import type { NsNodeCmd } from '@antv/xflow'
import type { NsNodeCollapsePanel } from '@antv/xflow'
import { Card } from 'antd'
import React from 'react'
import {post} from '@/utils/request'
import { IRequest } from '@/utils/request.type'
export const onNodeDrop: NsNodeCollapsePanel.IOnNodeDrop = async (node, commands, modelService) => {
  const args: NsNodeCmd.AddNode.IArgs = {
    nodeConfig: { ...node, id: uuidv4() },
  }
  commands.executeCommand(XFlowNodeCommands.ADD_NODE.id, args)
}

const NodeDescription = (props: { name: string }) => {
  return (
    <Card size="small" title="算法组件介绍" style={{ width: '200px' }} bordered={false}>
      欢迎使用：{props.name}
      这里可以根据服务端返回的数据显示不同的内容
    </Card>
  )
}

export const nodeDataService: NsNodeCollapsePanel.INodeDataService = async (meta, modelService) => {
  // console.log(meta, modelService)
  // 请求

  return [
    {
      id: '数据读写',
      header: '实验验证',
      children: [
        {
          id: '3',
          label: '74LS182',
          parentId: '1',
          renderKey: DND_RENDER_ID,
          popoverContent: <NodeDescription name="74LS182" />,
        }
      ],
    },
    {
      id: '数据加工',
      header: '设计型实验',
      children: [
        {
          id: '6',
          label: '1桩',
          parentId: '5',
          renderKey: DND_RENDER_ID,
        },
        {
          id: '7',
          label: '0桩',
          parentId: '5',
          renderKey: DND_RENDER_ID,
        },
        {
          id: '8',
          label: '与门',
          parentId: '5',
          renderKey: DND_RENDER_ID,
        },
        {
          id: '9',
          label: '或门',
          parentId: '5',
          renderKey: DND_RENDER_ID,
        },
        {
          id: '10',
          label: '与非门',
          parentId: '5',
          renderKey: DND_RENDER_ID,
        },
        {
          id: '11',
          label: '或非门',
          parentId: '5',
          renderKey: DND_RENDER_ID,
        },
        {
          id: '12',
          label: '异或',
          parentId: '5',
          renderKey: DND_RENDER_ID,
        },
        {
          id: '13',
          label: '非门',
          parentId: '5',
          renderKey: DND_RENDER_ID,
        },
        {
            id: '14',
            label: '输出桩',
            parentId: '5',
            renderKey: DND_RENDER_ID,
          },
      ],
    },

    
    
  ]
}

export const searchService: NsNodeCollapsePanel.ISearchService = async (
  nodes: NsNodeCollapsePanel.IPanelNode[] = [],
  keyword: string,
) => {
  const list = nodes.filter(node => node.label.includes(keyword))
  console.log(list, keyword, nodes)
  return list
}
