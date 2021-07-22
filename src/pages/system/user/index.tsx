import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  message,
  Input,
  Switch,
  Modal,
  Form,
} from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import {
  listUser,
  changeUserStatus,
  delUser,
  resetUserPwd,
} from './service';
import AddForm from './components/Form';
import { getUser } from './service';

const TableList: React.FC<{}> = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [form] = Form.useForm();


  const columns: ProColumns<TableListItem>[] = [
    {
      title: '用户编号',
      dataIndex: 'userId',
      tip: '规则名称是唯一的 key',
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
    },
    {
      title: '部门',
      dataIndex: 'dept',
      renderText: (dept) => dept ? `${dept.deptName}` : '',
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => (
        <Switch
          checked={_ === '0'}
          onChange={(checked) => {
            Modal.confirm({
              title: '提示',
              content: `是否${checked ? '开启' : '停用'}${record.nickName}`,
              okText: '确认',
              onOk() {
                return changeUserStatus(record.userId, checked ? '0' : '1')
                  .then(() => {
                    if (actionRef.current) actionRef.current.reload();
                    message.success({ content: `用户已${checked ? '开启' : '停用'}` });
                  })
                  .catch((err) => {
                    message.error({ content: err.msg });
                  });
              },
            });
          }}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={async () => {
              try {
                const { userId } = record;
                const { data, postIds, roleIds } = await getUser(userId);
                const values = {
                  data,
                  postIds,
                  roleIds,
                }
                setUpdateFormValues(values);
                setModalVisible(true);
              } catch (err) {
                message.error('修改用户失败！')
              }
            }}
          >
            修改
          </a>
          {record.admin ? null : (
            <>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  Modal.confirm({
                    title: '提示',
                    content: `是否确认删除 ${record.userName}`,
                    okText: '确认',
                    onOk() {
                      return delUser(record.userId)
                        .then(() => {
                          setSelectedRows([]);
                          actionRef.current?.reloadAndRest?.();
                        })
                        .catch((err) => {
                          message.error(err.msg);
                        });
                    },
                  });
                }}
              >
                删除
              </a>
            </>
          )}
          <Divider type="vertical" />
          <a
            onClick={() => {
              Modal.confirm({
                title: '提示',
                content: (
                  <Form name="basic" layout="vertical" form={form}>
                    <Form.Item
                      required={false}
                      label={`请输入${record.userName}的新密码`}
                      name="password"
                      rules={[{ required: true, message: '请填写新密码' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Form>
                ),
                onOk() {
                  return form
                    .validateFields()
                    .then(() => {
                      const password = form.getFieldValue('password');
                      return resetUserPwd(record.userId, password);
                    })
                    .then(() => {
                      form.resetFields();
                      message.success('密码重置成功！')
                    })
                },
              });
            }}
          >
            重置
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="userId"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setModalVisible(true);
              setUpdateFormValues({});
            }}
          >
            <PlusOutlined /> 新建
              </Button>,
        ]}
        request={(params, sorter, filter) => listUser({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}项
            </div>
          }
        >
          <Button
            onClick={async () => {
              const userIds = selectedRowsState.map(m => m.userId);
              Modal.confirm({
                title: '提示',
                content: '是否确认删除所选择用户？',
                okText: '确认',
                onOk() {
                  return delUser(userIds)
                    .then(() => {
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                    })
                    .catch((err) => {
                      message.error(err.msg);
                    });
                },
              });
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <AddForm
        title={
          updateFormValues && Object.keys(updateFormValues).length ? '修改用户' : '添加用户'
        }
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        data={updateFormValues}
        done={() => {
          if (actionRef.current) actionRef.current.reload();
        }}
      />

    </PageContainer>
  );
};

export default TableList;
