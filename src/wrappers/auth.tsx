import { Outlet } from '@umijs/max';
import React from 'react';

// 开发阶段关闭路由级别的登录拦截，直接渲染子路由
export default () => {
  return <Outlet />;
};

