import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Switch, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { TableListItem } from './data.d';
import {
  listRole,
  delRole,
  changeRoleStatus,
} from './service';
import AddForm from './components/Form';
import AuthForm from './components/AuthForm';
import { useRequest } from 'umi';
import { roleMenuTreeselect } from '../menu/service';
import { roleDeptTreeselect } from '../dept/service';

const TableList: React.FC<{}> = () => {
  // 添加修改弹框
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  // 数据权限弹框
  const [authVisible, setAuthVisible] = useState<boolean>(false);
  const [authFormValues, setAuthFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);



  const columns: ProColumns<TableListItem>[] = [
    {
      title: '角色编号',
      dataIndex: 'roleId',
      tip: '规则名称是唯一的 key',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      sorter: true,
    },
    {
      title: '显示顺序',
      dataIndex: 'roleSort',
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
              content: `是否${checked ? '开启' : '停用'}${record.roleName}`,
              okText: '确认',
              onOk() {
                return changeRoleStatus(record.roleId, checked ? '0' : '1')
                  .then(() => {
                    if (actionRef.current) actionRef.current.reload();
                    message.success({ content: `角色已${checked ? '开启' : '停用'}` });
                  })
                  .catch(() => {
                    message.error({ content: `角色${checked ? '开启' : '停用'}失败` });
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
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        record.admin ? null : (
          <>
            <a
              onClick={async () => {
                try {
                  const { checkedKeys } = await roleMenuTreeselect(record?.roleId);
                  const data = {
                    ...record,
                    menuIds: checkedKeys.map(m => `${m}`)
                  }
                  setUpdateFormValues(data);
                  setModalVisible(true);
                } catch (err) {
                  console.log(err)
                }
              }}
            >
              修改
          </a>
            <Divider type="vertical" />
            <a
              onClick={async () => {
                try {
                  // 获取当前角色可选数据权限和已选权限
                  const { checkedKeys, depts } = await roleDeptTreeselect(record?.roleId)
                  const data = {
                    ...record,
                    deptIds: checkedKeys,
                    treeData: depts
                  }
                  setAuthFormValues(data);
                  setAuthVisible(true);
                } catch (err) {
                  console.log(err)
                }
              }}
            >
              数据权限
          </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  content: `是否确认删除 ${record.roleName}`,
                  okText: '确认',
                  onOk() {
                    return delRole(record.roleId)
                      .then(() => {
                        if (actionRef.current) actionRef.current.reload();
                        message.success({ content: '删除角色成功' });
                      })
                      .catch(() => {
                        message.error({ content: '删除角色失败' });
                      });
                  },
                });
              }}
            >
              删除
          </a>
          </>
        )
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="roleId"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setUpdateFormValues({});
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => listRole({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
              {/* <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span> */}
            </div>
          }
        >
          <Button
            onClick={async () => {
              // console.log(selectedRowsState)
              Modal.confirm({
                title: '提示',
                content: '是否确认删除 ',
                okText: '确认',
                onOk() {
                  const roleIds = selectedRowsState.map((m) => m.roleId);
                  return new Promise((resolve, reject) => {
                    delRole(roleIds)
                      .then((res) => {
                        setSelectedRows([]);
                        actionRef.current?.reloadAndRest?.();
                        resolve();
                      })
                      .catch((err) => {
                        message.error(err.msg);
                        reject();
                      });
                  });
                },
              });
            }}
          >
            批量删除
          </Button>
          {/* <Button type="primary">批量审批</Button> */}
        </FooterToolbar>
      )}

      <AddForm
        title={updateFormValues && Object.keys(updateFormValues).length ? '修改角色' : '添加角色'}
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        done={() => {
          if (actionRef.current) actionRef.current.reload();
        }}
        data={updateFormValues}
      />

      <AuthForm
        title="分配数据权限"
        visible={authVisible}
        onVisibleChange={setAuthVisible}
        done={() => {
          if (actionRef.current) actionRef.current.reload();
        }}
        data={authFormValues}
      />

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
