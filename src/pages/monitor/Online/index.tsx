import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule, listOnline, forceLogout } from './service';

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
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    // {
    //   title: '序号',
    //   renderText: (_, record, index) => index
    // },
    {
      title: '会话编号',
      dataIndex: 'tokenId',
    },
    {
      title: '登录名称',
      dataIndex: 'userName',
    },
    {
      title: '部门名称',
      dataIndex: 'deptName',
    },
    {
      title: '主机',
      dataIndex: 'ipaddr',
    },
    {
      title: '登录地点',
      dataIndex: 'loginLocation',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
    },
    {
      title: '登陆时间',
      dataIndex: 'loginTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <a
          onClick={() => {
            Modal.confirm({
              title: '提示',
              content: '是否确认强退' + record.userName,
              okText: '确认',
              onOk() {
                return new Promise((resolve, reject) => {
                  forceLogout(record.tokenId)
                    .then((res) => {
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
          强退
        </a>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          // <Button type="primary" onClick={() => handleModalVisible(true)}>
          //   <PlusOutlined /> 新建
          // </Button>,
        ]}
        request={(params, sorter, filter) => listOnline({ ...params, sorter, filter })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
