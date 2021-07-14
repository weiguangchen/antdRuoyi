// import request from '@/utils/request';
import { request } from 'umi';

export type LoginParamsType = {
  username: string;
  password: string;
  code: string;
  uuid: string;
  // mobile: string;
  // captcha: string;
};

export async function Login(params: LoginParamsType) {
  return request('/login', {
    method: 'POST',
    data: params,
  });
}
export async function getCaptchaImage() {
  return request('/captchaImage', {
    method: 'GET',
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
