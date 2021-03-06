import type { LoginParamsType } from '@/services/login';
import { Login } from '@/services/login';
import { removeToken, setToken } from '@/utils/auth';
import { getPageQuery } from '@/utils/utils';
import { stringify } from 'querystring';
import { useCallback, useState } from 'react';
import { useModel, history } from 'umi';

export default function useLoginModel() {
  const { refresh } = useModel('@@initialState');
  const [errorText, setErrorText] = useState<string>('');
  const [status, setStatus] = useState<'ok' | 'error'>();
  const [type, setType] = useState<string>('');

  const [loading,setLoading] = useState<boolean>(false)

  const changeLoginStatus = useCallback(
    (payload) => {
      const { status, type, errorText } = payload;
      setType(type);
      setStatus(status);
      setErrorText(errorText);
    },
    [setErrorText, setStatus],
  );

  const login: any = useCallback(
    async (values: LoginParamsType) => {
      setLoading(true)
      try {
        const response = await Login(values);
        changeLoginStatus({
          status: 'ok',
          type: 'account',
          errorText: '',
        });
        setToken(response.token);
        refresh();
        setLoading(false)
        return Promise.resolve(response)
      } catch (e) {
        setLoading(false)
        changeLoginStatus({
          status: 'error',
          type: 'account',
          errorText: e.info.msg || '',
        });
        return Promise.reject(e);
      }
    },
    [refresh],
  );

  const logout: any = useCallback(() => {
    removeToken();
    refresh();
  }, [refresh]);

  return {
    login,
    logout,
    loading
  };
}
