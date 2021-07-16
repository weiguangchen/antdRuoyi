﻿// export default [
//   {
//     path: '/',
//     component: '../layouts/BlankLayout',
//     routes: [
//       {
//         path: '/user',
//         component: '../layouts/UserLayout',
//         routes: [
//           {
//             name: 'login',
//             path: '/user/login',
//             component: './User/login',
//           },
//         ],
//       },
//       {
//         path: '/',
//         component: '../layouts/SecurityLayout',
//         routes: [
//           {
//             path: '/',
//             component: '../layouts/BasicLayout',
//             authority: ['admin', 'user'],
//             routes: [
//               {
//                 path: '/',
//                 redirect: '/welcome',
//               },
//               {
//                 path: '/welcome',
//                 name: 'welcome',
//                 icon: 'smile',
//                 component: './Welcome',
//               },
//               {
//                 path: '/admin',
//                 name: 'admin',
//                 icon: 'crown',
//                 component: './Admin',
//                 authority: ['admin'],
//                 routes: [
//                   {
//                     path: '/admin/sub-page',
//                     name: 'sub-page',
//                     icon: 'smile',
//                     component: './Welcome',
//                     authority: ['admin'],
//                   },
//                 ],
//               },
//               {
//                 name: 'list.table-list',
//                 icon: 'table',
//                 path: '/list',
//                 component: './TableList',
//               },
//               {
//                 component: './404',
//               },
//             ],
//           },
//           {
//             component: './404',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     component: './404',
//   },
// ];

// export default [
//   {
//     path: '/',
//     component: '../layouts/BlankLayout',
//     routes: [
//       {
//         path: '/user',
//         component: '../layouts/UserLayout',
//         routes: [
//           {
//             path: '/user/login',
//             name: 'login',
//             component: './User/login',
//           },
//           {
//             path: '/user',
//             redirect: '/user/login',
//           },
//           {
//             name: 'register-result',
//             icon: 'smile',
//             path: '/user/register-result',
//             component: './user/register-result',
//           },
//           {
//             name: 'register',
//             icon: 'smile',
//             path: '/user/register',
//             component: './user/register',
//           },
//           {
//             component: '404',
//           },
//         ],
//       },
//       {
//         path: '/',
//         component: '../layouts/BasicLayout',
//         Routes: ['src/pages/Authorized'],
//         authority: ['admin', 'user'],
//         routeKey: 'basic',
//         routes: [
//           {
//             path: '/',
//             redirect: '/dashboard/analysis',
//           },
//           {
//             path: '/dashboard',
//             name: 'dashboard',
//             icon: 'dashboard',
//             routes: [
//               {
//                 path: '/',
//                 redirect: '/dashboard/analysis',
//               },
//               {
//                 name: 'analysis',
//                 icon: 'smile',
//                 path: '/dashboard/analysis',
//                 component: './dashboard/analysis',
//               },
//               {
//                 name: 'monitor',
//                 icon: 'smile',
//                 path: '/dashboard/monitor',
//                 component: './dashboard/monitor',
//               },
//               {
//                 name: 'workplace',
//                 icon: 'smile',
//                 path: '/dashboard/workplace',
//                 component: './dashboard/workplace',
//               },
//             ],
//           },
//           {
//             path: '/form',
//             icon: 'form',
//             name: 'form',
//             routes: [
//               {
//                 path: '/',
//                 redirect: '/form/basic-form',
//               },
//               {
//                 name: 'basic-form',
//                 icon: 'smile',
//                 path: '/form/basic-form',
//                 component: './form/basic-form',
//               },
//               {
//                 name: 'step-form',
//                 icon: 'smile',
//                 path: '/form/step-form',
//                 component: './form/step-form',
//               },
//               {
//                 name: 'advanced-form',
//                 icon: 'smile',
//                 path: '/form/advanced-form',
//                 component: './form/advanced-form',
//               },
//             ],
//           },
//           {
//             path: '/list',
//             icon: 'table',
//             name: 'list',
//             routes: [
//               {
//                 path: '/list/search',
//                 name: 'search-list',
//                 component: './list/search',
//                 routes: [
//                   {
//                     path: '/list/search',
//                     redirect: '/list/search/articles',
//                   },
//                   {
//                     name: 'articles',
//                     icon: 'smile',
//                     path: '/list/search/articles',
//                     component: './list/search/articles',
//                   },
//                   {
//                     name: 'projects',
//                     icon: 'smile',
//                     path: '/list/search/projects',
//                     component: './list/search/projects',
//                   },
//                   {
//                     name: 'applications',
//                     icon: 'smile',
//                     path: '/list/search/applications',
//                     component: './list/search/applications',
//                   },
//                 ],
//               },
//               {
//                 path: '/',
//                 redirect: '/list/table-list',
//               },
//               {
//                 name: 'table-list',
//                 icon: 'smile',
//                 path: '/list/table-list',
//                 component: './list/table-list',
//               },
//               {
//                 name: 'basic-list',
//                 icon: 'smile',
//                 path: '/list/basic-list',
//                 component: './list/basic-list',
//               },
//               {
//                 name: 'card-list',
//                 icon: 'smile',
//                 path: '/list/card-list',
//                 component: './list/card-list',
//               },
//             ],
//           },
//           {
//             path: '/profile',
//             name: 'profile',
//             icon: 'profile',
//             routes: [
//               {
//                 path: '/',
//                 redirect: '/profile/basic',
//               },
//               {
//                 name: 'basic',
//                 icon: 'smile',
//                 path: '/profile/basic',
//                 component: './profile/basic',
//               },
//               {
//                 name: 'advanced',
//                 icon: 'smile',
//                 path: '/profile/advanced',
//                 component: './profile/advanced',
//               },
//             ],
//           },
//           {
//             name: 'result',
//             icon: 'CheckCircleOutlined',
//             path: '/result',
//             routes: [
//               {
//                 path: '/',
//                 redirect: '/result/success',
//               },
//               {
//                 name: 'success',
//                 icon: 'smile',
//                 path: '/result/success',
//                 component: './result/success',
//               },
//               {
//                 name: 'fail',
//                 icon: 'smile',
//                 path: '/result/fail',
//                 component: './result/fail',
//               },
//             ],
//           },
//           {
//             name: 'exception',
//             icon: 'warning',
//             path: '/exception',
//             routes: [
//               {
//                 path: '/',
//                 redirect: '/exception/403',
//               },
//               {
//                 name: '403',
//                 icon: 'smile',
//                 path: '/exception/403',
//                 component: './exception/403',
//               },
//               {
//                 name: '404',
//                 icon: 'smile',
//                 path: '/exception/404',
//                 component: './exception/404',
//               },
//               {
//                 name: '500',
//                 icon: 'smile',
//                 path: '/exception/500',
//                 component: './exception/500',
//               },
//             ],
//           },
//           {
//             name: 'account',
//             icon: 'user',
//             path: '/account',
//             routes: [
//               {
//                 path: '/',
//                 redirect: '/account/center',
//               },
//               {
//                 name: 'center',
//                 icon: 'smile',
//                 path: '/account/center',
//                 component: './account/center',
//               },
//               {
//                 name: 'settings',
//                 icon: 'smile',
//                 path: '/account/settings',
//                 component: './account/settings',
//               },
//             ],
//           },
//           {
//             name: 'editor',
//             icon: 'highlight',
//             path: '/editor',
//             routes: [
//               {
//                 path: '/',
//                 redirect: '/editor/flow',
//               },
//               {
//                 name: 'flow',
//                 icon: 'smile',
//                 path: '/editor/flow',
//                 component: './editor/flow',
//               },
//               {
//                 name: 'mind',
//                 icon: 'smile',
//                 path: '/editor/mind',
//                 component: './editor/mind',
//               },
//               {
//                 name: 'koni',
//                 icon: 'smile',
//                 path: '/editor/koni',
//                 component: './editor/koni',
//               },
//             ],
//           },
//           {
//             component: '404',
//           },
//         ],
//       },
//     ],
//   },
// ];


export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user/login',
        name: 'login',
        component: './User/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routeKey: 'basic',
        routes: [
          {
            path: '/',
            redirect: '/dashboard/analysis',
          },
          {
            path: '/dashboard',
            name: 'dashboard',
            icon: 'dashboard',
            routes: [
              {
                path: '/',
                redirect: '/dashboard/analysis',
              },
              {
                name: 'analysis',
                icon: 'smile',
                path: '/dashboard/analysis',
                component: './dashboard/analysis',
              },
              {
                name: 'monitor',
                icon: 'smile',
                path: '/dashboard/monitor',
                component: './dashboard/monitor',
              },
              {
                name: 'workplace',
                icon: 'smile',
                path: '/dashboard/workplace',
                component: './dashboard/workplace',
              },
            ],
          },
          {
            path: '/form',
            icon: 'form',
            name: 'form',
            routes: [
              {
                path: '/',
                redirect: '/form/basic-form',
              },
              {
                name: 'basic-form',
                icon: 'smile',
                path: '/form/basic-form',
                component: './form/basic-form',
              },
              {
                name: 'step-form',
                icon: 'smile',
                path: '/form/step-form',
                component: './form/step-form',
              },
              {
                name: 'advanced-form',
                icon: 'smile',
                path: '/form/advanced-form',
                component: './form/advanced-form',
              },
            ],
          },
          {
            path: '/list',
            icon: 'table',
            name: 'list',
            routes: [
              {
                path: '/list/search',
                name: 'search-list',
                component: './list/search',
                routes: [
                  {
                    path: '/list/search',
                    redirect: '/list/search/articles',
                  },
                  {
                    name: 'articles',
                    icon: 'smile',
                    path: '/list/search/articles',
                    component: './list/search/articles',
                  },
                  {
                    name: 'projects',
                    icon: 'smile',
                    path: '/list/search/projects',
                    component: './list/search/projects',
                  },
                  {
                    name: 'applications',
                    icon: 'smile',
                    path: '/list/search/applications',
                    component: './list/search/applications',
                  },
                ],
              },
              {
                path: '/',
                redirect: '/list/table-list',
              },
              {
                name: 'table-list',
                icon: 'smile',
                path: '/list/table-list',
                component: './list/table-list',
              },
              {
                name: 'basic-list',
                icon: 'smile',
                path: '/list/basic-list',
                component: './list/basic-list',
              },
              {
                name: 'card-list',
                icon: 'smile',
                path: '/list/card-list',
                component: './list/card-list',
              },
            ],
          },
          {
            path: '/profile',
            name: 'profile',
            icon: 'profile',
            routes: [
              {
                path: '/',
                redirect: '/profile/basic',
              },
              {
                name: 'basic',
                icon: 'smile',
                path: '/profile/basic',
                component: './profile/basic',
              },
              {
                name: 'advanced',
                icon: 'smile',
                path: '/profile/advanced',
                component: './profile/advanced',
              },
            ],
          },
          {
            name: 'result',
            icon: 'CheckCircleOutlined',
            path: '/result',
            routes: [
              {
                path: '/',
                redirect: '/result/success',
              },
              {
                name: 'success',
                icon: 'smile',
                path: '/result/success',
                component: './result/success',
              },
              {
                name: 'fail',
                icon: 'smile',
                path: '/result/fail',
                component: './result/fail',
              },
            ],
          },
          {
            name: 'exception',
            icon: 'warning',
            path: '/exception',
            routes: [
              {
                path: '/',
                redirect: '/exception/403',
              },
              {
                name: '403',
                icon: 'smile',
                path: '/exception/403',
                component: './exception/403',
              },
              {
                name: '404',
                icon: 'smile',
                path: '/exception/404',
                component: './exception/404',
              },
              {
                name: '500',
                icon: 'smile',
                path: '/exception/500',
                component: './exception/500',
              },
            ],
          },
          {
            name: 'account',
            icon: 'user',
            path: '/account',
            routes: [
              {
                path: '/',
                redirect: '/account/center',
              },
              {
                name: 'center',
                icon: 'smile',
                path: '/account/center',
                component: './account/center',
              },
              {
                name: 'settings',
                icon: 'smile',
                path: '/account/settings',
                component: './account/settings',
              },
            ],
          },
          {
            name: 'editor',
            icon: 'highlight',
            path: '/editor',
            routes: [
              {
                path: '/',
                redirect: '/editor/flow',
              },
              {
                name: 'flow',
                icon: 'smile',
                path: '/editor/flow',
                component: './editor/flow',
              },
              {
                name: 'mind',
                icon: 'smile',
                path: '/editor/mind',
                component: './editor/mind',
              },
              {
                name: 'koni',
                icon: 'smile',
                path: '/editor/koni',
                component: './editor/koni',
              },
            ],
          },
          {
            component: '404',
          },
        ],
      },
    ],
  },
];