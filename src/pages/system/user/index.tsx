import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  message,
  Input,
  Drawer,
  Switch,
  Modal,
  Form,
} from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import type { TableListItem } from './data.d';
import {
  listUser,
  changeUserStatus,
  delUser,
  resetUserPwd,
} from './service';
import AddForm from './components/Form';
import { getUser } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [form] = Form.useForm();

  // const { run: runGetUser, loading: userLoading } = useRequest(getUser, {
  //   manual: true,
  //   formatResult: (res) => res,
  //   onSuccess(res) {
  //     const { data, postIds, posts, roleIds, roles } = res;
  //     formRef?.current?.setFieldsValue({
  //       status: '0',
  //       password: '123456',
  //       ...data,
  //       postIds: postIds.map((m) => `${m}`),
  //       roleIds: roleIds.map((m) => `${m}`),
  //     });
  //   },
  // });

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
      renderText: (dept: TableListItem) => dept ? `${dept.deptName}` : '',
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
          checked={_ == '0'}
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
                  postIds: postIds.map((m) => m),
                  roleIds: roleIds.map((m) => m),
                }
                setUpdateFormValues(values);
                setModalVisible(true);
              } catch (err) {
                console.log(err)
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
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                  项&nbsp;&nbsp;
                  {/* <span>
                    服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
                    万
                  </span> */}
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
              </Button>
          {/* <Button type="primary">批量审批</Button> */}
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

      {/* <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
            <ProTable<TableListItem, TableListItem>
              onSubmit={async (value) => {
                const success = await handleAdd(value);
                if (success) {
                  handleModalVisible(false);
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
              rowKey="key"
              type="form"
              columns={columns}
            />
          </CreateForm>
          {stepFormValues && Object.keys(stepFormValues).length ? (
            <UpdateForm
              onSubmit={async (value) => {
                const success = await handleUpdate(value);
                if (success) {
                  handleUpdateModalVisible(false);
                  setStepFormValues({});
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
              onCancel={() => {
                handleUpdateModalVisible(false);
                setStepFormValues({});
              }}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
            />
          ) : null} */}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
