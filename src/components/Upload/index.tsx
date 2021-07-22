import { PlusOutlined } from '@ant-design/icons';
import { Upload, Modal, message } from 'antd';
import { UploadProps } from 'antd/es/upload/interface';
import { connect, Dispatch, FormattedMessage, formatMessage } from 'umi';
import React, { FC, useMemo, useState } from 'react';
import styles from './style.less';
import { getToken } from '@/utils/auth';
import './index.scss';
const { NODE_ENV } = process.env;
const action = `${NODE_ENV == 'development' ? '/dev-api' : '/prod-api'}/common/uploads`;
interface MyUploadProps extends UploadProps {
  limit?: number;
  value?: any;
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
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
};

const UploadButton = () => (
  <div>
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      点击上传
    </div>
  </div>
);

const Uploader: FC<MyUploadProps> = (props) => {
  const { value = [], onChange, limit = 0, disabled = false, accept } = props; // console.log('value')
  // console.log(value)

  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>(''); // 只读

  const Control = () => {
    if (disabled) {
      return value.length > 0 ? value.length : <span>无图片</span>;
    } else {
      if (limit == 0) return <UploadButton />;
      return value.length >= limit ? null : <UploadButton />;
    }
  }; // 是否隐藏上传按钮

  const hiddenAdd = () => {
    if (disabled) {
      return value.length > 0;
    } else {
      if (limit == 0) return false;
      return value.length >= limit;
    }
  };

  const acceptArr = useMemo(() => {
    if (!accept) return [];
    const acceptList = accept.split(',');
    return acceptList.map((m) => extensionsMap[m]);
  }, [accept]);
  return (
    <>
      <Upload
        {...props}
        multiple={true}
        action={action}
        headers={{
          Authorization: 'Bearer ' + getToken(),
        }}
        listType="picture-card"
        fileList={value}
        accept={acceptArr.join(',')}
        beforeUpload={(file, fileList) => {
          if (acceptArr.length == 0) return true;
          const isAllowType = acceptArr.some((n) => n == file.type);

          if (!isAllowType) {
            message.error(`仅支持上传 ${accept} 文件`);
          }

          return isAllowType ? true : Upload.LIST_IGNORE;
        }}
        onPreview={async (file) => {
          // console.log(file)
          if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
          }

          setPreviewImage(file.url || file.preview);
          setPreviewVisible(true);
          setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        }}
        onChange={({ file, fileList, event }) => {
          // console.log(file)
          // console.log(fileList)
          // console.log(event)
          //1. filter status is not error
          fileList = fileList.filter((file) => {
            if (file.status === 'error') {
              return false;
            }

            return true;
          }); // 2. read from response and show file link

          fileList = fileList.map((file) => {
            if (file.response) {
              file.uid = file.response.data.picId;
            }

            return file;
          }); // 3. filter successfully uploaded files according to response from server

          fileList = fileList.filter((file) => {
            if (file.response) {
              return file.response.success === true;
            }

            return true;
          });
          onChange && onChange(fileList);
        }}
        className={hiddenAdd() ? 'hidden-btn' : ''}
      >
        <Control />
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default Uploader;
