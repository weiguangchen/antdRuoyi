import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule, listDept, delDept } from './service';
import AddForm from './components/Form';
import { handleTree } from '@/utils';

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
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
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
              handleModalVisible(true);
              const row = {
                ...record,
                editRoot: record.parentId === 0,
              };
              setUpdateFormValues(row);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleModalVisible(true);
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
                    content: '是否确认删除' + record.deptName,
                    okText: '确认',
                    onOk() {
                      return new Promise((resolve, reject) => {
                        delDept(record.deptId)
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
      <ProTable<TableListItem>
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
              handleModalVisible(true);
              setUpdateFormValues({});
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => {
          return new Promise((resolve, reject) => {
            listDept({ ...params, sorter, filter }).then((response) => {
              let menuOptions = handleTree(response.data, 'deptId');
              console.log('menuOptions');
              console.log(menuOptions);
              resolve({
                data: menuOptions,
                success: true,
              });
            });
          });
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        // }}
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
                  return new Promise((resolve, reject) => {
                    delDept(deptIds)
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
        title={updateFormValues && Object.keys(updateFormValues).length ? '修改部门' : '添加部门'}
        visible={modalVisible}
        onClose={() => handleModalVisible(false)}
        onSubmit={() => {
          handleModalVisible(false);
          if (actionRef.current) actionRef.current.reload();
        }}
        values={updateFormValues}
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
