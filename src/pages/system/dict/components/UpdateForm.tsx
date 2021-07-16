import React, { useState, useRef } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps } from 'antd';

import { TableListItem } from '../data.d';

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps {
  onClose: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const { TextArea } = Input;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onSubmit, onClose, updateModalVisible, values } = props;

  // const [formVals, setFormVals] = useState<FormValueType>({

  // });

  const [form] = Form.useForm();

  const ref = useRef(null);

  return (
    <ZxModal
      ref={ref}
      title="添加字典类型"
      visible={updateModalVisible}
      onClose={() => onClose()}
      onSubmit={() => {
        form
          .validateFields()
          .then((res) => {
            form.submit();
          })
          .catch((err) => {
            ref.current.done(false);
          });
      }}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={(values) => run(values)}
        initialValues={{
          status: values.status,
          dictName: values.dictName,
          dictType: values.dictType,
        }}
        scrollToFirstError
        preserve={false}
      >
        <Form.Item
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
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
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
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

        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} name="status" label="状态">
          <Radio.Group>
            <Radio value={0}>正常</Radio>
            <Radio value={1}>停用</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} name="remark" label="备注">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </ZxModal>
  );
};

export default UpdateForm;
