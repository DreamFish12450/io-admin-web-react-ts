import React, { memo, useState } from 'react'
import { post } from '@/utils/request'
import { Form, Button, Upload, Table, Card } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { IRequest } from '@/utils/request.type'
import axios from 'axios'
import { ColumnsType } from 'antd/lib/table'
import { uuidv4 } from '@antv/xflow'
interface IProperties {}
const normFile = (e) => {
  console.log('Upload event:', e)
  const formData = new FormData()
  formData.append('file', e.file)
  // axios.post("api/user/upload",formData)
  let obj: IRequest<any> = {
    url: '/api/user/upload',
    data: formData,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  }
  post(obj).then((res) => {
    console.log(res, 'res')
  })
  if (Array.isArray(e)) {
    return e
  }
  return e && e.fileList
}

const columns = [
  {
    title: '学号',
    dataIndex: 'id',
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '密码',
    dataIndex: 'password',
  },
]
const StuManage: React.FC<IProperties> = ({}): React.ReactElement => {
  const pagination = {
    current: 1,
    pageSize: 30,
  }
  const [stuData, setStuData] = useState([])
  const [loading, setLoading] = useState(false)
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values)
  }
  function loadData(): void {
    setLoading(true)
    let obj: IRequest<any> = {
      url: '/api/user/select',
      params: {
        id: sessionStorage.getItem('id') || 0,
      },
    }
    post(obj).then((res) => {
      if (res.data.message === 'ok') {
        setLoading(false)
        setStuData(res.data.data)
      }
    })
    // throw new Error('Function not implemented.')
  }

  return (
    <div>
      <Card style={{ marginTop: 16 }} type="inner" title="表单">
        <Form name="validate_other" onFinish={onFinish}>
          <Form.Item name="upload" label="上传" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              name="logo"
              beforeUpload={(file: any) => {
                return false
              }}
            >
              <Button style={{ width:160 }} size={'middle'} icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="preSee" label="预览">
            <Button style={{ width:160 }}size={'middle'}  htmlType="button" onClick={() => loadData()}>
              预览
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card style={{ marginTop: 16 }} type="inner" title="预览" >
        <Table
          columns={columns}
          rowKey={(record) => uuidv4()}
          dataSource={stuData}
          pagination={pagination}
          loading={loading}
        />
      </Card>
    </div>
  )
}

export default memo(StuManage)
