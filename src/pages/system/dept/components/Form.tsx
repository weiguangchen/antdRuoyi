import './index.scss';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import type {
  FormInstance
} from 'antd';
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
  Spin
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { listDept, addDept, updateDept } from '../service';
import { handleTree } from '@/utils';
import type { ZxModalFormProps } from '@/components/Modal/ZxModalForm';
import ZxModalForm from '@/components/Modal/ZxModalForm';


const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 },
  },
};


interface DictModalFormProps extends ZxModalFormProps {
  data?: any;
}

const DictModalForm: React.FC<DictModalFormProps> = (props) => {
  const { visible, data, done } = props;

  const formRef = useRef<FormInstance>();

  // 部门treeSelect
  const { data: resTreeData, loading: treeLoading } = useRequest(listDept, {
    refreshDeps: [visible]
  });
  const treeData = useMemo(() => {
    if(!resTreeData) return [];
    const tempTreeData = resTreeData.map((m: any) => {
      m.title = m.deptName;
      m.value = m.deptId;
      return m;
    });
    return handleTree(tempTreeData, 'deptId');
  }, [resTreeData]);


  useEffect(() => {
    if (visible) {
      formRef?.current?.setFieldsValue({
        parentId: data?.parentId ?? undefined,
        deptName: data?.deptName ?? undefined,
        orderNum: data?.orderNum ?? 1,
        leader: data?.leader ?? undefined,
        phone: data?.phone ?? undefined,
        email: data?.email ?? undefined,
        status: data?.status ?? '0',
      })
    }
  }, [visible])

  return (
    <ZxModalForm
      formRef={formRef}
      {...formItemLayout}
      initialValues={{
        status: '0'
      }}
      onFinish={(values) => {
        if (data.deptId) {
          return updateDept({ ...values, deptId: data?.deptId }).then(() => {
            message.success('部门修改成功！');
            done?.();
            return true;
          }).catch(() => {
            message.error('部门修改失败！');
            return false;
          })
        }
        return addDept(values).then(() => {
          message.success('部门添加成功！');
          done?.();
          return true;
        }).catch(() => {
          message.error('部门添加失败！');
          return false;
        })
      }}
      {...props}
    >
      {!data.editRoot ? (
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
            name="orderNum"
            label="显示排序"
            rules={[
              {
                required: true,
                message: '请填写显示排序',
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
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
    </ZxModalForm>
  )
}

export default DictModalForm;