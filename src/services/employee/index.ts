/* eslint-disable */
import { request } from '@umijs/max';

/** 获取所有员工 GET /api/employees */
export async function getAllEmployees(
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseListEmployee>(
    '/api/employees',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 创建员工 POST /api/employees */
export async function createEmployee(
  body: API.CreateEmployeeRequest,
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseEmployee>('/api/employees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取员工详情 GET /api/employees/{id} */
export async function getEmployee(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id } = params;
  return request<API.ApiResponseEmployee>(
    `/api/employees/${id}`,
    {
      method: 'GET',
      params: { ...params },
      ...(options || {}),
    },
  );
}

/** 更新员工 PUT /api/employees/{id} */
export async function updateEmployee(
  params: {
    id: number;
  },
  body: API.UpdateEmployeeRequest,
  options?: { [key: string]: any },
) {
  const { id } = params;
  return request<API.ApiResponseEmployee>(
    `/api/employees/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...params },
      data: body,
      ...(options || {}),
    },
  );
}

/** 删除员工 DELETE /api/employees/{id} */
export async function deleteEmployee(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id } = params;
  return request<API.ApiResponseVoid>(`/api/employees/${id}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

/** 授权员工登录 POST /api/employees/{employeeId}/authorize-login */
export async function authorizeEmployeeLogin(
  params: {
    employeeId: number;
  },
  body: { tenantId: number },
  options?: { [key: string]: any },
) {
  const { employeeId } = params;
  return request<API.ApiResponseUser>(
    `/api/employees/${employeeId}/authorize-login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...params },
      data: body,
      ...(options || {}),
    },
  );
}

