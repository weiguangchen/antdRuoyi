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

// 查询操作日志列表
export async function listOperLog(params: TableListParams) {
  return request('/monitor/operlog/list', {
    method: 'GET',
    params,
  });
}

// 删除操作日志
export async function delOperlog(operId: number | number[]) {
  return request(`/monitor/operlog/${  operId}`, {
    method: 'DELETE',
  });
}

// 清空操作日志
export async function cleanOperlog() {
  return request('/monitor/operlog/clean', {
    method: 'DELETE',
  });
}
