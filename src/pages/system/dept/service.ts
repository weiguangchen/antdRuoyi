import request from '@/utils/request';
import { TableListParams } from './data.d';

export async function queryRule(params?: TableListParams) {
  return request('/api/rule', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

// 查询部门列表
export async function listDept(params: TableListParams) {
  return request('/system/dept/list', {
    method: 'GET',
    params,
  });
}

// 新增部门
export async function addDept(data: TableListParams) {
  return request('/system/dept', {
    method: 'POST',
    data,
  });
}

// 修改部门
export async function updateDept(data: TableListParams) {
  return request('/system/dept', {
    method: 'PUT',
    data,
  });
}

// 删除部门
export async function delDept(data: any) {
  return request('/system/dept/remove', {
    method: 'DELETE',
    data
  });
}

// 查询部门下拉树结构
export async function treeselect() {
  return request('/system/dept/treeselect', {
    method: 'GET',
  });
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId: number) {
  return request('/system/dept/roleDeptTreeselect/' + roleId, {
    method: 'GET',
  });
}
