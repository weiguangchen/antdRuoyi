import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal } from 'antd';
import React, { useState, useRef, useMemo } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule, listData, delData } from './service';
import { getType, getDicts } from '@/pages/System/Dict/service';
import { useRequest } from 'umi';
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
  const { match } = props;
  const {
    params: { dictId },
  } = match;

  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  // 获取字典类型
  const { data: dictData, loading: dictLoading } = useRequest(() => getType(dictId));
  const { data: statusDict } = useRequest(() => getDicts('mfrs_normal_disable'));

  const dictType = useMemo(() => {
    return dictData ? dictData.dictType : '';
  }, [dictData]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '字典编码',
      dataIndex: 'dictCode',
      tip: '规则名称是唯一的 key',
    },
    {
      title: '字典标签',
      dataIndex: 'dictLabel',
      valueType: 'textarea',
    },
    {
      title: '字典键值',
      dataIndex: 'dictValue',
      sorter: true,
    },
    {
      title: '字典排序',
      dataIndex: 'dictSort',
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
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
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
                content: '是否确认删除 ' + record.dictLabel,
                okText: '确认',
                onOk() {
                  return new Promise((resolve, reject) => {
                    delData(record.dictCode)
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
      {dictLoading ? null : (
        <ProTable<TableListItem>
          headerTitle="查询表格"
          actionRef={actionRef}
          rowKey="dictCode"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> 新建
            </Button>,
          ]}
          request={(params, sorter, filter) => listData({ ...params, sorter, filter, dictType })}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
        />
      )}
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
                  const dictCodes = selectedRowsState.map((m) => m.dictCode);
                  return new Promise((resolve, reject) => {
                    delData(dictCodes)
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
        title="添加字典"
        visible={modalVisible}
        onClose={() => handleModalVisible(false)}
        onSubmit={() => {
          handleModalVisible(false);
          if (actionRef.current) actionRef.current.reload();
        }}
        dicttype={dictType}
      />

      {updateFormValues && Object.keys(updateFormValues).length ? (
        <AddForm
          title="修改字典"
          visible={updateModalVisible}
          onClose={() => handleUpdateModalVisible(false)}
          onSubmit={() => {
            handleUpdateModalVisible(false);
            if (actionRef.current) actionRef.current.reload();
          }}
          dicttype={dictType}
          values={updateFormValues}
        />
      ) : null}

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
