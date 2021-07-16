import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Drawer, Modal } from 'antd';
import React, { useState, useRef, useMemo } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule, listOperLog, delOperlog } from './service';
import { getDicts } from '@/pages/System/Dict/service';
import { useRequest } from 'umi';
import Detail from './components/Detail';

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
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const { data: operType } = useRequest(() => getDicts('mfrs_oper_type'));

  const operTypeDict = useMemo(() => (operType ? operType.data : []), [operType]);
  const operTypeEnum = useMemo(() => {
    let dict = {};
    if (operType) {
      operType.map((m) => {
        dict[m.dictValue] = {
          text: m.dictLabel,
        };
      });
    }
    return dict;
  }, [operType]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '日志编号',
      dataIndex: 'operId',
      tip: '规则名称是唯一的 key',
    },
    {
      title: '系统模块',
      dataIndex: 'title',
    },
    {
      title: '操作类型',
      dataIndex: 'businessType',
      valueEnum: operTypeEnum,
    },
    // {
    //   title: '请求方式',
    //   dataIndex: 'requestMethod',
    // },
    {
      title: '操作人员',
      dataIndex: 'operName',
    },
    {
      title: '主机',
      dataIndex: 'operIp',
    },
    {
      title: '操作地点',
      dataIndex: 'operLocation',
    },
    {
      title: '操作状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: { text: '成功', status: 'Success' },
        1: { text: '失败', status: 'Error' },
      },
    },
    {
      title: '操作时间',
      dataIndex: 'operTime',
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
              setUpdateFormValues(record);
            }}
          >
            <EyeOutlined /> 详细
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
        rowKey="operId"
        search={{
          labelWidth: 120,
        }}
        request={(params, sorter, filter) => listOperLog({ ...params, sorter, filter })}
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
                  const operIds = selectedRowsState.map((m) => m.operId);
                  return new Promise((resolve, reject) => {
                    delOperlog(operIds)
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

      <Detail
        title="操作日志详细"
        visible={modalVisible}
        onClose={() => handleModalVisible(false)}
        values={updateFormValues}
        operTypeDict={operType}
      />
    </PageContainer>
  );
};

export default TableList;
