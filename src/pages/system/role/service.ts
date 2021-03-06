import { request } from 'umi'
import type { TableListParams } from './data.d';

export async function listRole(params: TableListParams) {
  return request('/system/role/list', {
    method: 'GET',
    params,
  });
}

// 查询角色详细
export async function getRole(roleId: number) {
  return request(`/system/role/${  roleId}`, {
    method: 'GET',
  });
}

// 新增角色
export async function addRole(data: TableListParams) {
  return request('/system/role', {
    method: 'POST',
    data,
  });
}

// 修改角色
export async function updateRole(data: TableListParams) {
  return request('/system/role', {
    method: 'PUT',
    data,
  });
}

// 删除角色
export async function delRole(roleId: number | number[]) {
  return request(`/system/role/${ roleId}`, {
    method: 'DELETE',
  });
}

// 角色状态修改
export async function changeRoleStatus(roleId: number, status: string) {
  const data = {
    roleId,
    status,
  };
  return request('/system/role/changeStatus', {
    method: 'PUT',
    data,
  });
}

// 角色数据权限
export async function dataScope(data: TableListParams) {
  return request('/system/role/dataScope', {
    method: 'PUT',
    data,
  });
}

// 查询物料权限
export async function getDateByRoleId(roleId: any) {
  return request('/material/data/getDateByRoleId', {
    method: 'GET',
    params: {
      roleId,
    },
  });
}
