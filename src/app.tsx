import { Modal, notification } from "antd";
import { getDvaApp, RequestConfig } from "umi";
import { Context, RequestOptionsInit, ResponseError } from "umi-request";
import { getToken } from "./utils/auth";

let flag = false;
export const request: RequestConfig = {
    // dataField: 'data',
    errorHandler: (error: ResponseError) => {
        throw error;
    },
    // prefix: '/api',
    requestInterceptors: [
        (url: string, options: RequestOptionsInit) => {
            if (getToken()) {
                return {
                    url,
                    options: {
                        ...options,
                        headers: {
                            Authorization: 'Bearer ' + getToken(),
                        },
                    },
                };
            } else {
                return {
                    url,
                    options,
                    headers: {
                    }
                };
            }
        }
    ],
    responseInterceptors: [
        async (response: Response, options: RequestOptionsInit) => {
            const data = await response.clone().json()
            if (flag) return;
            const code = data.code;
            if(code) {
                if (code === 401) {
                    flag = true;
                    Modal.warning({
                        title: '系统提示',
                        content: '您的登录状态已过期，请重新登录',
                        onOk: () => {
                            flag = false;
                            getDvaApp()._store.dispatch({
                                type: 'login/logout',
                            });
                        },
                    });
                } else if (code !== 200) {
                    notification.error({
                        message: `请求错误`,
                        description: data.msg,
                    });
                }
            }
            
            return data;
        }
    ],
    middlewares: [
        async (ctx: Context, next: () => void) => {
            const { req } = ctx;
            const { url, options } = req;

            // 判断是否需要添加前缀，如果是统一添加可通过 prefix、suffix 参数配置
            if (url.indexOf('/api') !== 0) {
                ctx.req.url = `/api${url}`;
            }

            await next();
        }
    ],
    errorConfig: {
        adaptor: (resData) => {
            return {
                ...resData,
                errorMessage: resData.msg
            }
        }
    }
};