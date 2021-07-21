import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import type { TableListItem } from './data.d';
import { listMenu, updateRule, addRule, removeRule, delMenu } from './service';
import { handleTree } from '@/utils';
import AddForm from './components/Form';

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

const TableList: React.FC<{}> = (props) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const [menuMap, setMenuMap] = useState({})

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      tip: '规则名称是唯一的 key',
    },
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '权限标识',
      dataIndex: 'perms',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '正常',
        },
        1: {
          text: '停用',
        },
      },
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
              setModalVisible(true);
              const data = {
                parentId: record.menuId,
              };
              setUpdateFormValues(data);
            }}
          >
            增加
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              Modal.confirm({
                title: '提示',
                content: `是否确认删除${record.menuName}`,
                okText: '确认',
                onOk() {
                  return delMenu(record.menuId)
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
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="menuId"
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
            key='add'
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => {
          return new Promise((resolve, reject) => {
            listMenu({ sorter, filter })
              .then((response) => {
                const map = {};
                response.data.map(m => {
                  map[m.menuId] = m.menuName
                })
                setMenuMap(map)
                const menuOptions = handleTree(response.data, 'menuId');
                resolve({
                  data: menuOptions,
                  success: true,
                });
              })
              .catch((err) => reject());
          });
        }}
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
                  const menuIds = selectedRowsState.map((m) => m.menuId);
                  return delMenu(menuIds)
                    .then((res) => {
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
        title={updateFormValues && Object.keys(updateFormValues).length ? '修改菜单' : '添加菜单'}
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
