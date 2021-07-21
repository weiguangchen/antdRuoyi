import { Effect, Reducer } from 'umi';

import { BasicGood } from './data.d';
import { getServer } from './service';

export interface StateType {
  cpu: any;
  jvm: any;
  mem: any;
  sys: any;
  sysFiles: Array<any>;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchSys: Effect;
  };
  reducers: {
    show: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'monitorAndServer',

  state: {
    // basicGoods: [],
    cpu: {},
    jvm: {},
    mem: {},
    sys: {},
    sysFiles: [],
  },

  effects: {
    *fetchSys(_, { call, put }) {
      try {
        const response = yield call(getServer);
        yield put({
          type: 'show',
          payload: response.data,
        });
      } catch (err) {}
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
