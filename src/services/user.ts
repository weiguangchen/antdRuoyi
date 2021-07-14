// import request from '@/utils/request';
import { request } from 'umi';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  // return request('/api/currentUser');
  return request('/getInfo', {
    method: 'GET',
  });
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

// 获取用户信息
export async function getInfo(): Promise<any> {
  return request('/getInfo', {
    method: 'GET',
  });
}
