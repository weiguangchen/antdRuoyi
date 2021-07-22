import type { ModalProps } from 'antd';
import { Modal } from 'antd';
import React, { useState } from 'react';

export interface ZxModalProps extends ModalProps {
  onFinish?: () => Promise<any>;
  onVisibleChange: any;
}

const ZxModal: React.FC<ZxModalProps> = (props) => {
  const { children, visible, onFinish, onVisibleChange } = props;
  const [loading, setLoading] = useState(false)


  return (
    <Modal
      maskClosable={false}
      destroyOnClose
      confirmLoading={loading}
      visible={visible}
      onOk={() => {
        if (onFinish) {
          setLoading(true)
          onFinish().then(() => {
            onVisibleChange(true)
          }).catch((err: any) => {
            console.log(err)
          }).finally(() => {
            setLoading(false)
          })
        }
      }}
      onCancel={() => {
        setLoading(false)
        onVisibleChange(false)
      }}
      {...props}
    >
      { children}
    </Modal>
  );
}

export default ZxModal;
