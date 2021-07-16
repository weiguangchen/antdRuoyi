import './index.scss';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Button,
  AutoComplete,
  TreeSelect,
  Radio,
  InputNumber,
  Tree,
  message,
  Spin,
  Checkbox,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { listMenu, roleMenuTreeselect } from '../../Menu/service';
import { addRole, getDateByRoleId, updateRole } from '../service';
import { handleTree } from '@/utils';
import ZxModal from '@/components/Modal';
import MyTree from '@/components/Tree';
import { getDicts } from '@/pages/System/Dict/service';

const { Option } = Select;
const { TextArea } = Input;

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

const MenuTree: React.FC = ({ value = [], onChange }) => {
  const { data: resTreeData, loading: treeLoading } = useRequest(listMenu);
  const treeData = useMemo(() => {
    const tempTreeData = resTreeData
      ? resTreeData.map((m: any) => {
        m.title = m.menuName;
        m.key = `${m.menuId}`;
        return m;
      })
      : [];
    return handleTree(tempTreeData, 'menuId');
  }, [resTreeData]);

  return (
    <Spin spinning={treeLoading}>
      <Tree
        height={300}
        checkable
        treeData={treeData}
        checkedKeys={value}
        checkStrictly={true}
        onCheck={(checkedKeys, { halfCheckedKeys }) => {
          if (onChange) onChange(checkedKeys.checked);
        }}
      />
    </Spin>
  );
};
const keys = ['isOffice', 'isQualification', 'isElectronics', 'isAdvertising'];
const typeOptions = [{
  label:'办公用品',
  value:'1'
},{
  label:'资质物料',
  value:'2'
},{
  label:'电子资料',
  value:'3'
},{
  label:'宣传物料',
  value:'4'
}]

const RegistrationForm = (props) => {
  const { visible, onClose, onSubmit, values = {}, title } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)

  // 菜单树
  const { data: resTreeData, loading: treeLoading, refresh } = useRequest(listMenu);
  const treeData = useMemo(() => {
    const tempTreeData = resTreeData
      ? resTreeData.map((m: any) => {
        m.title = m.menuName;
        m.key = `${m.menuId}`;
        return m;
      })
      : [];
    return handleTree(tempTreeData, 'menuId');
  }, [resTreeData]);
  // 转为对象，方便根据key查询name
  const treedataMap = useMemo(() => {
    const map = {};
    resTreeData.map(m => {
      map[m.menuId] = m.menuName;
    })
    return map;
  }, [resTreeData])
  // 查询角色权限
  const { run: roleMenuRun } = useRequest(() => roleMenuTreeselect(values.roleId), {
    manual: true,
    onSuccess(res) {
      form.setFieldsValue({
        menuIds: res.checkedKeys.map((m) => `${m}`),
      });
    },
    formatResult: (res) => res,
  });


  // 回显物料权限
  const { run: getTypeData, data: typeData } = useRequest(() => getDateByRoleId(values?.roleId), {
    manual: true,
    onSuccess(data) {
      let type: any[] = [];
      keys.map((m, i) => {
        if (data[m] == 1) {
          type.push(`${i + 1}`)
        }
      })
      form.setFieldsValue({
        type
      });
    }
  })


  useEffect(() => {
    if (values.roleId && visible) {
      roleMenuRun();
    } else {
      form.setFieldsValue({
        menuIds: [],
      });
    }

    if (visible && !loading) {
      console.log(values)
      form.setFieldsValue({
        roleName: values.roleName || '',
        roleKey: values.roleKey || '',
        roleSort: values.roleSort || 0,
        status: values.status || '0',
        remark: values.remark || '',
      });

      getTypeData()
    }
  }, [visible]);


  return (
    <ZxModal
      title={title}
      visible={visible}
      onCancel={() => onClose()}
      onOk={() => {
        form
          .validateFields()
          .then((res) => {
            setLoading(true)
            form.submit()
          })
      }}
      confirmLoading={loading}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={(formValues) => {

          const { menuIds, type } = formValues;
          const menuList = menuIds.map(m => {
            const obj: any = {};
            obj.menuName = treedataMap[m];
            obj.menuId = m;
            return obj
          })
          // 删除非必要参数，防止污染日志
          delete formValues.menuIds;

          // 处理物料类型
          const types = {};
          keys.map((m,i) => {
              const value = type.includes(`${i+1}`);
              types[m] = value ? '1' : '0';
          })
          console.log(types)
          // 删除非必要参数，防止污染日志
          delete formValues.type;

          if (values.roleId) {
            updateRole({
              roleId: values.roleId,
              menuList,
              mmdId: typeData.mmdId,
              ...formValues,
              ...types,
            }).then(res => {
              message.success('岗位修改成功！');
              onSubmit();
              setLoading(false)
            }).catch(err => {
              message.error('岗位修改失败！');
              setLoading(false)
            })
          } else {
            addRole({
              menuList,
              mmdId: typeData.mmdId,
              ...formValues,
              ...types,
            }).then(res => {
              message.success('岗位添加成功！');
              onSubmit();
              setLoading(false)
            }).catch(err => {
              message.error('岗位添加失败！');
              setLoading(false)
            })
          }
        }}
        scrollToFirstError
        preserve={false}
      >
        <Form.Item
          name="roleName"
          label="角色名称"
          rules={[
            {
              required: true,
              message: '请填写角色名称',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="roleKey"
          label="权限字符"
          rules={[
            {
              required: true,
              message: '请填写权限字符',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="roleSort"
          label="角色顺序"
          rules={[
            {
              required: true,
              message: '请填写角色顺序',
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[
            {
              required: true,
              message: '请选择状态',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="0">正常</Radio>
            <Radio value="1">停用</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="menuIds"
          label="菜单权限"
          rules={[
            {
              required: true,
              message: '请选择菜单权限',
            },
          ]}
        >
          {/* <MenuTree /> */}
          {
            treeLoading ? <Spin /> : (
              <MyTree
                height={300}
                checkable
                treeData={treeData}
              />
            )
          }
        </Form.Item>

        <Form.Item name="type" label="物料类型">
          <Checkbox.Group options={typeOptions} />
        </Form.Item>

        <Form.Item name="remark" label="备注">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </ZxModal>
  );
};

export default (props) => <RegistrationForm {...props} />;
