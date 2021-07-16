import './index.scss';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import {
  Form,
  Input,
  Select,
  Button,
  AutoComplete,
  TreeSelect,
  Radio,
  Modal,
  message,
  InputNumber,
} from 'antd';
import { addData, updateData } from '../service';
import ZxModal from '@/components/Modal/index';

import { TableListItem } from '../data.d';

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
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 10,
    },
  },
};

const RegistrationForm = (props) => {
  const { visible, onClose, onSubmit, values = {}, dicttype } = props;
  const [form] = Form.useForm();

  const [ loading, setLoading ] = useState<boolean>(false);
  // 添加字典
  const { loading: addLoading, run } = useRequest(addData, {
    manual: true,
    onSuccess(res) {
      ref.current.done(false);
      message.success('字典添加成功！');
      onSubmit();
    },
    onError() {
      ref.current.done(false);
    },
  });
  // 修改字典
  const { loading: updateLoading, run: updateRun } = useRequest(updateData, {
    manual: true,
    onSuccess(res) {
      ref.current.done(false);
      message.success('字典修改成功！');
      onSubmit();
    },
    onError() {
      ref.current.done(false);
    },
  });

  useEffect(() => {
    if (visible && !addLoading && !updateLoading) {
      form.setFieldsValue({
        dictType: dicttype,
        dictLabel: values.dictLabel || '',
        dictValue: values.dictValue || '',
        dictSort: values.dictSort || 0,
        status: values.status || '0',
        remark: values.remark || '',
      });
    }
  }, [visible]);

  const ref = useRef(null);

  return (
    <ZxModal
      title={props.title}
      ref={ref}
      visible={visible}
      onCancel={() => onClose()}
      onOk={() => {
        form
          .validateFields()
          .then((res) => form.submit())
      }}
      confirmLoading={loading}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={(formValues) => {
          if (values.dictCode) {
            // updateRun({ ...formValues, dictCode: values.dictCode });
            updateData({ ...formValues, dictCode: values.dictCode }).then(res => {
              message.success('字典修改成功！');
                onSubmit();
                setLoading(false)
            }).catch(err => {
                message.error('字典修改失败！');
                setLoading(false)
            })
          } else {
            addData({ ...formValues}).then(res => {
              message.success('字典添加成功！');
                onSubmit();
                setLoading(false)
            }).catch(err => {
                message.error('字典添加失败！');
                setLoading(false)
            })
            // run(formValues);
          }
        }}
        scrollToFirstError
        preserve={false}
      >
        <Form.Item name="dictType" label="字典类型">
          <Input readOnly disabled />
        </Form.Item>

        <Form.Item
          name="dictLabel"
          label="数据标签"
          rules={[
            {
              required: true,
              message: '请填写数据标签',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dictValue"
          label="数据键值"
          rules={[
            {
              required: true,
              message: '请填写数据键值',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dictSort"
          label="显示排序"
          rules={[
            {
              required: true,
              message: '请填写显示排序',
            },
          ]}
        >
          <InputNumber min={0} />
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
      </Form>
    </ZxModal>
  );
};

export default (props) => <RegistrationForm {...props} />;
