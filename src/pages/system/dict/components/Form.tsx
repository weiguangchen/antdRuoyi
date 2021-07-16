import './index.scss';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import { Form, Input, Select, Button, AutoComplete, TreeSelect, Radio, Modal, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { listMenu } from '../../Menu/service';
import { listType, addType, updateType } from '../service';
import { handleTree } from '@/utils';
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

const RegistrationForm = (props: { visible: any; onClose: any; onSubmit: any; values?: {} | undefined; }) => {
  const { visible, onClose, onSubmit, values = {} } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  // 添加字典
  const { loading: addLoading, run } = useRequest(addType, {
    manual: true,
    onSuccess(res) {
      ref.current.done(false);
      message.success('字典添加成功！');
      onSubmit();
    },
    onError(err) {
      ref.current.done(false);
    },
  });
  // 修改字典
  const { loading: updateLoading, run: updateRun } = useRequest(updateType, {
    manual: true,
    onSuccess(res) {
      ref.current.done(false);
      message.success('字典修改成功！');
      onSubmit();
    },
    onError(err) {
      ref.current.done(false);
    },
  });

  useEffect(() => {
    if (visible && !addLoading && !updateLoading) {
      form.setFieldsValue({
        dictName: values.dictName || '',
        dictType: values.dictType || '',
        status: values.status || '0',
        remark: values.remark || '',
      });
    }
  }, [visible]);

  const ref = useRef(null);

  return (
    <ZxModal
      ref={ref}
      title="添加字典类型"
      visible={visible}
      onCancel={() => onClose()}
      onOk={() => {
        form
          .validateFields()
          .then((res) => {
            form.submit()
          })
          // .catch((err) => ref.current.done(false));
      }}
      confirmLoading={loading}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={(formValues) => {
          if (values.dictId) {

            // updateRun({ ...formValues, dictId: values.dictId });
            updateType({ ...formValues, dictId: values.dictId }).then(res => {
              setLoading(false)
              message.success('字典修改成功！');
              onSubmit();
              
            }).catch(err => {
              setLoading(false)
              message.error('字典修改失败！');
            })
          } else {
            addType({
              ...formValues
            }).then(res => {
              setLoading(false)
              message.success('字典添加成功！');
              onSubmit();
              
            }).catch(err => {
              setLoading(false)
              message.error('字典添加失败！');
            })
            // run(formValues);
          }
        }}
        scrollToFirstError
        preserve={false}
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
      </Form>
    </ZxModal>
  );
};

export default (props) => <RegistrationForm {...props} />;
