import { stringify } from 'querystring';
import { Reducer, Effect, useModel } from 'umi';
import { history } from 'umi';

import { Login, LoginParamsType } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { removeToken, setToken } from '@/utils/auth';
import { useCallback, useState } from 'react';

export type StateType = {
  status?: 'ok' | 'error';
  errorText: string;
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
};

export type LoginModelType = {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
};

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
    errorText: ''
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(Login, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        yield put({
          type: 'user/setToken',
          payload: response.token,
        });
        setToken(response.token);
        // yield put({
        //   type: 'user/fetchCurrent',
        // });
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // message.success('🎉 🎉 🎉  登录成功！');
        // let { redirect } = params as { redirect: string };
        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);
        //     if (redirect.match(/^\/.*#/)) {
        //       redirect = redirect.substr(redirect.indexOf('#') + 1);
        //     }
        //   } else {
        //     window.location.href = '/';
        //     return;
        //   }
        // }
        // history.replace(redirect || '/');
        return Promise.resolve(response);
      } catch (e) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error',
            type: 'account',
            errorText: e.info.msg || ''
          },
        });
        return Promise.reject(e);
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // const { refresh } = useModel('@@initialState');
      // Note: There may be security issues, please note
      removeToken()
      // refresh()
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    // changeLoginStatus(state, { payload }) {
    //   setAuthority(payload.currentAuthority);
    //   return {
    //     ...state,
    //     status: payload.status,
    //     type: payload.type,
    //   };
    // },
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        errorText: payload.errorText,
      };
    },
  },
};

export default Model;


