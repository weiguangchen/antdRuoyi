// import React, { useState, useImperativeHandle, ReactNode, useRef } from 'react';
// import { Modal } from 'antd';
// import { ModalProps } from 'antd/lib/modal/Modal.d';

// export interface ZxModalProps extends ModalProps {
//   onClose?: () => void;
//   onSubmit?: () => void;
//   children?: ReactNode
// }

// const CreateForm = React.forwardRef((props: ZxModalProps, ref) => {
//   const { visible, onClose, onSubmit } = props;
//   const [loading, setLoading] = useState(false);

//   useImperativeHandle(ref, () => ({
//     done: (loading: boolean) => {
//       if (!loading) {
//         setTimeout(() => {
//           setLoading(loading);
//         }, 300);
//       } else {
//         setLoading(loading);
//       }
//     }
//   }));

//   return (
//     <Modal
//       maskClosable={false}
//       destroyOnClose
//       visible={visible}
//       onCancel={() => {
//         onClose && onClose();
//       }}
//       onOk={() => {
//         setLoading(true);
//         onSubmit && onSubmit();
//       }}
//       confirmLoading={loading}
//       afterClose={() => {
//         setLoading(false);
//       }}
//       {...props}
//     >
//       {props.children}
//     </Modal>
//   );
// });

// export default CreateForm;



// import React, { useState, ReactNode, FC  } from 'react';
// import { Modal } from 'antd';
// import { ModalProps } from 'antd/lib/modal/Modal.d';

// export interface ZxModalProps extends ModalProps {
//   onClose?: () => void;
//   onSubmit?: () => void;
//   children?: ReactNode
// }

// const MyModal: FC<ZxModalProps> = (props) => {
//   const { visible, children } = props;

//   return (
//     <Modal
//       maskClosable={false}
//       destroyOnClose
//       visible={visible}
//       {...props}
//     >
//       { children }
//     </Modal>
//   );
// };

// export default MyModal;


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
