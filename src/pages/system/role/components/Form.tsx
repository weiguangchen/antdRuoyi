import './index.scss';
import React, { useMemo, useRef, useEffect } from 'react';
import { useRequest } from 'umi';
import type {
  FormInstance
} from 'antd';
import {
  Form,
  Input,
  Radio,
  InputNumber,
  message,
  Spin,
} from 'antd';
import { listMenu } from '../../Menu/service';
import { addRole, getDateByRoleId, updateRole } from '../service';
import { handleTree } from '@/utils';
import MyTree from '@/components/Tree';
import type { ZxModalFormProps } from '@/components/Modal/ZxModalForm';
import ZxModalForm from '@/components/Modal/ZxModalForm';

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


interface RoleModalFormProps extends ZxModalFormProps {
  data: any
}

const RoleModalForm: React.FC<RoleModalFormProps> = (props) => {
  const { visible, data, done } = props;
  const formRef = useRef<FormInstance>();

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

  useEffect(() => {
    if (visible) {
      formRef?.current?.setFieldsValue({
        roleName: data?.roleName ?? undefined,
        roleKey: data?.roleKey ?? undefined,
        roleSort: data?.roleSort ?? 1,
        status: data?.status ?? '0',
        menuIds: data?.menuIds ?? [],
        remark: data?.remark ?? undefined,
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
        const { menuIds } = values;
        const menuList = menuIds.map(m => {
          const obj: any = {};
          obj.menuName = treedataMap[m];
          obj.menuId = m;
          return obj
        })

        if (data.roleId) {
          return updateRole({
            roleId: data.roleId,
            menuList,
            ...values,
          }).then(() => {
            message.success('岗位修改成功！');
            done?.()
            return true
          }).catch(() => {
            message.error('岗位修改失败！');
            return false;
          })
        } 
          return addRole({
            menuList,
            ...values,
          }).then(() => {
            message.success('岗位添加成功！');
            done?.();
            return true;
          }).catch(() => {
            message.error('岗位添加失败！');
            return false;
          })
        
      }}
      {...props}
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
        <InputNumber min={1} />
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

      <Form.Item name="remark" label="备注">
        <TextArea rows={4} />
      </Form.Item>
    </ZxModalForm>
  )
}

export default RoleModalForm;