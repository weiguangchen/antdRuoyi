import { request } from 'umi'
import { praseStrEmpty } from '@/utils';
import type { TableListParams } from './data.d';

// 查询用户列表
export async function listUser(params: TableListParams) {
  return request('/system/user/list', {
    method: 'GET',
    params,
  });
}

// 查询用户详细
export function getUser(userId: number | string) {
  return request(`/system/user/${  praseStrEmpty(userId as string)}`, {
    method: 'GET',
  });
}

// 新增用户
export function addUser(data: TableListParams) {
  return request('/system/user', {
    method: 'POST',
    data,
  });
}

// 修改用户
export function updateUser(data: TableListParams) {
  return request('/system/user', {
    method: 'PUT',
    data,
  });
}

// 删除用户
export async function delUser(userId: number | number[]) {
  return request(`/system/user/${  userId}`, {
    method: 'DELETE',
  });
}

// 用户密码重置
export function resetUserPwd(userId: number, password: string) {
  const data = {
    userId,
    password,
  };
  return request('/system/user/resetPwd', {
    method: 'PUT',
    data,
  });
}

// 用户状态修改
export async function changeUserStatus(userId: number, status: string) {
  const data = {
    userId,
    status,
  };
  return request('/system/user/changeStatus', {
    method: 'PUT',
    data,
  });
}
