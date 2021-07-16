import React, { FC, useMemo, useState } from 'react';
import { Upload, message, Modal } from 'antd';
import { UploadProps } from 'antd/es/upload/interface'
import ImgCrop, { ImgCropProps } from 'antd-img-crop';

import { getToken } from '@/utils/auth';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
const { NODE_ENV } = process.env;
const action = `${NODE_ENV == 'development' ? '/dev-api' : '/prod-api'}/common/uploads`

interface CropperProps extends UploadProps {
    value?: Array<any>;
    onChange?: (value: any) => void;
    limit?: number;
    cropProps?: ImgCropProps;
    disabled?: boolean;
    accept?: string;
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// 扩展名
const extensionsMap = {
    'gif': "image/gif",
    'jpg': "image/jpeg",
    'png': "image/png"
};



const Cropper: FC<CropperProps> = props => {
    const { value = [], onChange, limit = 0, cropProps = { aspect: 1 }, disabled = false, data, accept } = props;

    // 图片预览
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>点击上传</div>
        </div>
    );

    const acceptArr = useMemo(() => {
        if(!accept) return [];
        const acceptList = accept.split(',');
        return acceptList.map(m => extensionsMap[m]);
    },[accept]);

    return (
        <>
            <ImgCrop
                {...cropProps}
            >
                <Upload
                    disabled={disabled}
                    listType='picture-card'
                    action={action}
                    headers={{
                        Authorization: 'Bearer ' + getToken()
                    }}
                    data={data}
                    fileList={value}
                    name='file'
                    onPreview={async file => {
                        // console.log(file)
                        if (!file.url && !file.preview) {
                            file.preview = await getBase64(file.originFileObj);
                        }
                        setPreviewImage(file.url || file.preview)
                        setPreviewVisible(true);
                        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
                    }}
                    accept={acceptArr.join(',')}
                    beforeUpload={(file, fileList) => {
                        console.log('file')
                        console.log(file)
                        console.log(acceptArr)
                        if(acceptArr.length == 0) return true;
                        const isAllowType = acceptArr.some(n => n == file.type);
                        if (!isAllowType) {
                            message.error(`仅支持上传 ${accept} 文件`);
                        }
                        return isAllowType ? true : Upload.LIST_IGNORE;
                    }}
                    onChange={({ file, fileList }) => {
                        console.log('file')
                        console.log(file)
                        //1. filter status is not error
                        fileList = fileList.filter((file) => file.status !== 'error');
                        // 2. read from response and show file link
                        fileList = fileList.map((file) => {
                            if (file.response) {
                                file.uid = file.response.data.picId;
                            }
                            return file;
                        });
                        // 3. filter successfully uploaded files according to response from server
                        fileList = fileList.filter((file) => {
                            if (file.response) {
                                return file.response.success === true;
                            }
                            return true;
                        });

                        onChange && onChange(fileList)
                    }}
                >
                    {
                        disabled ? null : 
                            limit === 0 ? uploadButton : 
                                value.length >= limit ? null : uploadButton
                    }
                </Upload>
            </ImgCrop>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>

    )
}

export default Cropper;