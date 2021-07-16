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
import { QuestionCircleOutlined } from '@ant-design/icons';
import { addPost, updatePost } from '../service';
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

const PostForm = (props) => {
  const { visible, onClose, onSubmit, values = {} } = props;
  const [loading,setLoading] = useState<boolean>(false)
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && !loading ) {
      form.setFieldsValue({
        postName: values.postName || '',
        postCode: values.postCode || '',
        postSort: values.postSort || 0,
        status: values.status || '0',
        remark: values.remark || '',
      });
    }
  }, [visible]);

  return (
    <ZxModal
      title={props.title}
      visible={visible}
      onCancel={() => onClose()}
      onOk={() => {
        form
          .validateFields()
          .then(() => {
            setLoading(true)
            form.submit()
          })
      }}
      confirmLoading={loading}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={(formValues) => {
          if (values.postId) {
            updatePost({ ...formValues, postId: values.postId }).then(res => {
              message.success('职位修改成功！');
              onSubmit();
              setLoading(false)
            }).catch(err => {
              message.error('职位修改失败！');
              setLoading(false)
            })
          } else {
            addPost(formValues).then(res => {
              message.success('职位添加成功！');
              onSubmit();
              setLoading(false)
            }).catch(err => {
              message.error('职位添加失败！');
              setLoading(false)
            })
          }
        }}
        scrollToFirstError
        preserve={false}
      >
        <Form.Item
          name="postName"
          label="职位名称"
          rules={[
            {
              required: true,
              message: '请填写职位名称',
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
          name="postCode"
          label="职位编码"
          rules={[
            {
              required: true,
              message: '请填写职位编码',
            },
          ]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item
          name="postSort"
          label="职位排序"
          rules={[
            {
              required: true,
              message: '请填写职位排序',
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        {/* <Form.Item name="status" label="职位状态">
          <Radio.Group>
            <Radio value="0">正常</Radio>
            <Radio value="1">停用</Radio>
          </Radio.Group>
        </Form.Item> */}

        <Form.Item name="remark" label="备注">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </ZxModal>
  );
};

export default PostForm;
