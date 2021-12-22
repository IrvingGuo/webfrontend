// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/login',
      layout: false,
      name: 'login',
      component: './Login',
      hideInMenu: true,
    },
    {
      path: '/resource',
      name: 'resource',
      icon: 'file-excel',
      access: 'canRes',
      routes: [
        {
          path: '/resource',
          redirect: '/resource/plan',
        },
        {
          path: '/resource/plan',
          name: 'plan',
          component: './resource/plan',
          routes: [
            {
              path: '/resource/plan',
              redirect: '/resource/plan/assignment',
            },
            {
              name: 'assignment',
              path: '/resource/plan/assignment',
              component: './resource/plan/assignment-list',
              hideInMenu: true,
            },
            {
              name: 'user',
              path: '/resource/plan/user-overview',
              component: './resource/plan/overview/user',
              hideInMenu: true,
            },
            {
              name: 'program',
              path: '/resource/plan/program-overview',
              component: './resource/plan/overview/program',
              hideInMenu: true,
            },
            {
              name: 'total',
              path: '/resource/plan/total-overview',
              component: './resource/plan/overview/total',
              hideInMenu: true,
            },
          ],
        },
        {
          name: 'subor',
          path: '/resource/subor',
          component: './resource/subor',
        },
      ],
    },
    {
      path: '/tpm',
      name: 'tpm',
      icon: 'file-excel',
      access: 'canTpm',
      routes: [
        {
          path: '/tpm',
          redirect: '/tpm/approval',
        },
        {
          name: 'approval',
          icon: 'smile',
          path: '/tpm/approval',
          component: './tpm/approval',
        },
        {
          name: 'program',
          icon: 'smile',
          path: '/tpm/program',
          component: './tpm/program',
        },
      ],
    },
    {
      path: '/manager',
      name: 'manager',
      icon: 'form',
      access: 'canManager',
      routes: [
        {
          path: '/manager',
          redirect: '/manager/user',
        },
        {
          name: 'department',
          icon: 'smile',
          path: '/manager/department',
          component: './manager/department',
        },
        {
          name: 'user',
          icon: 'smile',
          path: '/manager/user',
          component: './manager/user',
        },
        {
          name: 'program',
          icon: 'smile',
          path: '/manager/program',
          component: './manager/program',
          routes: [
            {
              path: '/manager/program',
              redirect: '/manager/program/program',
            },
            {
              name: 'program',
              path: '/manager/program/program',
              component: './manager/program/program',
              hideInMenu: true,
            },
            {
              name: 'subprogram',
              path: '/manager/program/subprogram',
              component: './manager/program/subprogram',
              hideInMenu: true,
            },
            {
              name: 'activity',
              path: '/manager/program/activity',
              component: './manager/program/activity',
              hideInMenu: true,
            },
          ],
        },
      ],
    },
    {
      path: '/welcome',
      component: 'Welcome',
      hideInMenu: true,
    },
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: {
    '/api': {
      target: 'http://localhost:5001/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  // mfsu: {},
  webpack5: {},
  exportStatic: {},
});
