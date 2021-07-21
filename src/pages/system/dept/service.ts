import { request } from 'umi'
import type { TableListParams } from './data.d';

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
export async function delDept(deptId: number | number[]) {
  return request(`/system/dept/${deptId}`, {
    method: 'DELETE',
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
  return request(`/system/dept/roleDeptTreeselect/${  roleId}`, {
    method: 'GET',
  });
}
