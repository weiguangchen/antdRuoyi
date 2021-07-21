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

export async function listType(params: TableListParams) {
  return request('/system/dict/type/list', {
    method: 'GET',
    params,
  });
}

// 查询字典类型详细
export function getType(dictId: number) {
  return request(`/system/dict/type/${  dictId}`, {
    method: 'GET',
  });
}

export async function addType(data: TableListParams) {
  return request('/system/dict/type', {
    method: 'POST',
    data,
  });
}

// 更新字典类型
export async function updateType(data: TableListParams) {
  return request('/system/dict/type', {
    method: 'PUT',
    data,
  });
}
// 删除字典类型
export async function delType(dictId: number | number[]) {
  return request(`/system/dict/type/${  dictId}`, {
    method: 'DELETE',
  });
}
// 根据字典类型查询字典数据信息
export async function getDicts(dictType: string) {
  return request(`/system/dict/data/type/${  dictType}`, {
    method: 'GET',
  });
}
