/* eslint-disable */
import { request } from '@umijs/max';

/** 用户登录 POST /api/auth/login */
export async function login(
  body: { phone: string; password: string },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseUserSession>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户登出 POST /api/auth/logout */
export async function logout(
  params?: {
    sessionId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseVoid>('/api/auth/logout', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户注册 POST /api/auth/register */
export async function register(
  body: API.RegisterRequest,
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseMapStringObject>(
    '/api/auth/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

