import React from 'react';
import type { ModalFormProps } from '@ant-design/pro-form';
import { ModalForm } from '@ant-design/pro-form';

export interface ZxModalFormProps extends ModalFormProps {
    done?: any;
}

const ZxModalForm: React.FC<ModalFormProps> = (props) => {
    return (
        <ModalForm
            layout="horizontal"
            {...props}
        >
            {props.children}
        </ModalForm>
    )
}
export default ZxModalForm;