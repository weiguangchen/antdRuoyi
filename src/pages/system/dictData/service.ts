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

export async function listData(params: TableListParams) {
  return request('/system/dict/data/list', {
    method: 'GET',
    params,
  });
}

// 新增字典数据
export function addData(data: TableListParams) {
  return request('/system/dict/data', {
    method: 'POST',
    data,
  });
}

// 修改字典数据
export function updateData(data: TableListParams) {
  return request('/system/dict/data', {
    method: 'PUT',
    data,
  });
}

// 删除字典数据
export async function delData(dictCode: number | number[]) {
  return request('/system/dict/data/' + dictCode, {
    method: 'DELETE',
  });
}
