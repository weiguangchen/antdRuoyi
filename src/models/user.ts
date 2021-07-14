import type { Effect, Reducer } from 'umi';

import { queryCurrent, query as queryUsers, getInfo } from '@/services/user';

export type CurrentUser = {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
};

export type UserModelState = {
  token?: string;
  currentUser?: CurrentUser;
  roles?: Array<string>;
  permissions?: Array<string>;
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    // getInfo: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    setToken: Reducer<UserModelState>;
    setRoles: Reducer<UserModelState>;
    setPermissions: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    token: undefined,
    roles: [],
    permissions: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // *fetchCurrent(_, { call, put }) {
    //   const response = yield call(queryCurrent);
    //   yield put({
    //     type: 'saveCurrentUser',
    //     payload: response,
    //   });
    // },
    *fetchCurrent(_, { call, put }) {
      try {
        const response = yield call(getInfo);
        const { user, roles, permissions } = response;
        yield put({
          type: 'saveCurrentUser',
          payload: {
            ...user,
            name: user.nickName,
            avatar: user.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
          },
        });
        yield put({
          type: 'setRoles',
          payload: roles,
        });
        yield put({
          type: 'setPermissions',
          payload: permissions,
        });
      } catch (err) {
        console.log(err);
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
        token: undefined,
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    setToken(state, action) {
      return {
        ...state,
        token: action.payload || undefined,
      };
    },
    setRoles(state, action) {
      return {
        ...state,
        roles: action.payload || [],
      };
    },
    setPermissions(state, action) {
      return {
        ...state,
        permissions: action.payload || [],
      };
    },
  },
};

export default UserModel;
