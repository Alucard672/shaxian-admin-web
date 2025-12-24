/* eslint-disable */
import { request } from '@umijs/max';

/** 获取所有客户 GET /api/contacts/customers */
export async function getAllCustomers(
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseListCustomer>(
    '/api/contacts/customers',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

