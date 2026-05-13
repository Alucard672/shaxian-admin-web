// 运行时配置

import { history, RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { App, message } from 'antd';
import React from 'react';

// 限制 toast 最多同时显示 1 个，避免 401 风暴
message.config({ maxCount: 1 });

// 401 全局去重：同一时间窗口内只触发一次跳转 + 提示
let unauthorizedHandled = false;
function handleUnauthorized() {
  if (unauthorizedHandled) return;
  unauthorizedHandled = true;
  localStorage.removeItem('sessionId');
  localStorage.removeItem('userInfo');
  if (history.location.pathname !== '/login') {
    message.error('登录过期，请重新登录');
    history.push('/login');
  }
  // 1.5 秒后重置，允许后续真正的用户操作再触发
  setTimeout(() => {
    unauthorizedHandled = false;
  }, 1500);
}

// 全局初始化数据配置
export async function getInitialState(): Promise<{
  currentUser?: API.UserSession;
  isLogin?: boolean;
}> {
  const sessionId = localStorage.getItem('sessionId');
  const userInfoStr = localStorage.getItem('userInfo');

  if (sessionId && userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      if (!userInfo?.superAdmin) {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userInfo');
        return { isLogin: false };
      }
      return {
        currentUser: userInfo,
        isLogin: true,
      };
    } catch (e) {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userInfo');
    }
  }

  return { isLogin: false };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    title: '纱线ERP管理系统',
    menu: {
      locale: false,
    },
    avatarProps: false,
    actionsRender: () => {
      const currentUser = initialState?.currentUser;
      const actions: React.ReactNode[] = [];
      if (currentUser) {
        actions.push(
          <span key="username" style={{ marginRight: 16 }}>
            {currentUser.username || currentUser.phone}
          </span>,
        );
      }
      actions.push(
        <a
          key="logout"
          onClick={() => {
            localStorage.removeItem('sessionId');
            localStorage.removeItem('userInfo');
            message.success('已退出登录');
            history.push('/home');
            window.location.reload();
          }}
        >
          退出登录
        </a>,
      );
      return actions;
    },
    childrenRender: (children: any) => {
      return <App>{children}</App>;
    },
  };
};

// 请求配置
export const request: RequestConfig = {
  timeout: 10000,
  requestInterceptors: [
    (config: any) => {
      const sessionId = localStorage.getItem('sessionId') || 'dev-session';
      if (config.url && !config.url.includes('/login')) {
        if (config.method?.toUpperCase() === 'GET') {
          config.params = { ...config.params, sessionId };
        }
        config.headers = { ...config.headers, 'X-Session-Id': sessionId };
      }
      return config;
    },
  ],
  responseInterceptors: [
    [
      (response: any) => response,
      (error: any) => {
        const status = error.response?.status;
        if (status === 401) {
          handleUnauthorized();
        } else if (status === 403) {
          // 403 一般是 admin 域无权访问；不跳登录，只提示
          message.error(error.response?.data?.message || '无权访问');
        } else if (status) {
          message.error(error.response?.data?.message || '请求失败');
        }
        // status 为 undefined 时（如网络错误）也不弹太多
        return Promise.reject(error);
      },
    ],
  ],
};
