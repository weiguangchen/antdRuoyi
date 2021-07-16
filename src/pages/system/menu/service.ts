import { request } from 'umi'
import type { TableListParams } from './data.d';

export async function queryRule(params?: TableListParams) {
  return request('/system/menu/list', {
    method: 'get',
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

export async function listMenu(params?: TableListParams) {
  return request('/system/menu/list', {
    method: 'GET',
    params,
  });
}

// 新增菜单
export async function addMenu(data: TableListParams) {
  return request('/system/menu', {
    method: 'POST',
    data,
  });
}

// 修改菜单
export function updateMenu(data: TableListParams) {
  return request('/system/menu', {
    method: 'PUT',
    data,
  });
}

// 删除菜单
export async function delMenu(menuId: number | number[]) {
  return request(`/system/menu/${  menuId}`, {
    method: 'DELETE',
  });
}

// export async function delMenu(data) {
//   return request('/system/menu/remove', {
//     method: 'DELETE',
//     data
//   });
// }

// 根据角色ID查询菜单下拉树结构（回显）
export async function roleMenuTreeselect(roleId: number) {
  return request(`/system/menu/roleMenuTreeselect/${  roleId}`, {
    method: 'GET',
  });
}
