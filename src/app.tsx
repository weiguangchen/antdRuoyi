import { Modal, notification } from "antd";
import type { RequestConfig} from "umi";
import { getDvaApp, UseRequestProvider } from "umi";
import type { Context, RequestOptionsInit, ResponseError } from "umi-request";
import { getToken, removeToken } from "./utils/auth";
import { getInfo, getRouters } from './services/user';
import React from "react";

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
                            Authorization: `Bearer ${  getToken()}`,
                        },
                    },
                };
            } 
                return {
                    url,
                    options,
                    headers: {
                    }
                };
            
        }
    ],
    responseInterceptors: [
        async (response: Response, options: RequestOptionsInit) => {
            const data = await response.clone().json()
            if (flag) return;
            const {code} = data;
            if (code) {
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


export async function getInitialState() {
    if (getToken()) {
        try {
            const { permissions, roles, user } = await getInfo();
            return {
                permissions,
                roles,
                user
            }
        } catch (err) {
            removeToken();
            window.location.reload();
            return undefined;
        }
    } else {
        return undefined;
    }
}


// 获取路由中根节点
const getRootRoute = (routes: any[], routeKey: string) => {
    let r;
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];

        if (route.routeKey == routeKey) {
            r = route;
            break;
        }
        if (route?.routes?.length) {
            const res: any = getRootRoute(route.routes, routeKey);
            if (res) {
                r = res;
                break;
            }
        }
    }

    return r;
}
// 获取component
const getComponent = (routes: any[]) => {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        try {
            route.component = route.component ? require(`@/pages/${route.component}`).default : null;
        } catch (err) {
            console.log('err')
            console.log(err)
            console.log(route)
        }
        if (route?.routes?.length) {
            route.routes = getComponent(route.routes);
        }
    }
    return routes;
}
const constantRoutes: any[] = [
    //   {
    //     path: '/',
    //     redirect: '/dashboardanalysis',
    //     exact: true
    //   },
    //   {
    //     name: '首页',
    //     // icon: 'smile',
    //     path: '/dashboardanalysis',
    //     component: require('@/pages/DashboardAnalysis').default,
    //     // component: 'Dashboardanalysis'
    //   },
    //   {
    //     name: '个人设置',
    //     icon: 'smile',
    //     path: '/accountsettings',
    //     component: require('@/pages/AccountSettings').default,
    //     // component: 'AccountSettings',
    //     hideInMenu: true
    //   },
]
let extraRoutes: any[] = [];
// 动态修改路由
export function patchRoutes({ routes }: { routes: any[] }) {
    // debugger
    // console.log('routes')
    // console.log(routes)
    const root = getRootRoute(routes, 'basic')

    const arr = getComponent(extraRoutes);
    const arr2 = getComponent(constantRoutes)

    // console.log(arr)
    // console.log(constantRoutes)
    // console.log(arr2)

    const {length} = root.routes;
    const preRouters = root.routes.slice(0, length - 1)
    const lastRouter = root.routes.slice(length - 1, length)

    root.routes = [
        ...preRouters,
        ...constantRoutes,
        ...arr,
        ...lastRouter
    ]
    // console.log(routes)
    // console.log('--end--')
}
// 渲染页面
export function render(oldRender: any) {
    // oldRender()
    // 设置默认oldRender();
    window.oldRender = async () => {
        // console.log('触发render');
        if (getToken()) {
            try {
                const { data } = await getRouters();
                // console.log('render')
                // console.log(data)
                extraRoutes = data;
                oldRender();
            } catch (err) {
                removeToken();
                window.location.reload();
                oldRender();
            }
        } else {
            oldRender()
        }
    };
    if (window.oldRender) {
        window.oldRender();
    }
}


/** 修改交给 react-dom 渲染时的根组件 */
export function rootContainer(container: any) {
    const Provider = () => (
      <UseRequestProvider
        value={{
          initialData: [],
          formatResult: (res) => {
            // console.log('root formatResult');
            // console.log(res);
            return res?.data ?? [];
          },
        }}
      >
        {container}
      </UseRequestProvider>
    );
    return React.createElement(Provider, null, container);
  }
  