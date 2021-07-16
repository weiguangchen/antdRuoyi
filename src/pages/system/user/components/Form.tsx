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
  Checkbox,
  Button,
  AutoComplete,
  TreeSelect,
  Popover,
  Radio,
  message,
  Spin,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { getUser, addUser, updateUser } from '../service';
import { listMenu } from '@/pages/System/Menu/service';
import { listDept } from '@/pages/System/Dept/service';
import { listPost } from '@/pages/System/Post/service';
import { listRole } from '@/pages/System/Role/service';
import { getDicts } from '@/pages/System/Dict/service';
import { handleTree } from '@/utils';
import ZxModal from '@/components/Modal/index';

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
  const { visible, values = {}, onClose, onSubmit } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  // 部门treeSelect
  const { data: resTreeData, loading: treeLoading } = useRequest(listDept);
  const treeData = useMemo(() => {
    if (resTreeData) {
      const tempTreeData = resTreeData.map((m: any) => {
        m.title = m.deptName;
        m.value = m.deptId;
        return m;
      });
      return handleTree(tempTreeData, 'deptId');
    } else {
      return [];
    }
  }, [resTreeData]);
  // 岗位
  const { data: postData, loading: postLoading } = useRequest(listPost, {
    refreshDeps: [values.userId],
  });
  // 角色
  const { data: roleData, loading: roleLoading } = useRequest(listRole, {
    refreshDeps: [values.userId],
  });
  // 菜单状态字典
  const { data: sexDicts, loading: sexLoading } = useRequest(() => getDicts('mfrs_user_sex'));
  // 用户信息
  const { run: userRun, loading: userLoading } = useRequest(() => getUser(values.userId), {
    manual: true,
    refreshDeps: [values.userId],
    formatResult: (res) => res,
    onSuccess(res) {
      const { data, postIds, posts, roleIds, roles } = res;
      form.setFieldsValue({
        status: '0',
        password: '123456',
        ...data,
        postIds: postIds.map((m) => `${m}`),
        roleIds: roleIds.map((m) => `${m}`),
      });
    },
  });

  useEffect(() => {
    if (visible) {
      if (values.userId) {
        userRun();
      } else {
        form.setFieldsValue({
          userName: '',
          status: '0',
          password: '123456',
        });
      }
    }
  }, [visible]);

  const ref = useRef(null);

  return (
    <ZxModal
      title={props.title}
      visible={visible}
      onCancel={() => onClose()}
      onOk={() => {
        form
          .validateFields()
          .then((res) => {
            setLoading(true)
            form.submit()
          })
      }}
      width={700}
      confirmLoading={loading}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={(formValues) => {
          if (values.userId) {
            updateUser({ ...values, ...formValues }).then(res => {
              message.success('用户修改成功！');
              onSubmit();
              setLoading(false)
            }).catch(err => {
              message.error('用户修改失败！');
              setLoading(false)
            })
          } else {
            addUser(formValues).then(res => {
              message.success('用户添加成功！');
              onSubmit();
              setLoading(false)
            }).catch(err => {
              message.error('用户添加失败！');
              setLoading(false)
            })
          }
        }}
        scrollToFirstError
        preserve={false}
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

        {values.userId ? null : (
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
                {sexDicts
                  ? sexDicts.map((m) => <Option value={m.dictValue}>{m.dictLabel}</Option>)
                  : null}
              </Select>
            </Form.Item>
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
              {userLoading ? null : (
                <Select mode="multiple" allowClear style={{ width: '100%' }}>
                  {postData
                    ? postData.map((m) => <Option key={m.postId}>{m.postName}</Option>)
                    : null}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item labelCol={{ span: 8 }} name="roleIds" label="角色">
              {userLoading ? null : (
                <Select mode="multiple" allowClear style={{ width: '100%' }}>
                  {roleData
                    ? roleData.map((m) => <Option key={m.roleId}>{m.roleName}</Option>)
                    : null}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="remark" label="备注">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </ZxModal>
  );
};

export default (props) => <RegistrationForm {...props} />;
