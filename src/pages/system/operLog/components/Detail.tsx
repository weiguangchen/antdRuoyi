import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import { Form, Descriptions } from 'antd';
import ProDescriptions from '@ant-design/pro-descriptions';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReactJson from 'react-json-view'
import ZxModal from '@/components/Modal';
import { selectDictLabel } from '@/utils';

const RegistrationForm = (props) => {
  const { visible, onClose, values = {}, title, operTypeDict } = props;
  const [form] = Form.useForm();

  return (
    <ZxModal
      title={title}
      visible={visible}
      footer={null}
      width={600}
      onCancel={() => {
        onClose && onClose();
      }}
    >
      <ProDescriptions title={null} column={1}>
        <ProDescriptions.Item label="操作模块">
          {values.title} / {selectDictLabel(operTypeDict, values.businessType)}
        </ProDescriptions.Item>
        {/* <ProDescriptions.Item span={1} label="请求地址">
          {values.operUrl}
        </ProDescriptions.Item> */}
        <ProDescriptions.Item label="登录信息">
          {values.operName} / {values.operIp} / {values.operLocation}
        </ProDescriptions.Item>
        {/* <ProDescriptions.Item span={1} label="请求方式">
          {values.requestMethod}
        </ProDescriptions.Item> */}
        {/* <ProDescriptions.Item label="操作方法">
          {values.method}
        </ProDescriptions.Item> */}
        <ProDescriptions.Item label="请求参数" valueType="jsonCode">
          {values.operParam}
          {/* {
            values.operParam ?
            <ReactJson src={JSON.parse(values.operParam)} name={false} enableClipboard={false} displayDataTypes={false}/>
            : null
          } */}
          
        </ProDescriptions.Item>
        {/* <ProDescriptions.Item span={2} label="返回参数">
          {values.jsonResult}
        </ProDescriptions.Item> */}
        {/* <ProDescriptions.Item span={1} label="操作状态">
          {values.status === 0 ? '成功' : '失败'}
        </ProDescriptions.Item> */}
        <ProDescriptions.Item label="操作时间">
          {values.operTime}
        </ProDescriptions.Item>
      </ProDescriptions>
    </ZxModal>
  );
};

export default RegistrationForm;
