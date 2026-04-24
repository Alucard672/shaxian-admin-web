/* eslint-disable */
import { request } from '@umijs/max';

/** 获取销售订单列表 GET /api/sales */
export async function getAllSales(
  params?: {
    pageNo?: number;
    pageSize?: number;
    request?: API.SalesOrderQueryRequest;
  },
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseListSalesOrder>('/api/sales', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建销售订单 POST /api/sales */
export async function createSalesOrder(
  body: API.CreateSalesOrderRequest,
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseSalesOrder>('/api/sales', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取销售订单详情 GET /api/sales/{id} */
export async function getSalesOrder(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id } = params;
  return request<API.ApiResponseSalesOrder>(`/api/sales/${id}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 更新销售订单 PUT /api/sales/{id} */
export async function updateSalesOrder(
  params: {
    id: number;
  },
  body: API.UpdateSalesOrderRequest,
  options?: { [key: string]: any },
) {
  const { id } = params;
  return request<API.ApiResponseSalesOrder>(`/api/sales/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

/** 删除销售订单 DELETE /api/sales/{id} */
export async function deleteSalesOrder(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id } = params;
  return request<API.ApiResponseVoid>(`/api/sales/${id}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
