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

// 查询在线用户列表
export async function listOnline(params: TableListParams) {
  return request('/monitor/online/list', {
    method: 'GET',
    params,
  });
}

// 强退用户
export async function forceLogout(tokenId: string) {
  return request('/monitor/online/' + tokenId, {
    method: 'DELETE',
  });
}
