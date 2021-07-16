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
import { listMenu, roleMenuTreeselect } from '../../Menu/service';
import { addRole, updateRole, dataScope } from '../service';
import { treeselect as deptTreeselect, roleDeptTreeselect } from '@/pages/System/Dept/service';
import { handleTree, formatTreeData } from '@/utils';
import ZxModal from '@/components/Modal';

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

// 转成antd所需字段
const treeFn = (list) => {
  return list.map((m) => {
    m.title = m.label;
    m.key = m.id;
    if (m.children) {
      m.children = treeFn(m.children);
    }
    return m;
  });
};

const MenuTree: React.FC = ({ value = [], onChange }) => {
  // 获取角色数据权限
  const { data: resTreeData, loading: treeLoading } = useRequest(deptTreeselect);
  const treeData = useMemo(() => formatTreeData(resTreeData), [resTreeData]);
  return (
    <Spin spinning={treeLoading}>
      <Tree
        defaultExpandAll
        height={300}
        checkable
        treeData={treeData}
        checkedKeys={value}
        onCheck={(checkedKeys) => {
          if (onChange) onChange(checkedKeys);
        }}
      />
    </Spin>
  );
};

const dataScopeOptions = [
  {
    value: '1',
    label: '全部数据权限',
  },
  {
    value: '2',
    label: '自定数据权限',
  },
  {
    value: '3',
    label: '本部门数据权限',
  },
  {
    value: '4',
    label: '本部门及以下数据权限',
  },
  {
    value: '5',
    label: '仅本人数据权限',
  },
];

const RegistrationForm = (props) => {
  const { visible, onClose, onSubmit, values = {}, title } = props;
  const [form] = Form.useForm();
  const ref = useRef(null);

  // 查询角色数据权限
  const { run: roleDeptRun } = useRequest(() => roleDeptTreeselect(values.roleId), {
    manual: true,
    onSuccess(res) {
      console.log('deptIds');
      console.log(res.checkedKeys.map((m) => `${m}`));
      form.setFieldsValue({
        deptIds: res.checkedKeys,
      });
    },
    formatResult: (res) => res,
  });
  // 保存数据权限
  const { loading: updateLoading, run: updateRun } = useRequest(dataScope, {
    manual: true,
    onSuccess(res) {
      ref.current.done(false);
      message.success('角色权限保存成功！');
      onSubmit();
    },
    onError(err) {
      ref.current.done(false);
    },
  });

  useEffect(() => {
    if (values.roleId && visible) roleDeptRun();

    if (visible && !updateLoading) {
      form.setFieldsValue({
        roleName: values.roleName || '',
        roleKey: values.roleKey || '',
        dataScope: values.dataScope,
      });
    }
  }, [visible]);

  return (
    <ZxModal
      ref={ref}
      title={title}
      visible={visible}
      onCancel={() => onClose()}
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
          console.log(formValues);
          updateRun({ ...formValues, roleId: values.roleId });
        }}
        scrollToFirstError
        preserve={false}
      >
        <Form.Item name="roleName" label="角色名称">
          <Input disabled />
        </Form.Item>

        <Form.Item name="roleKey" label="权限字符">
          <Input disabled />
        </Form.Item>

        <Form.Item name="dataScope" label="权限范围">
          <Select style={{ width: 240 }}>
            {dataScopeOptions.map((m) => (
              <Option value={m.value}>{m.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.dataScope !== currentValues.dataScope
          }
        >
          {({ getFieldValue }) => {
            return getFieldValue('dataScope') === '2' ? (
              <Form.Item name="deptIds" label="数据权限">
                <MenuTree />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
      </Form>
    </ZxModal>
  );
};

export default (props) => <RegistrationForm {...props} />;
