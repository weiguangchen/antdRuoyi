import './index.scss';
import React, { useRef, useEffect } from 'react';
import type { FormInstance } from 'antd';
import { Form, Input, Radio, message } from 'antd';
import { addType, updateType } from '../service';

import type { TableListItem } from '../data.d';
import type { ZxModalFormProps } from '@/components/Modal/ZxModalForm';
import ZxModalForm from '@/components/Modal/ZxModalForm';


const { TextArea } = Input;

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};


interface DictModalFormProps extends ZxModalFormProps {
  data?: any;
}

const DictModalForm: React.FC<DictModalFormProps> = (props) => {
  const { visible, data, done } = props;
  
  const formRef = useRef<FormInstance>();
  useEffect(() => {
    if(visible) {
      formRef?.current?.setFieldsValue({
        dictName: data?.dictName || undefined,
        dictType: data?.dictType || undefined,
        status: data?.status || '0',
        remark: data?.remark || undefined
      })
    }
  },[visible])

  return (
    <ZxModalForm
      formRef={formRef}
      {...formItemLayout}
      initialValues={{
        status: '0'
      }}
      onFinish={(values) => {
        console.log(values)
        if (data.dictId) {
          return updateType({ ...values, dictId: data?.dictId }).then(() => {
            message.success('字典修改成功！');
            done?.()
            return true;
          }).catch(() => {
            message.error('字典修改失败！');
            return false;
          })
        } 
        return addType(values).then(() => {
          message.success('字典添加成功！');
          done?.()
          return true;
        }).catch(() => {
          message.error('字典添加失败！');
          return false;
        })
      }}
      {...props}
    >
      <Form.Item
        name="dictName"
        label="字典名称"
        rules={[
          {
            required: true,
            message: '请填写字典名称',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="dictType"
        label="字典类型"
        rules={[
          {
            required: true,
            message: '请填写字典类型',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="status" label="状态">
        <Radio.Group>
          <Radio value="0">正常</Radio>
          <Radio value="1">停用</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="remark" label="备注">
        <TextArea rows={4} />
      </Form.Item>
    </ZxModalForm>
  )
}

export default DictModalForm;