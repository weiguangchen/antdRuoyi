import React, { useState, ReactNode, FC } from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal/Modal.d';

export interface ZxModalProps extends ModalProps {
    onFinish?: () => Promise<boolean> | boolean;
    onVisibleChange: (visible: boolean) => void
    children?: ReactNode
}

const MyModal: FC<ZxModalProps> = (props) => {
    const { visible, onVisibleChange, children, onFinish } = props;
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

    return (
        <Modal
            maskClosable={false}
            destroyOnClose
            visible={visible}
            confirmLoading={confirmLoading}
            onOk={async () => {
                setConfirmLoading(true)
                if (onFinish) {
                    try {
                        const res = await onFinish()
                        // console.log('res')
                        // console.log(res)
                        if(res) {
                            onVisibleChange(false)
                        }
                        setConfirmLoading(false)
                        
                    }catch(err) {
                        if(err) {
                            onVisibleChange(false)
                        }
                        setConfirmLoading(false)
                    }
                }
            }}
            onCancel={() => {
                onVisibleChange(false)
            }}
            {...props}
        >
            { children}
        </Modal>
    );
};

export default MyModal;
