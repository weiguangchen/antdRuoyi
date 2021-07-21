import { Badge, Card, Descriptions, Divider, Table, Row, Col, Typography } from 'antd';
import React, { Component } from 'react';

import { PageContainer } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { BasicProfileDataType } from './data.d';
import styles from './style.less';
import { StateType } from './model';

const { Text } = Typography;

interface ServerProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  monitorAndServer: BasicProfileDataType;
}
interface ServerState {
  visible: boolean;
}

class Server extends Component<ServerProps, ServerState> {
  componentDidMount() {
    console.log('props');
    console.log(this.props);
    const { dispatch } = this.props;
    dispatch({
      type: 'monitorAndServer/fetchSys',
    });
  }

  render() {
    const { monitorAndServer, loading } = this.props;
    const { cpu, mem, jvm, sys, sysFiles } = monitorAndServer;

    const renderContent = (value: any, row: any, index: any) => {
      const obj: {
        children: any;
        props: { colSpan?: number };
      } = {
        children: value,
        props: {},
      };
      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    const goodsColumns = [
      {
        title: '商品编号',
        dataIndex: 'id',
        key: 'id',
        render: (text: React.ReactNode, row: any, index: number) => {
          if (index < basicGoods.length) {
            return <a href="">{text}</a>;
          }
          return {
            children: <span style={{ fontWeight: 600 }}>总计</span>,
            props: {
              colSpan: 4,
            },
          };
        },
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        render: renderContent,
      },
      {
        title: '商品条码',
        dataIndex: 'barcode',
        key: 'barcode',
        render: renderContent,
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        align: 'right' as 'left' | 'right' | 'center',
        render: renderContent,
      },
      {
        title: '数量（件）',
        dataIndex: 'num',
        key: 'num',
        align: 'right' as 'left' | 'right' | 'center',
        render: (text: React.ReactNode, row: any, index: number) => {
          if (index < basicGoods.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right' as 'left' | 'right' | 'center',
        render: (text: React.ReactNode, row: any, index: number) => {
          if (index < basicGoods.length) {
            return text;
          }
          return <span style={{ fontWeight: 600 }}>{text}</span>;
        },
      },
    ];

    // cpu
    const cpuData = [
      {
        key: '1',
        desc: '核心数',
        value: cpu.cpuNum,
      },
      {
        key: '2',
        desc: '用户使用率',
        value: `${cpu.used}%`,
      },
      {
        key: '3',
        desc: '系统使用率',
        value: `${cpu.sys}%`,
      },
      {
        key: '4',
        desc: '当前空闲率',
        value: `${cpu.free}%`,
      },
    ];
    const cpuColumns = [
      {
        title: '属性',
        dataIndex: 'desc',
      },
      {
        title: '值',
        dataIndex: 'value',
      },
    ];
    // 内存
    const memData = [
      {
        key: '1',
        desc: '总内存',
        mem: mem.total,
        jvm: jvm.total,
      },
      {
        key: '2',
        desc: '已用内存',
        mem: mem.used,
        jvm: jvm.used,
      },
      {
        key: '3',
        desc: '剩余内存',
        mem: mem.free,
        jvm: jvm.free,
      },
      {
        key: '4',
        desc: '使用率',
        mem: mem.usage,
        jvm: jvm.usage,
      },
    ];
    const memColumns = [
      {
        title: '属性',
        dataIndex: 'desc',
      },
      {
        title: '内存',
        dataIndex: 'mem',
      },
      {
        title: 'JVM',
        dataIndex: 'jvm',
      },
    ];
    // 磁盘状态
    const sysFileColumns = [
      {
        title: '盘符路径',
        dataIndex: 'dirName',
      },
      {
        title: '文件系统',
        dataIndex: 'sysTypeName',
      },
      {
        title: '盘符类型',
        dataIndex: 'typeName',
      },
      {
        title: '总大小',
        dataIndex: 'total',
      },
      {
        title: '可用大小',
        dataIndex: 'free',
      },
      {
        title: '已用大小',
        dataIndex: 'used',
      },
      {
        title: '已用百分比',
        dataIndex: 'usage',
        render: (text) => <Text type={text > 80 ? 'danger' : undefined}>{text}%</Text>,
      },
    ];

    return (
      <PageContainer>
        <Card bordered={false}>
          <Row gutter={20}>
            <Col span={12}>
              <div className={styles.title}>CPU</div>
              <Table
                style={{ marginBottom: 24 }}
                pagination={false}
                loading={loading}
                dataSource={cpuData}
                columns={cpuColumns}
                rowKey="id"
              />
            </Col>
            <Col span={12}>
              <div className={styles.title}>内存</div>
              <Table
                style={{ marginBottom: 24 }}
                pagination={false}
                loading={loading}
                dataSource={memData}
                columns={memColumns}
                rowKey="id"
              />
            </Col>
          </Row>
          <Descriptions column={2} title="服务器信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="服务器名称">{sys.computerName}</Descriptions.Item>
            <Descriptions.Item label="操作系统">{sys.osName}</Descriptions.Item>
            <Descriptions.Item label="服务器IP">{sys.computerIp}</Descriptions.Item>
            <Descriptions.Item label="系统架构">{sys.osArch}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <Descriptions column={2} title="Java虚拟机信息" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="Java名称">{jvm.name}</Descriptions.Item>
            <Descriptions.Item label="Java版本">{jvm.version}</Descriptions.Item>
            <Descriptions.Item label="启动时间">{jvm.startTime}</Descriptions.Item>
            <Descriptions.Item label="运行时长">{jvm.runTime} </Descriptions.Item>
            <Descriptions.Item label="安装路径">{jvm.home}</Descriptions.Item>
            <Descriptions.Item label="项目路径">{sys.userDir}</Descriptions.Item>
          </Descriptions>
          <div className={styles.title}>磁盘状态</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={sysFiles}
            columns={sysFileColumns}
          />
        </Card>
      </PageContainer>
    );
  }
}

export default connect(
  ({
    monitorAndServer,
    loading,
  }: {
    monitorAndServer: BasicProfileDataType;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    monitorAndServer,
    loading: loading.effects['monitorAndServer/fetchSys'],
  }),
)(Server);
