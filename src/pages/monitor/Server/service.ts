import request from '@/utils/request';

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

// 查询服务器详细
export async function getServer() {
  return request('/monitor/server', {
    method: 'GET',
  });
}
