import { request } from 'umi'
import type { TableListParams } from './data.d';

// 查询岗位列表
export async function listPost(params: TableListParams) {
  return request('/system/post/list', {
    method: 'GET',
    params,
  });
}

// 查询岗位详细
export async function getPost(postId: number) {
  return request(`/system/post/${  postId}`, {
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
export function delPost(postId: number | number[]) {
  return request(`/system/post/${postId}`, {
    method: 'DELETE',
  });
}
