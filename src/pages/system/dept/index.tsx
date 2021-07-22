import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Drawer, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { TableListItem, TableListParams } from './data.d';
import { listDept, delDept } from './service';
import AddForm from './components/Form';
import { handleTree } from '@/utils';

const TableList: React.FC<{}> = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      tip: '规则名称是唯一的 key',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '正常', status: 'Success' },
        1: { text: '停用', status: 'Error' },
      },
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
            onClick={() => {
              setModalVisible(true);
              const rowData = {
                ...record,
                editRoot: record.parentId === 0,
              };
              setUpdateFormValues(rowData);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setModalVisible(true);
              setUpdateFormValues({
                parentId: record.deptId,
              });
            }}
          >
            新增
          </a>
          {record.parentId !== 0 ? (
            <>
              <Divider type="vertical" />
              <a
                onClick={() => {
                  Modal.confirm({
                    title: '提示',
                    content: `是否确认删除${record.deptName}`,
                    okText: '确认',
                    onOk() {
                      return delDept(record.deptId)
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
          ) : null}
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem,TableListParams>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="deptId"
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
        request={(params, sorter, filter) => (
          listDept({ ...params, sorter, filter }).then((response) => {
            const menuOptions = handleTree(response.data, 'deptId');
            return {
              data: menuOptions,
              success: true,
            }
          })
        )}
        columns={columns}
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
              Modal.confirm({
                title: '提示',
                content: '是否确认删除',
                okText: '确认',
                onOk() {
                  const deptIds = selectedRowsState.map((m) => m.deptId);
                  return delDept(deptIds)
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
          {/* <Button type="primary">批量审批</Button> */}
        </FooterToolbar>
      )}

      <AddForm
        title={updateFormValues && Object.keys(updateFormValues).length ? '修改部门' : '添加部门'}
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        done={() => {
          if (actionRef.current) actionRef.current.reload();
        }}
        data={updateFormValues}
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
