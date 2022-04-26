import {
  NsGraph,
  NsGraphCmd,
  NsJsonSchemaForm,
  NsNodeCmd,
  useXFlowApp,
  uuidv4,
  XFlowGraphCommands,
  XFlowNodeCommands,
} from '@antv/xflow'
import { controlMapService, ControlShapeEnum } from './form-controls'
import { MODELS } from '@antv/xflow'
import { Button, message, notification } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import type { Node as X6Node } from '@antv/x6'
import { evalRPN } from '../../utils/evalRPN'
import { post } from '@/utils/request'
// import { useGraphConfig } from './config-graph'
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(() => resolve(true), ms))
}
let note = true
const val = {
  x0: 0,
  x1: 0,
  x2: 0,
  x3: 0,
  y0: 0,
  y1: 0,
  y2: 0,
  y3: 0,
  C4: 0,
  pStar: 0,
  gStar: 0,
}
let i = 0
const { ControlShape } = NsJsonSchemaForm
const checkNum = (_: any, value: number) => {
  // console.log("num", value)
  if (value == 0 || value == 1) {
    return Promise.resolve()
  }
  return Promise.reject(new Error('数字必须为0或1'))
}
function createInputPort(portMeta) {
  return {
    id: uuidv4(),
    type: NsGraph.AnchorType.INPUT,
    group: NsGraph.AnchorGroup.BOTTOM,
    tooltip: '输入桩',
    ...portMeta,
  }
}
const rule = [{ message: '必须填入数字' }, { validator: checkNum }]
let calVal = '1234'
let cTrue = 0,
  pTrue = 0,
  gTrue = 0
let wrong = 0
export const formSchemaService: NsJsonSchemaForm.IFormSchemaService = async (args) => {
  const { targetData, modelService, targetType } = args
  /** 可以使用获取 graphMeta */
  const graphMeta = await MODELS.GRAPH_META.useValue(modelService)
  // console.log('formSchemaService', graphMeta, args)

  if (targetData && targetData.label === '74LS182') {
    i = 0
    return {
      tabs: [
        {
          name: '实验验证',
          groups: [
            {
              name: 'exp',
              controls: [
                {
                  name: 'test',
                  tooltip: '开始测验考试',
                  label: '开始测验考试',
                  shape: ControlShape.CHECKBOX,
                  defaultValue: false,
                },
                {
                  name: 'x0',
                  label: '芯片输入x0',
                  shape: 'Input',
                  tooltip: '芯片输入x0',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  defaultValue: Math.floor(Math.random() * 2), // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
                {
                  name: 'y0',
                  label: '芯片输入y0',
                  shape: 'Input',
                  tooltip: '芯片输入y0',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  defaultValue: Math.floor(Math.random() * 2), // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
                {
                  name: 'x1',
                  label: '芯片输入x1',
                  shape: 'Input',
                  tooltip: '芯片输入x1',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  defaultValue: Math.floor(Math.random() * 2), // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
                {
                  name: 'y1',
                  label: '芯片输入y1',
                  shape: 'Input',
                  tooltip: '芯片输入y1',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  defaultValue: Math.floor(Math.random() * 2), // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
                {
                  name: 'x2',
                  label: '芯片输入x2',
                  shape: 'Input',
                  tooltip: '芯片输入x2',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  defaultValue: Math.floor(Math.random() * 2), // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
                {
                  name: 'y2',
                  label: '芯片输入y2',
                  shape: 'Input',
                  tooltip: '芯片输入y2',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  defaultValue: Math.floor(Math.random() * 2), // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
                {
                  name: 'x3',
                  label: '芯片输入x3',
                  shape: 'Input',
                  tooltip: '芯片输入x2',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  defaultValue: Math.floor(Math.random() * 2), // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
                {
                  name: 'y3',
                  label: '芯片输入y3',
                  shape: 'Input',

                  tooltip: '芯片输入y3',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  defaultValue: Math.floor(Math.random() * 2), // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
                {
                  name: 'C4',
                  label: '芯片输出预测C4',
                  shape: 'Input',

                  tooltip: '芯片输出预测C4',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  // defaultValue: 0, // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
                {
                  name: 'pStar',
                  label: '芯片输出预测P*',
                  shape: 'Input',
                  tooltip: '芯片输出预测P*',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  // defaultValue: 0, // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
                {
                  name: 'gStar',
                  label: '芯片输出预测G*',
                  shape: 'Input',
                  tooltip: '芯片输出预测G*',
                  placeholder: 'please write 1 or 0',
                  value: '',
                  // defaultValue: 0, // 可以认为是默认值
                  hidden: false,
                  options: [{ title: '', value: '' }],
                  originData: {}, // 原始数据
                  rules: rule,
                },
              ],
            },
          ],
        },
      ],
    }
  } else if (targetData && targetData.label !== '0桩' && targetData.label !== '1桩') {
    return {
      tabs: [
        {
          /** Tab的title */
          name: '节点信息',
          groups: [
            {
              name: 'Group1',
              controls: [
                {
                  name: 'calculate',
                  tooltip: '计算输出值',
                  label: '计算输出值',
                  shape: ControlShape.CHECKBOX,
                  defaultValue: false,
                },
                {
                  name: 'portNum',
                  tooltip: '设置输入端口数量',
                  label: '设置输入端口数量',
                  shape: ControlShape.SELECT,
                  value: 2,
                  options: [
                    { title: '3', value: '3' },
                    { title: '4', value: '4' },
                    { title: '5', value: '5' },
                  ],
                  defaultValue: 2,
                },
              ],
            },
          ],
        },
      ],
    }
  }
  return {
    tabs: [],
  }
}
let c4, gStar, pStar
export const formValueUpdateService: NsJsonSchemaForm.IFormValueUpdateService = async (args) => {
  // console.log('formValueUpdateService', args);
  const { values, allFields, commandService, targetData, modelService } = args
  const updateNode = (node: NsGraph.INodeConfig) => {
    return commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(XFlowNodeCommands.UPDATE_NODE.id, {
      nodeConfig: node,
    })
  }
  if (targetData.label && targetData.label === '74LS182') {
    console.log('wrong', wrong, cTrue, pTrue)
    if (cTrue == 1 && pTrue == 1 && gTrue == 1) {
      console.log('wrong', wrong, cTrue, pTrue)
    }
    let temp = values[0].name[0]
    // console.log('formValueUpdateService  values:', values[0].value)
    if (values[0].name[0] === 'test') {
      console.log('test', values[0].value)
      if (values[0].value && cTrue == 1 && pTrue == 1 && gTrue == 1) {
        console.log('wrong', wrong, cTrue, pTrue)
        let obj = {
          url: '/api/grade/update',
          params: {
            id: sessionStorage.getItem('id') || 0,
            grade2: 100 - wrong * 5 <= 0 ? 5 : 100 - wrong * 5,
          },
        }
        post(obj).then((res)=>{
          if(res.data.message === '更新成功') {
            message.success(res.data.message)
          }else {
            message.error(res.data.message)
          }
        })
      }
    }
    console.log(values[0].name)
    if (values[0].name[0] === 'C4') {
      let c0 = 0
      let p1 = val.x0 ^ val.y0
      let g1 = val.x0 & val.y0
      let p2 = val.x1 ^ val.y1
      let g2 = val.x1 & val.y1
      let p3 = val.x2 ^ val.y2
      let g3 = val.x2 & val.y2
      let p4 = val.x3 ^ val.y3
      let g4 = val.x3 & val.y3
      let c2 = ((g2 + p2) & (g1 + p2) & p1 & c0) >= 1 ? 1 : 0
      c4 = ((g4 + p4) & (g3 + p4) & p3 & (g2 + p4) & p3 & p2 & (g1 + p4) & p3 & p2 & p1 & c0) >= 1 ? 1 : 0
      gStar = ((g4 + p4) & (g3 + p4) & p3 & (g2 + p4) & p3 & p2 & g1) >= 1 ? 1 : 0
      pStar = (p4 & p3 & p2 & p1 & c0) >= 1 ? 1 : 0
      if (values[0].value != c4) {
        note = !note
        if (note) {
          notification.open({
            message: 'Error',
            description: '您的C4验证错误',
          })
          wrong++
        }
      } else {
        cTrue = 1
      }
    } else if (values[0].name[0] === 'pStar') {
      // console.log(pStar)
      let c0 = 0
      let p1 = val.x0 ^ val.y0
      let g1 = val.x0 & val.y0
      let p2 = val.x1 ^ val.y1
      let g2 = val.x1 & val.y1
      let p3 = val.x2 ^ val.y2
      let g3 = val.x2 & val.y2
      let p4 = val.x3 ^ val.y3
      let g4 = val.x3 & val.y3
      let c2 = ((g2 + p2) & (g1 + p2) & p1 & c0) >= 1 ? 1 : 0
      c4 = ((g4 + p4) & (g3 + p4) & p3 & (g2 + p4) & p3 & p2 & (g1 + p4) & p3 & p2 & p1 & c0) >= 1 ? 1 : 0
      gStar = ((g4 + p4) & (g3 + p4) & p3 & (g2 + p4) & p3 & p2 & g1) >= 1 ? 1 : 0
      pStar = (p4 & p3 & p2 & p1 & c0) >= 1 ? 1 : 0
      if (values[0].value != pStar) {
        note = !note
        if (note) {
          notification.open({
            message: 'Error',
            description: '您的p*验证错误',
          })

          wrong++
        }
      } else {
        pTrue = 1
      }
    } else if (values[0].name[0] === 'gStar') {
      let c0 = 0
      let p1 = val.x0 ^ val.y0
      let g1 = val.x0 & val.y0
      let p2 = val.x1 ^ val.y1
      let g2 = val.x1 & val.y1
      let p3 = val.x2 ^ val.y2
      let g3 = val.x2 & val.y2
      let p4 = val.x3 ^ val.y3
      let g4 = val.x3 & val.y3
      let c2 = ((g2 + p2) & (g1 + p2) & p1 & c0) >= 1 ? 1 : 0
      c4 = ((g4 + p4) & (g3 + p4) & p3 & (g2 + p4) & p3 & p2 & (g1 + p4) & p3 & p2 & p1 & c0) >= 1 ? 1 : 0
      gStar = ((g4 + p4) & (g3 + p4) & p3 & (g2 + p4) & p3 & p2 & g1) >= 1 ? 1 : 0
      pStar = (p4 & p3 & p2 & p1 & c0) >= 1 ? 1 : 0
      if (values[0].value != gStar) {
        note = !note
        if (note) {
          notification.open({
            message: 'Error',
            description: '您的g*验证错误',
          })
          wrong++
        }
      } else {
        gTrue = 1
      }
    }
  } else {
    if (values[0].name[0] === 'calculate') {
      let res = targetData?.ports.filter((v: any) => {
        return v?.connected == true && v?.type == 'input'
      })
      let arr = targetData.inputArr
      const stack = []
      let result = []
      let flag = 0
      stack.push(targetData)
      // 通过async/await去操作得到的Promise对象
      let usePromise = async () => {
        while (stack.length) {
          let node = stack.pop()
          if (node.label == '非门') {
            flag = 1
          } else {
            result.push(node.label)
          }
          if (node.inputArr.length > 0) {
            let arr = node.inputArr
            let temp
            arr.forEach((e: { val: any }) => {
              temp = window.app.getNodeById(e.val).then((data: any) => {
                stack.push(data.store.data.data)
                return data.store.data.data
                // stack.push(data.store.data.data)
              })
            })
            await temp
            console.log('stack', stack)
          }
        }
        calVal = flag ? !evalRPN(result.reverse()) : evalRPN(result.reverse())
        if (note)
          notification.open({
            message: '成功',
            description: `输出值为${calVal}`,
          })
        note = !note
        // console.log('result', flag?!evalRPN(result.reverse()):evalRPN(result.reverse()))
      }
      usePromise()
    } else if (values[0].name[0] === 'portNum') {
      let usePromise = async () => {
        console.log(values[0].value)
        const node = window.app.getNodeById(targetData.id).then((data: any) => {
          for (let i = 2; i < values[0].value; i++) {
            commandService.executeCommand<NsNodeCmd.UpdateNodePort.IArgs>(XFlowNodeCommands.UPDATE_NODE_PORT.id, {
              node: data,
              updatePorts: async (ports) => {
                return [...ports, createInputPort({})]
              },
            })
          }
        })
        await node
      }
      usePromise()
    }
    // console.log('result', result)
  }
}

export { controlMapService }
