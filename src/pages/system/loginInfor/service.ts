import { request } from 'umi'
import type { TableListParams } from './data.d';

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

// 查询登录日志列表
export async function listLoginInfor(params: TableListParams) {
  return request('/monitor/logininfor/list', {
    method: 'GET',
    params,
  });
}

// 删除登录日志
export async function delLogininfor(infoId: number | number[]) {
  return request(`/monitor/logininfor/${  infoId}`, {
    method: 'DELETE',
  });
}

// 清空登录日志
export async function cleanLogininfor() {
  return request('/monitor/logininfor/clean', {
    method: 'DELETE',
  });
}

// 导出登录日志
export async function exportLogininfor(params: TableListParams) {
  return request('/monitor/logininfor/export', {
    method: 'GET',
    params,
  });
}
