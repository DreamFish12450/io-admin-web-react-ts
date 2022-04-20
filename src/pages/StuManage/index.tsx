import React, { memo } from 'react'
import {post} from '@/utils/request'
import { Form, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {IRequest} from '@/utils/request.type'
import axios from 'axios';
interface IProperties {}
const normFile = (e) => {
  console.log('Upload event:', e);
  const formData = new FormData();
  formData.append('file', e.file);
  // axios.post("api/user/upload",formData)
  let obj:IRequest<any> = {
    url:"/api/user/upload",
    data:formData,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  }
  post(obj).then(res=>{
    console.log(res,"res")
  })
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};





const StuManage: React.FC<IProperties> = ({}): React.ReactElement => {
  const onFinish = (values:any) => {
    console.log('Received values of form: ', values);
  };
  return (
    <Form
      name="validate_other"
      onFinish={onFinish}
    >
      <Form.Item
        name="upload"
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload name="logo"  
          beforeUpload={(file: any) => {
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
}

export default memo(StuManage)
