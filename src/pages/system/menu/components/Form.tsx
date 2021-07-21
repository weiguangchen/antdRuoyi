import './index.scss';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import type {
  FormInstance
} from 'antd';
import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  TreeSelect,
  Popover,
  Radio,
  message,
  Spin,
  InputNumber
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { listMenu, addMenu, updateMenu } from '../service';
import { getDicts } from '@/pages/System/Dict/service';
import { handleTree } from '@/utils';
import ZxModal from '@/components/Modal/index';
import type { ZxModalFormProps } from '@/components/Modal/ZxModalForm';
import ZxModalForm from '@/components/Modal/ZxModalForm';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 10,
    },
  },
};

// const RegistrationForm = (props) => {
//   const { visible, values = {}, onClose, onSubmit } = props;
//   const [form] = Form.useForm();
//   const [loading,setLoading] = useState(false)

//   const { data: resTreeData, loading: treeLoading } = useRequest(listMenu, {
//     refreshDeps: [visible],
//   });
//   const treeData = useMemo(() => {
//     const menu = { value: 0, title: '主类目', children: [] };
//     if (resTreeData) {
//       const tempTreeData = resTreeData.map((m: any) => {
//         m.title = m.menuName;
//         m.value = m.menuId;
//         return m;
//       });
//       menu.children = handleTree(tempTreeData, 'menuId');
//     }

//     return [menu];
//   }, [resTreeData]);

//   // 显示状态字典
//   const { loading: sysShowLoading, data: sysShowDicts } = useRequest(() =>
//     getDicts('mfrs_show_hide'),
//   );
//   // 菜单状态字典
//   const { loading: disableLoading, data: disableDicts } = useRequest(() =>
//     getDicts('mfrs_normal_disable'),
//   );

//   useEffect(() => {
//     if (visible && !loading ) {
//       form.setFieldsValue({
//         menuType: 'M',
//         isFrame: '1',
//         visible: '0',
//         status: '0',
//         ...values,
//       });
//     }
//   }, [visible]);


//   return (
//     <ZxModal
//       title={props.title}
//       visible={visible}
//       onCancel={() => onClose()}
//       onOk={() => {
//         form
//           .validateFields()
//           .then((res) => {
//             setLoading(true)
//             form.submit();
//           })
//       }}
//       confirmLoading={loading}
//     >
//       <Form
//         {...formItemLayout}
//         form={form}
//         name="register"
//         onFinish={(formValues) => {
//           if (values.menuId) {
//             updateMenu({ ...formValues, menuId: values.menuId }).then(res => {
//               message.success('菜单修改成功！');
//               onSubmit();
//               setLoading(false)
//             }).catch(err => {
//               message.error('菜单修改失败！');
//               setLoading(false)
//             })
//           } else {
//             addMenu(formValues).then(res => {
//               message.success('菜单添加成功！');
//               onSubmit();
//               setLoading(false)
//             }).catch(err => {
//               message.error('菜单添加失败！');
//               setLoading(false)
//             })
//           }
//         }}
//         scrollToFirstError
//         preserve={false}
//       >
//         <Form.Item
//           name="parentId"
//           label="上级菜单"
//           rules={[
//             {
//               required: true,
//               message: '请选择上级菜单',
//             },
//           ]}
//         >
//           {treeLoading ? (
//             <Spin />
//           ) : (
//             <TreeSelect
//               showSearch
//               style={{ width: '100%' }}
//               dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
//               placeholder="请选择"
//               treeData={treeData}
//               allowClear
//             />
//           )}
//         </Form.Item>

//         <Form.Item labelCol={{ span: 4 }} name="menuType" label="菜单类型">
//           <Radio.Group>
//             <Radio value="M">目录</Radio>
//             <Radio value="C">菜单</Radio>
//             <Radio value="F">按钮</Radio>
//           </Radio.Group>
//         </Form.Item>

//         <Form.Item
//           noStyle
//           shouldUpdate={(prevValues, currentValues) =>
//             prevValues.menuType !== currentValues.menuType
//           }
//         >
//           {({ getFieldValue }) => {
//             return getFieldValue('menuType') !== 'F' ? (
//               <Form.Item
//                 className="icon-select"
//                 labelCol={{ span: 4 }}
//                 wrapperCol={{ span: 20 }}
//                 name="icon"
//                 label="菜单图标"
//               >
//                 {/* <Popover
//                                     placement='bottom'
//                                     overlayStyle={{
//                                         width: '400px',
//                                     }}
//                                     trigger='click'
//                                     content={() => {
//                                         return ''
//                                     }}
//                                 > */}
//                 <Input
//                 // readOnly
//                 />
//                 {/* </Popover> */}
//               </Form.Item>
//             ) : null;
//           }}
//         </Form.Item>

//         <Row gutter={8}>
//           <Col span={12}>
//             <Form.Item
//               labelCol={{ span: 8 }}
//               name="menuName"
//               label="菜单名称"
//               rules={[
//                 {
//                   required: true,
//                   message: '请填写菜单名称',
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               labelCol={{ span: 8 }}
//               name="orderNum"
//               label="显示排序"
//               rules={[
//                 {
//                   required: true,
//                   message: '请填写排序',
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item
//           noStyle
//           shouldUpdate={(prevValues, currentValues) =>
//             prevValues.menuType !== currentValues.menuType
//           }
//         >
//           {({ getFieldValue }) => {
//             return getFieldValue('menuType') !== 'F' ? (
//               <Row gutter={8}>
//                 <Col span={12}>
//                   <Form.Item
//                     labelCol={{ span: 8 }}
//                     name="isFrame"
//                     label="是否外链"
//                     rules={[
//                       {
//                         required: true,
//                         message: '请选择是否外链',
//                       },
//                     ]}
//                   >
//                     <Radio.Group>
//                       <Radio value="0">是</Radio>
//                       <Radio value="1">否</Radio>
//                     </Radio.Group>
//                   </Form.Item>
//                 </Col>
//                 <Col span={12}>
//                   <Form.Item
//                     labelCol={{ span: 8 }}
//                     name="path"
//                     label="路由地址"
//                     rules={[
//                       {
//                         required: true,
//                         message: '请填写路由地址',
//                       },
//                     ]}
//                   >
//                     <Input />
//                   </Form.Item>
//                 </Col>
//               </Row>
//             ) : null;
//           }}
//         </Form.Item>

//         <Row gutter={8}>
//           <Col span={12}>
//             <Form.Item
//               noStyle
//               shouldUpdate={(prevValues, currentValues) =>
//                 prevValues.menuType !== currentValues.menuType
//               }
//             >
//               {({ getFieldValue }) => {
//                 return getFieldValue('menuType') === 'C' ? (
//                   <Form.Item labelCol={{ span: 8 }} name="component" label="组件路径">
//                     <Input />
//                   </Form.Item>
//                 ) : null;
//               }}
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               noStyle
//               shouldUpdate={(prevValues, currentValues) =>
//                 prevValues.menuType !== currentValues.menuType
//               }
//             >
//               {({ getFieldValue }) => {
//                 return getFieldValue('menuType') !== 'M' ? (
//                   <Form.Item labelCol={{ span: 8 }} name="perms" label="权限标识">
//                     <Input />
//                   </Form.Item>
//                 ) : null;
//               }}
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={8}>
//           <Col span={12}>
//             <Form.Item
//               noStyle
//               shouldUpdate={(prevValues, currentValues) =>
//                 prevValues.menuType !== currentValues.menuType
//               }
//             >
//               {({ getFieldValue }) => {
//                 return getFieldValue('menuType') !== 'F' ? (
//                   <Form.Item name="visible" label="显示状态" labelCol={{ span: 8 }}>
//                     {!sysShowLoading ? (
//                       <Radio.Group>
//                         {sysShowDicts.map((m) => (
//                           <Radio value={m.dictValue}>{m.dictLabel}</Radio>
//                         ))}
//                       </Radio.Group>
//                     ) : null}
//                   </Form.Item>
//                 ) : null;
//               }}
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               noStyle
//               shouldUpdate={(prevValues, currentValues) =>
//                 prevValues.menuType !== currentValues.menuType
//               }
//             >
//               {({ getFieldValue }) => {
//                 return getFieldValue('menuType') !== 'F' ? (
//                   <Form.Item name="status" label="菜单状态" labelCol={{ span: 8 }}>
//                     {!disableLoading ? (
//                       <Radio.Group>
//                         {disableDicts.map((m) => (
//                           <Radio value={m.dictValue}>{m.dictLabel}</Radio>
//                         ))}
//                       </Radio.Group>
//                     ) : null}
//                   </Form.Item>
//                 ) : null;
//               }}
//             </Form.Item>
//           </Col>
//         </Row>
//       </Form>
//     </ZxModal>
//   );
// };

// export default RegistrationForm;


interface MenuModalFormProps extends ZxModalFormProps {
  data: any
}

const MenuModalForm: React.FC<MenuModalFormProps> = (props) => {
  const { visible, data, done } = props;
  const formRef = useRef<FormInstance>();

  const { data: resTreeData, loading: treeLoading } = useRequest(listMenu, {
    refreshDeps: [visible],
  });
  const treeData = useMemo(() => {
    const menu = { value: 0, title: '主类目', children: [] };
    if (resTreeData) {
      const tempTreeData = resTreeData.map((m: any) => {
        m.title = m.menuName;
        m.value = m.menuId;
        return m;
      });
      menu.children = handleTree(tempTreeData, 'menuId');
    }

    return [menu];
  }, [resTreeData]);

  // 显示状态字典
  const { loading: sysShowLoading, data: sysShowDicts } = useRequest(() => getDicts('mfrs_show_hide'));
  // 菜单状态字典
  const { loading: disableLoading, data: disableDicts } = useRequest(() =>
    getDicts('mfrs_normal_disable'),
  );


  useEffect(() => {
    if (visible) {
      formRef?.current?.setFieldsValue({
        parentId: data?.parentId ?? undefined,
        menuType: data?.menuType ?? 'M',
        icon: data?.icon ?? undefined,
        menuName: data?.menuName ?? undefined,
        orderNum: data?.orderNum ?? undefined,
        isFrame: data?.isFrame ?? '1',
        path: data?.path ?? undefined,
        component: data?.component ?? undefined,
        perms: data?.perms ?? undefined,
        visible: data?.visible ?? '0',
        status: data?.status ?? '0',
      });
    }
  }, [visible]);

  return (
    <ZxModalForm
      formRef={formRef}
      {...formItemLayout}
      modalProps={{
        onCancel: () => console.log('run'),
      }}
      onFinish={async (values) => {
        if (data.menuId) {
          return updateMenu({ ...values, menuId: data.menuId }).then(() => {
            message.success('菜单修改成功！');
            done?.()
            return true;
          }).catch(() => {
            message.error('菜单修改失败！');
            return false;
          })
        } 
          return addMenu(values).then(() => {
            message.success('菜单添加成功！');
            done?.()
            return true;
          }).catch(() => {
            message.error('菜单添加失败！');
            return false;
          })
        
      }}
      {...props}
    >
      <Form.Item
        name="parentId"
        label="上级菜单"
        rules={[
          {
            required: true,
            message: '请选择上级菜单',
          },
        ]}
      >
        {treeLoading ? (
          <Spin />
        ) : (
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              treeData={treeData}
              allowClear
            />
          )}
      </Form.Item>

      <Form.Item labelCol={{ span: 4 }} name="menuType" label="菜单类型">
        <Radio.Group>
          <Radio value="M">目录</Radio>
          <Radio value="C">菜单</Radio>
          <Radio value="F">按钮</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.menuType !== currentValues.menuType
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue('menuType') !== 'F' ? (
            <Form.Item
              className="icon-select"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="icon"
              label="菜单图标"
            >
              <Input />
            </Form.Item>
          ) : null;
        }}
      </Form.Item>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 8 }}
            name="menuName"
            label="菜单名称"
            rules={[
              {
                required: true,
                message: '请填写菜单名称',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            labelCol={{ span: 8 }}
            name="orderNum"
            label="显示排序"
            rules={[
              {
                required: true,
                message: '请填写排序',
              },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.menuType !== currentValues.menuType
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue('menuType') !== 'F' ? (
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 8 }}
                  name="isFrame"
                  label="是否外链"
                  rules={[
                    {
                      required: true,
                      message: '请选择是否外链',
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="0">是</Radio>
                    <Radio value="1">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  labelCol={{ span: 8 }}
                  name="path"
                  label="路由地址"
                  rules={[
                    {
                      required: true,
                      message: '请填写路由地址',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          ) : null;
        }}
      </Form.Item>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.menuType !== currentValues.menuType
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue('menuType') === 'C' ? (
                <Form.Item labelCol={{ span: 8 }} name="component" label="组件路径">
                  <Input />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.menuType !== currentValues.menuType
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue('menuType') !== 'M' ? (
                <Form.Item labelCol={{ span: 8 }} name="perms" label="权限标识">
                  <Input />
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.menuType !== currentValues.menuType
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue('menuType') !== 'F' ? (
                <Form.Item name="visible" label="显示状态" labelCol={{ span: 8 }}>
                  {!sysShowLoading ? (
                    <Radio.Group>
                      {sysShowDicts.map((m) => (
                        <Radio value={m.dictValue}>{m.dictLabel}</Radio>
                      ))}
                    </Radio.Group>
                  ) : null}
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.menuType !== currentValues.menuType
            }
          >
            {({ getFieldValue }) => {
              return getFieldValue('menuType') !== 'F' ? (
                <Form.Item name="status" label="菜单状态" labelCol={{ span: 8 }}>
                  {!disableLoading ? (
                    <Radio.Group>
                      {disableDicts.map((m) => (
                        <Radio value={m.dictValue}>{m.dictLabel}</Radio>
                      ))}
                    </Radio.Group>
                  ) : null}
                </Form.Item>
              ) : null;
            }}
          </Form.Item>
        </Col>
      </Row>
    </ZxModalForm>
  )
}

export default MenuModalForm;