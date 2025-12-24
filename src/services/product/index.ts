/* eslint-disable */
import { request } from '@umijs/max';

/** 获取所有商品 GET /api/products */
export async function getAllProducts(
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseListProduct>(
    '/api/products',
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/** 创建商品 POST /api/products */
export async function createProduct(
  body: API.CreateProductRequest,
  options?: { [key: string]: any },
) {
  return request<API.ApiResponseProduct>('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取商品详情 GET /api/products/{id} */
export async function getProduct(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id } = params;
  return request<API.ApiResponseProduct>(
    `/api/products/${id}`,
    {
      method: 'GET',
      params: { ...params },
      ...(options || {}),
    },
  );
}

/** 更新商品 PUT /api/products/{id} */
export async function updateProduct(
  params: {
    id: number;
  },
  body: API.UpdateProductRequest,
  options?: { [key: string]: any },
) {
  const { id } = params;
  return request<API.ApiResponseProduct>(
    `/api/products/${id}`,
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

/** 删除商品 DELETE /api/products/{id} */
export async function deleteProduct(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id } = params;
  return request<API.ApiResponseVoid>(`/api/products/${id}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

// 以下为原纱线业务相关接口，SAAS产品业务暂不使用
/*
export async function getProductColors(...)
export async function createColor(...)
export async function getColorBatches(...)
export async function createBatch(...)
*/
