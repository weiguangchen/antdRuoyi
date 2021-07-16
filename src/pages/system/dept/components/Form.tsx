import './index.scss';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Button,
  AutoComplete,
  TreeSelect,
  Radio,
  InputNumber,
  Tree,
  message,
  Spin,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { listDept, addDept, updateDept } from '../service';
import { handleTree } from '@/utils';
import ZxModal from '@/components/Modal';

const formItemLayout = {
  labelCol: {
    // xs: { span: 24 },
    // sm: { span: 4 },
  },
  wrapperCol: {
    // xs: { span: 24 },
    // sm: { span: 20 },
  },
};

const RegistrationForm = (props) => {
  const { visible, onClose, onSubmit, values = {}, title } = props;
  const [form] = Form.useForm();
  const ref = useRef(null);

  // 部门treeSelect
  const { data: resTreeData, loading: treeLoading } = useRequest(listDept);
  const treeData = useMemo(() => {
    const tempTreeData = resTreeData.map((m: any) => {
      m.title = m.deptName;
      m.value = m.deptId;
      return m;
    });
    return handleTree(tempTreeData, 'deptId');
  }, [resTreeData]);

  // 添加部门
  const { loading: addLoading, run } = useRequest(addDept, {
    manual: true,
    onSuccess(res) {
      ref.current.done(false);
      message.success('部门添加成功！');
      onSubmit();
    },
    onError(err) {
      ref.current.done(false);
    },
  });
  // 修改部门
  const { loading: updateLoading, run: updateRun } = useRequest(updateDept, {
    manual: true,
    onSuccess(res) {
      ref.current.done(false);
      message.success('部门修改成功！');
      onSubmit();
    },
    onError(err) {
      ref.current.done(false);
    },
  });

  useEffect(() => {
    if (visible && !addLoading && !updateLoading) {
      form.setFieldsValue({
        parentId: values.parentId,
        deptName: values.deptName || '',
        orderNum: values.orderNum || 0,
        leader: values.leader || '',
        phone: values.phone || '',
        email: values.email || '',
        status: values.status || '0',
      });
    }
  }, [visible]);

  return (
    <ZxModal
      ref={ref}
      title={title}
      visible={visible}
      onClose={() => onClose()}
      onSubmit={() => {
        form
          .validateFields()
          .then((res) => form.submit())
          .catch((err) => ref.current.done(false));
      }}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={(formValues) => {
          if (values.deptId) {
            updateRun({ ...formValues, deptId: values.deptId });
          } else {
            run(formValues);
          }
        }}
        scrollToFirstError
        preserve={false}
      >
        {!values.editRoot ? (
          <Spin spinning={treeLoading}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="parentId"
              label="上级部门"
              rules={[
                {
                  required: true,
                  message: '请选择上级部门',
                },
              ]}
            >
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                treeData={treeData}
                allowClear
              />
            </Form.Item>
          </Spin>
        ) : null}

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="deptName"
              label="部门名称"
              rules={[
                {
                  required: true,
                  message: '请填写部门名称',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="orderNum"
              label="显示排序"
              rules={[
                {
                  required: true,
                  message: '请填写显示排序',
                },
              ]}
            >
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              name="leader"
              label="负责人"
              rules={[
                {
                  required: true,
                  message: '请填写部门名称',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="联系电话"
              rules={[
                {
                  required: true,
                  message: '请填写显示排序',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              name="email"
              label="邮箱"
              rules={[
                {
                  required: true,
                  message: '请填写部门名称',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="部门状态"
              rules={[
                {
                  required: true,
                  message: '请填写显示排序',
                },
              ]}
            >
              <Radio.Group>
                <Radio value="0">正常</Radio>
                <Radio value="1">停用</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ZxModal>
  );
};

export default (props) => <RegistrationForm {...props} />;
