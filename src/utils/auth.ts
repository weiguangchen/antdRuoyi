import Cookies from 'js-cookie';

const TokenKey = `antd-${process.env.NODE_ENV === 'development' ? 'dev' : 'prod'}-Token`;

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
