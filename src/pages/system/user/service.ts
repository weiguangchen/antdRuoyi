import request from '@/utils/request';
import { praseStrEmpty } from '@/utils';
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

// 查询用户列表
export async function listUser(params: TableListParams) {
  return request('/system/user/list', {
    method: 'GET',
    params,
  });
}

// 查询用户详细
export function getUser(userId: number) {
  return request('/system/user/' + praseStrEmpty(userId), {
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
  return request('/system/user/' + userId, {
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
