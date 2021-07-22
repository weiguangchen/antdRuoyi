import { PlusOutlined, UploadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Upload, Modal, message, Button } from 'antd';
import { UploadProps } from 'antd/es/upload/interface';
import { connect, Dispatch, FormattedMessage, formatMessage } from 'umi';
import React, { FC, useMemo, useState } from 'react';
import styles from './style.less';
import { getToken } from '@/utils/auth';
const { NODE_ENV } = process.env;
const action = `${NODE_ENV == 'development' ? '/dev-api' : '/prod-api'}/common/uploadFile`;
interface MyUploadFileProps extends UploadProps {
  limit?: number;
  value?: any;
  accept?: string;
  onChange?: (value: any) => void;
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
} // 扩展名

const extensionsMap = {
  txt: 'text/plain',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ppt: 'application/vnd.ms-powerpoint',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  png: 'image/png',
};

const Uploader: FC<MyUploadFileProps> = (props) => {
  const { value = [], onChange, limit = 0, disabled = false, accept } = props;
  console.log('value');
  console.log(value); // console.log('accept)

  const acceptArr = useMemo(() => {
    if (!accept) return [];
    const acceptList = accept.split(',');
    return acceptList.map((m) => extensionsMap[m]);
  }, [accept]); // const newValue = useMemo(() => {
  //   return value.map(m => {
  //     m.name = `${m.name}.${m.url?.split('.').pop()}`
  //     return m;
  //   })
  // },[value])

  return (
    <>
      <Upload
        {...props}
        disabled={disabled}
        multiple={true}
        action={action}
        headers={{
          Authorization: 'Bearer ' + getToken(),
        }}
        accept={acceptArr.join(',')}
        beforeUpload={(file, fileList) => {
          console.log('file');
          console.log(file);
          console.log(accept); // console.log('beforeUpload',fileList)

          if (acceptArr.length == 0) return true;
          const isAllowType = acceptArr.some((n) => n == file.type);

          if (!isAllowType) {
            message.error(`仅支持上传 ${accept} 文件`);
          }

          return isAllowType ? true : Upload.LIST_IGNORE;
        }}
        fileList={value}
        onChange={({ file, fileList, event }) => {
          // console.log('onChange',fileList)
          //1. filter status is not error
          fileList = fileList.filter((file) => {
            if (file.status === 'error') {
              return false;
            }

            return true;
          }); // 3. filter successfully uploaded files according to response from server

          fileList = fileList.filter((file) => {
            if (file.response) {
              return file.response.success === true;
            }

            return true;
          }); // 2. read from response and show file link

          fileList = fileList.map((file) => {
            if (file.response) {
              file.uid = file.response.data.picId;
              file.url = file.response.data.picPath;
            }

            return file;
          }); // 4. file.status is empty when beforeUpload return false

          fileList = fileList.filter((file) => !!file.status);
          onChange && onChange(fileList);
        }}
        onDownload={(file) => {
          console.log(file);
        }}
        showUploadList={{
          showDownloadIcon: true,
        }}
      >
        {!disabled ? (
          limit === 0 ? (
            <Button icon={<UploadOutlined />}>选择文件</Button>
          ) : value.length >= limit ? null : (
            <Button icon={<UploadOutlined />}>选择文件</Button>
          )
        ) : value.length > 0 ? null : (
          '暂无文件'
        )}
      </Upload>
    </>
  );
};

export default Uploader;
