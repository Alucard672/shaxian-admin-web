import { defineConfig } from '@umijs/max';
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  proxy: {
    '/api': {
      target: 'http://120.27.148.45:8082',
      changeOrigin: true,
    },
  },
  layout: {
    title: '纱线ERP管理系统',
  },
  // 在 HTML head 中添加内联脚本以抑制警告
  headScripts: [
    {
      content: `
        (function() {
          if (typeof window !== 'undefined') {
            const originalError = console.error;
            const originalWarn = console.warn;
            console.error = function(...args) {
              if (typeof args[0] === 'string' && (args[0].includes('findDOMNode is deprecated') || args[0].includes('Warning: findDOMNode'))) {
                return;
              }
              originalError.apply(console, args);
            };
            console.warn = function(...args) {
              if (typeof args[0] === 'string' && (args[0].includes('findDOMNode is deprecated') || args[0].includes('Warning: findDOMNode'))) {
                return;
              }
              originalWarn.apply(console, args);
            };
          }
        })();
      `,
    },
  ],
  routes: [
    {
      path: '/login',
      component: './Login',
      layout: false,
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      wrappers: ['@/wrappers/auth'],
    },
    {
      name: '客户管理',
      path: '/tenant',
      component: './Tenant',
      wrappers: ['@/wrappers/auth'],
    },
    {
      name: '员工管理',
      path: '/employee',
      component: './Employee',
      wrappers: ['@/wrappers/auth'],
    },
    {
      name: '商品管理',
      path: '/product',
      component: './Product',
      wrappers: ['@/wrappers/auth'],
    },
    {
      name: '销售管理',
      path: '/sales',
      component: './Sales',
      wrappers: ['@/wrappers/auth'],
    },
  ],
  npmClient: 'pnpm',
});
