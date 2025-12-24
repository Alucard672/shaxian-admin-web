/* eslint-disable */
import { request } from '@umijs/max';

/** 创建租户 POST /api/tenants */
export async function createTenant(
  body: API.CreateTenantRequest,
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseTenant>('/api/tenants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户租户列表 GET /api/auth/user-tenants */
export async function getUserTenants(
  params?: {
    sessionId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseListUserTenant>(
    '/api/auth/user-tenants',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

/** 切换租户 POST /api/auth/switch-tenant */
export async function switchTenant(
  body: { tenantId: number },
  params?: {
    sessionId?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseMapStringObject>(
    '/api/auth/switch-tenant',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        ...params,
      },
      data: body,
      ...(options || {}),
    },
  );
}

