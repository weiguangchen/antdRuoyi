import './index.scss';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import type {
  FormInstance
} from 'antd';
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
  InputNumber
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { addPost, updatePost } from '../service';
import { handleTree } from '@/utils';
import ZxModal from '@/components/Modal/index';

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

interface PostModalFormProps extends ZxModalFormProps {
  data: any
}

const PostModalForm: React.FC<PostModalFormProps> = (props) => {
  const { visible, data, done } = props;
  const formRef = useRef<FormInstance>();


  useEffect(() => {
    if (visible) {
      formRef?.current?.setFieldsValue({
        postName: data?.postName ?? undefined,
        postCode: data?.postCode ?? undefined,
        postSort: data?.postSort ?? 1,
        status: data?.status ?? '0',
        remark: data?.remark ?? undefined,
      });
    }
  }, [visible]);

  return (
    <ZxModalForm
      formRef={formRef}
      {...formItemLayout}
      modalProps={{
        onCancel: () => console.log('run'),
      }}
      onFinish={async (values) => {
        if (data.postId) {
          return updatePost({ ...values, postId: data?.postId }).then(() => {
            message.success('?????????????????????');
            done?.()
            return true;
          }).catch(() => {
            message.error('?????????????????????');
            return false;
          })
        }
        return addPost(values).then(() => {
          message.success('?????????????????????');
          done?.()
          return true;
        }).catch(() => {
          message.error('?????????????????????');
          return false;
        })

      }}
      {...props}
    >
      <Form.Item
        name="postName"
        label="????????????"
        rules={[
          {
            required: true,
            message: '?????????????????????',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="postCode"
        label="????????????"
        rules={[
          {
            required: true,
            message: '?????????????????????',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="postSort"
        label="????????????"
        rules={[
          {
            required: true,
            message: '?????????????????????',
          },
        ]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item name="status" label="????????????">
        <Radio.Group>
          <Radio value="0">??????</Radio>
          <Radio value="1">??????</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="remark" label="??????">
        <TextArea rows={4} />
      </Form.Item>
    </ZxModalForm>
  )
}

export default PostModalForm;