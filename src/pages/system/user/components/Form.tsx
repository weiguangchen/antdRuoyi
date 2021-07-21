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
  Row,
  Col,
  TreeSelect,
  Radio,
  message,
  Spin
} from 'antd';
import { addUser, updateUser } from '../service';
import { listDept } from '@/pages/System/Dept/service';
import { listPost } from '@/pages/System/Post/service';
import { listRole } from '@/pages/System/Role/service';
import { getDicts } from '@/pages/System/Dict/service';
import { handleTree } from '@/utils';
import type { ZxModalFormProps } from '@/components/Modal/ZxModalForm';
import ZxModalForm from '@/components/Modal/ZxModalForm';

const { Option } = Select;
const { TextArea } = Input;

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


interface UserModalFormProps extends ZxModalFormProps {
  data: any
}

const UserModalForm: React.FC<UserModalFormProps> = (props) => {
  const { visible, data, done } = props;
  const formRef = useRef<FormInstance>();

  // 部门treeSelect
  const { data: resTreeData, loading: treeLoading } = useRequest(listDept);
  const treeData = useMemo(() => {
    if (!resTreeData) return [];
    const tempTreeData = resTreeData.map((m: any) => {
      m.title = m.deptName;
      m.value = m.deptId;
      return m;
    });
    return handleTree(tempTreeData, 'deptId');
  }, [resTreeData]);
  // 岗位
  const { data: postData, loading: postLoading } = useRequest(listPost, {
    refreshDeps: [visible],
  });
  // 角色
  const { data: roleData, loading: roleLoading } = useRequest(listRole, {
    refreshDeps: [visible],
  });
  // 菜单状态字典
  const { data: sexDicts, loading: sexLoading } = useRequest(() => getDicts('sys_user_sex'), {
    refreshDeps: [visible]
  });

  useEffect(() => {
    if (visible) {
      const { data: userData, postIds, roleIds } = data;
      const values = {
        nickName: userData?.nickName ?? undefined,
        deptId: userData?.deptId ?? [],
        phonenumber: userData?.phonenumber ?? undefined,
        email: userData?.email ?? undefined,
        userName: undefined,
        password: userData?.userId ? undefined : '123456',
        sex: userData?.sex ?? undefined,
        status: userData?.status ?? '0',
        postIds,
        roleIds,
        remark: userData?.remark ?? undefined,
      }
      formRef?.current?.setFieldsValue(values);
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
        if (data?.data?.userId) {
          return updateUser({ ...data?.data, ...values }).then(() => {
            message.success('用户修改成功！');
            done?.()
            return true;
          }).catch(() => {
            message.error('用户修改失败！');
            return false;
          })
        }
        return addUser(values).then(() => {
          message.success('用户添加成功！');
          done?.()
          return true;
        }).catch(() => {
          message.error('用户添加失败！');
          return false;
        })

      }}
      {...props}
    >
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 8 }}
            name="nickName"
            label="用户昵称"
            rules={[
              {
                required: true,
                message: '请填写用户昵称',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 8 }}
            name="deptId"
            label="归属部门"
            rules={[
              {
                required: true,
                message: '请选择归属部门',
              },
            ]}
          >
            {treeLoading ? (
              <Spin />
            ) : (
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择归属部门"
                  treeData={treeData}
                  allowClear
                />
              )}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 8 }}
            name="phonenumber"
            label="手机号码"
            rules={[
              {
                required: true,
                message: '请填写手机号码',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 8 }}
            name="email"
            label="邮箱"
            rules={[
              {
                required: true,
                message: '请填写邮箱',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      {data?.data?.userId ? null : (
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              name="userName"
              label="用户名称"
              rules={[
                {
                  required: true,
                  message: '请填写用户名称',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              name="password"
              label="用户密码"
              rules={[
                {
                  required: true,
                  message: '请填写用户密码',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={8}>
        <Col span={12}>
          <Spin spinning={sexLoading}>
            <Form.Item
              labelCol={{ span: 8 }}
              name="sex"
              label="用户性别"
              rules={[
                {
                  required: true,
                  message: '请填写用户名称',
                },
              ]}
            >
              <Select style={{ width: '100%' }}>
                {sexDicts.map((m) => <Option value={m.dictValue}>{m.dictLabel}</Option>)}
              </Select>
            </Form.Item>
          </Spin>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 8 }}
            name="status"
            label="状态"
            rules={[
              {
                required: true,
                message: '请填写用户密码',
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

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item labelCol={{ span: 8 }} name="postIds" label="岗位">
            {postLoading ? null : (
              <Select mode="multiple" allowClear style={{ width: '100%' }}>
                {postData
                  ? postData.map((m) => <Option value={m.postId} key={m.postId}>{m.postName}</Option>)
                  : null}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item labelCol={{ span: 8 }} name="roleIds" label="角色">
            {roleLoading ? null : (
              <Select mode="multiple" allowClear style={{ width: '100%' }}>
                {roleData
                  ? roleData.map((m) => <Option value={m.roleId} key={m.roleId}>{m.roleName}</Option>)
                  : null}
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="remark" label="备注">
        <TextArea rows={4} />
      </Form.Item>
    </ZxModalForm>
  )
}

export default UserModalForm;