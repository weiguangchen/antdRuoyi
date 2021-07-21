import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Drawer, DatePicker, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { TableListItem } from './data.d';
import { listPost, delPost } from './service';
import AddForm from './components/Form';

const TableList: React.FC<{}> = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '岗位编号',
      dataIndex: 'postId',
      // tip: '规则名称是唯一的 key',
    },
    {
      title: '岗位编码',
      dataIndex: 'postCode',
      valueType: 'textarea',
    },
    {
      title: '岗位名称',
      dataIndex: 'postName',
      sorter: true,
    },
    {
      title: '岗位排序',
      dataIndex: 'postSort',
      sorter: true,
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
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        if (type === 'form') {
          return null;
        }
        // return defaultRender(item);
        return <DatePicker {...rest} style={{ width: '100%' }} />;
      },
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
              setUpdateFormValues(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              Modal.confirm({
                title: '提示',
                content: `是否确认删除 ${record.postName}`,
                okText: '确认',
                onOk() {
                  return delPost(record.postId)
                    .then(() => {
                      if (actionRef.current) actionRef.current.reload();
                      message.success({ content: '删除岗位成功' });
                    })
                    .catch(() => {
                      message.error({ content: '删除岗位失败' });
                    });
                },
              });
            }}
          >
            删除
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
        rowKey="postId"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => setModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => listPost({ ...params, sorter, filter })}
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
              Modal.confirm({
                title: '提示',
                content: '是否确认删除',
                okText: '确认',
                onOk() {
                  const postIds = selectedRowsState.map((m) => m.postId);
                  return delPost(postIds)
                    .then(() => {
                      setSelectedRows([]);
                      actionRef.current?.reloadAndRest?.();
                      message.success({ content: '删除岗位成功' });
                    })
                    .catch(() => {
                      message.error({ content: '删除岗位失败' });
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
        title={updateFormValues && Object.keys(updateFormValues).length ? "修改岗位" : "添加岗位"}
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        data={updateFormValues}
        done={() => {
          if (actionRef.current) actionRef.current.reload();
        }}
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
