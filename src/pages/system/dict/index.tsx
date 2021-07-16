import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { useRequest, history, Access, useAccess } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { removeRule, listType, delType } from './service';
import AddForm from './components/Form';

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

const TableList: React.FC<{}> = (props) => {
  console.log('props');
  console.log(props);
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '字典编号',
      dataIndex: 'dictId',
      hideInSearch: true,
      // tip: '规则名称是唯一的 key',
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              history.push('/system/dictdata/' + entity.dictId);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: { text: '正常', status: 'Success' },
        1: { text: '停用', status: 'Error' },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'date',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
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
                content: '是否确认删除 ' + record.dictName,
                okText: '确认',
                onOk() {
                  return new Promise((resolve, reject) => {
                    delType(record.dictId)
                      .then((res) => {
                        if (actionRef.current) actionRef.current.reload();
                        message.success({ content: '删除字典成功' });
                        resolve();
                      })
                      .catch((err) => {
                        message.error({ content: '删除字典失败' });
                        reject();
                      });
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
        rowKey="dictId"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => listType({ ...params, sorter, filter })}
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
                  const dictIds = selectedRowsState.map((m) => m.dictId);
                  return new Promise((resolve, reject) => {
                    delType(dictIds)
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
        visible={modalVisible}
        onClose={() => handleModalVisible(false)}
        onSubmit={() => {
          handleModalVisible(false);
          if (actionRef.current) actionRef.current.reload();
        }}
      />

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <AddForm
          visible={updateModalVisible}
          onClose={() => handleUpdateModalVisible(false)}
          onSubmit={() => {
            handleUpdateModalVisible(false);
            if (actionRef.current) actionRef.current.reload();
          }}
          values={updateFormValues}
        />
      ) : null}

      <Drawer
        width="60%"
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.dictId &&
          // <ProDescriptions<TableListItem>
          //   column={2}
          //   title={row?.name}
          //   request={async () => ({
          //     data: row || {},
          //   })}
          //   params={{
          //     id: row?.name,
          //   }}
          //   columns={columns}
          // />
          null}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
