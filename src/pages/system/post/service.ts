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

// 查询岗位列表
export async function listPost(params: TableListParams) {
  return request('/system/post/list', {
    method: 'GET',
    params,
  });
}

// 查询岗位详细
export async function getPost(postId: number) {
  return request('/system/post/' + postId, {
    method: 'GET',
  });
}

// 新增岗位
export async function addPost(data: TableListParams) {
  return request('/system/post', {
    method: 'POST',
    data,
  });
}

// 修改岗位
export async function updatePost(data: TableListParams) {
  return request('/system/post', {
    method: 'PUT',
    data,
  });
}

// 删除岗位
export function delPost(data:any) {
  return request('/system/post/remove', {
    method: 'DELETE',
    data
  });
}
