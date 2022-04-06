import { NsGraph, NsJsonSchemaForm, NsNodeCmd, XFlowNodeCommands } from '@antv/xflow'
import { controlMapService, ControlShapeEnum } from './form-controls'
import { MODELS } from '@antv/xflow'
import { Button, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(true), ms))
}
let note = true;
const val = {
    'x0': 0, 'x1': 0, 'x2': 0, 'x3': 0, 'y0': 0, 'y1': 0, 'y2': 0, 'y3': 0, 'C4': 0, 'pStar': 0, 'gStar': 0
}
let i = 0
const checkNum = (_: any, value: number) => {
    // console.log("num", value)
    if (value == 0 || value == 1) {
        return Promise.resolve();
    }
    return Promise.reject(new Error('数字必须为0或1'));
};
let rule = [{ required: true, message: '必须填入数字' },
{ validator: checkNum }]

export const formSchemaService: NsJsonSchemaForm.IFormSchemaService = async args => {
    const { targetData, modelService, targetType } = args
    /** 可以使用获取 graphMeta */
    const graphMeta = await MODELS.GRAPH_META.useValue(modelService)
    // console.log('formSchemaService', graphMeta, args)



    if (targetData) {
        i = 0
        return {
            tabs: [
                {
                    name: '',
                    groups: [
                        {
                            name: '',
                            controls: [
                                {
                                    name: 'x0',
                                    label: '芯片输入x0',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输入x0',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
                                },
                                {
                                    name: 'y0',
                                    label: '芯片输入y0',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输入y0',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
                                },
                                {
                                    name: 'x1',
                                    label: '芯片输入x1',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输入x1',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
                                },
                                {
                                    name: 'y1',
                                    label: '芯片输入y1',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输入y1',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
                                },
                                {
                                    name: 'x2',
                                    label: '芯片输入x2',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输入x2',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
                                },
                                {
                                    name: 'y2',
                                    label: '芯片输入y2',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输入y2',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
                                },
                                {
                                    name: 'x3',
                                    label: '芯片输入x3',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输入x2',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
                                },
                                {
                                    name: 'y3',
                                    label: '芯片输入y3',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输入y3',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
                                },
                                {
                                    name: 'C4',
                                    label: '芯片输出预测C4',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输出预测C4',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
                                },
                                {
                                    name: 'pStar',
                                    label: '芯片输出预测P*',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输出预测P*',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
                                },
                                {
                                    name: 'gStar',
                                    label: '芯片输出预测G*',
                                    shape: 'Input',
                                    disabled: false,
                                    required: true,
                                    tooltip: '芯片输出预测G*',
                                    placeholder: 'please write 1 or 0',
                                    value: '',
                                    defaultValue: 0, // 可以认为是默认值
                                    hidden: false,
                                    options: [{ title: '', value: '' }],
                                    originData: {}, // 原始数据
                                    rules: rule
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

export const formValueUpdateService: NsJsonSchemaForm.IFormValueUpdateService = async args => {
    // console.log('formValueUpdateService', args);
    const { values, commandService, targetData } = args;
    const updateNode = (node: NsGraph.INodeConfig) => {
        return commandService.executeCommand<NsNodeCmd.UpdateNode.IArgs>(
            XFlowNodeCommands.UPDATE_NODE.id,
            { nodeConfig: node }
        );
    };

    let temp = values[0].name[0]
    console.log("formValueUpdateService  values:", values[0].value);
    // if (values[0].value > 1) {
    //     val[temp] = 1;
    //     notification.open({
    //         message: 'Error',
    //         description:
    //             '您输入的数必须为0或1',
    //     }
    // val[temp] =  ? {} :;
    let c4, gStar, pStar;
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
        let c2 = (g2 + p2 & g1 + p2 & p1 & c0) >= 1 ? 1 : 0
        c4 = (g4 + p4 & g3 + p4 & p3 & g2 + p4 & p3 & p2 & g1 + p4 & p3 & p2 & p1 & c0) >= 1 ? 1 : 0
        gStar = (g4 + p4 & g3 + p4 & p3 & g2 + p4 & p3 & p2 & g1) >= 1 ? 1 : 0
        pStar = (p4 & p3 & p2 & p1 & c0) >= 1 ? 1 : 0
        if (values[0].value !== c4 ) {

            if(note) notification.open({
                message: 'Error',
                description: '您的验证错误',
            })
            note = !note
        }
    } else if (values[0].name[0] === 'pStar'){
        if (values[0].value != 'pStar') {
            if(note) notification.open({
                message: 'Error',
                description: '您的验证错误',
            })
            note = !note
        }
    }else if (values[0].name[0] === 'gStar'){
        if (values[0].value != 'gStar') {
            if(note) notification.open({
                message: 'Error',
                description: '您的验证错误',
            })
            note = !note
        }
    }

}

export { controlMapService }
