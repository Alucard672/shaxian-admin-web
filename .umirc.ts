import { defineConfig } from '@umijs/max';
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  esbuildMinifyIIFE: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: { '^/api': '/biz/api' },
    },
  },
  layout: {
    title: '纺云 ERP · 管理后台',
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
      name: '租户管理',
      path: '/tenant',
      component: './Tenant',
      wrappers: ['@/wrappers/auth'],
    },
    {
      path: '/tenant/:id',
      component: './Tenant/Detail',
      wrappers: ['@/wrappers/auth'],
    },
    {
      name: '套餐管理',
      path: '/package',
      component: './Package',
      wrappers: ['@/wrappers/auth'],
    },
  ],
  npmClient: 'pnpm',
});
