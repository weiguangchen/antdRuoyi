import {
  AlipayCircleOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  VerifiedOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Form, Input } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage, useRequest, useModel } from 'umi';
import { getCaptchaImage, getFakeCaptcha } from '@/services/login';
import type { Dispatch } from 'umi';
import type { StateType } from '@/models/login';
import type { LoginParamsType } from '@/services/login';
import type { ConnectState } from '@/models/connect';
import styles from './index.less';
import { getPageQuery } from '@/utils/utils';
export type LoginProps = {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin, submitting } = props;
  const { status, errorText, type: loginType } = userLogin; // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const { initialState, loading } = useModel('@@initialState');
  const { login, logining } = useModel('useLoginModel', (model) => ({
    login: model.login,
    logining: model.loading,
  })); // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [type, setType] = useState<string>('account');
  const intl = useIntl(); // 验证码

  const { data: captchaImage, refresh: refreshCaptchaImage } = useRequest(getCaptchaImage, {
    formatResult: (res) => res,
  });

  const handleSubmit = (values: LoginParamsType) => {
    login(values).catch(() => refreshCaptchaImage());
  };

  if (initialState) {
    const urlParams = new URL(window.location.href);
    let { redirect } = getPageQuery() as {
      redirect: string;
    };

    if (redirect) {
      const redirectUrlParams = new URL(redirect);

      if (redirectUrlParams.origin === urlParams.origin) {
        redirect = redirect.substr(urlParams.origin.length);
        window.location.href = redirect;
      } else {
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: logining,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={(values) => {
          handleSubmit({ ...values, uuid: captchaImage.uuid } as LoginParamsType);
          return Promise.resolve();
        }}
      >
        {/* <Tabs activeKey={type} onChange={setType}>
         <Tabs.TabPane
           key="account"
           tab={intl.formatMessage({
             id: 'pages.login.accountLogin.tab',
             defaultMessage: '账户密码登录',
           })}
         />
         <Tabs.TabPane
           key="mobile"
           tab={intl.formatMessage({
             id: 'pages.login.phoneLogin.tab',
             defaultMessage: '手机号登录',
           })}
         />
        </Tabs> */}

        {status === 'error' && loginType === 'account' && !submitting && (
          <LoginMessage content={errorText} />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '用户名: admin or user',
              })}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.password.placeholder',
                defaultMessage: '密码: ant.design',
              })}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
            <Form.Item>
              <Form.Item
                noStyle
                name="code"
                rules={[
                  {
                    required: true,
                    message: '请填写验证码!',
                  },
                ]}
              >
                <Input
                  prefix={<VerifiedOutlined className={styles.prefixIcon} />}
                  style={{
                    width: 200,
                  }}
                  size="large"
                  placeholder="验证码"
                />
              </Form.Item>
              {!captchaImage ? null : (
                <img
                  onClick={refreshCaptchaImage}
                  style={{
                    display: 'inline-block',
                    float: 'right',
                    cursor: 'pointer',
                  }}
                  width={110}
                  height={40}
                  src={`data:image/gif;base64,${captchaImage.img}`}
                />
              )}
            </Form.Item>
          </>
        )}

        {status === 'error' && loginType === 'mobile' && !submitting && (
          <LoginMessage content="验证码错误" />
        )}
        {type === 'mobile' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined className={styles.prefixIcon} />,
              }}
              name="mobile"
              placeholder={intl.formatMessage({
                id: 'pages.login.phoneNumber.placeholder',
                defaultMessage: '手机号',
              })}
              rules={[
                {
                  required: true,
                  message: '手机号是必填项！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '不合法的手机号！',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={styles.prefixIcon} />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.captcha.placeholder',
                defaultMessage: '请输入验证码',
              })}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${intl.formatMessage({
                    id: 'pages.getCaptchaSecondText',
                    defaultMessage: '获取验证码',
                  })}`;
                }

                return intl.formatMessage({
                  id: 'pages.login.phoneLogin.getVerificationCode',
                  defaultMessage: '获取验证码',
                });
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '验证码是必填项！',
                },
              ]}
              onGetCaptcha={async (mobile) => {
                const result = await getFakeCaptcha(mobile);

                if (result === false) {
                  return;
                }

                message.success('获取验证码成功！验证码为：1234');
              }}
            />
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码 ?
          </a>
        </div>
      </ProForm>
      <Space className={styles.other}>
        其他登录方式 :
        <AlipayCircleOutlined className={styles.icon} />
        <TaobaoCircleOutlined className={styles.icon} />
        <WeiboCircleOutlined className={styles.icon} />
      </Space>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
