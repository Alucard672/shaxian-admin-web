// 运行时配置

import './suppressWarnings';
import React from 'react';
import { history, RunTimeLayoutConfig } from '@umijs/max';
import { message, App } from 'antd';
import { RequestConfig } from '@umijs/max';

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
      return {
        currentUser: userInfo,
        isLogin: true,
      };
    } catch (e) {
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userInfo');
    }
  }

  // 默认 Mock 用户
  const mockSession = 'dev-session-' + Date.now();
  const mockUser: API.UserSession = {
    sessionId: mockSession,
    userId: 1,
    username: '开发用户',
    phone: '13000000000',
    role: 'admin',
    tenantId: 1,
    tenantName: '开发租户',
    tenantCode: 'DEV',
  };
  localStorage.setItem('sessionId', mockSession);
  localStorage.setItem('userInfo', JSON.stringify(mockUser));
  return {
    currentUser: mockUser,
    isLogin: true,
  };
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
        // 如果是 401 且不是在登录页，则提示并跳转
        if (error.response?.status === 401) {
          const { location } = history;
          if (location.pathname !== '/login') {
            message.error('登录过期，请重新登录');
            history.push('/login');
          }
        } else {
          const errorMessage = error.response?.data?.message || '请求失败';
          message.error(errorMessage);
        }
        return Promise.reject(error);
      },
    ],
  ],
};
