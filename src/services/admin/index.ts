/* eslint-disable */
import { request } from '@umijs/max';

// ======================== 租户 ========================

export async function queryAdminTenants(
  params: { pageNo: number; pageSize: number },
  body: API.TenantAdminQueryRequest = {},
) {
  return request<API.AdminApiPage<API.TenantVO>>('/api/admin/tenants/query', {
    method: 'POST',
    params,
    data: body,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function createAdminTenant(body: API.CreateTenantAdminRequest) {
  return request<API.AdminApi<API.TenantVO>>('/api/admin/tenants', {
    method: 'POST',
    data: body,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function getAdminTenantDetail(id: number) {
  return request<API.AdminApi<API.TenantDetailVO>>(`/api/admin/tenants/${id}`, {
    method: 'GET',
  });
}

export async function updateAdminTenant(
  id: number,
  body: API.UpdateTenantAdminRequest,
) {
  return request<API.AdminApi<API.TenantVO>>(`/api/admin/tenants/${id}`, {
    method: 'PUT',
    data: body,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function renewAdminTenant(id: number, body: API.RenewRequest) {
  return request<API.AdminApi<API.SubscriptionVO>>(
    `/api/admin/tenants/${id}/renew`,
    {
      method: 'POST',
      data: body,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

// ======================== 套餐 ========================

export async function listAdminPackages() {
  return request<API.AdminApi<API.PackageVO[]>>('/api/admin/packages', {
    method: 'GET',
  });
}

export async function getAdminPackage(id: number) {
  return request<API.AdminApi<API.PackageVO>>(`/api/admin/packages/${id}`, {
    method: 'GET',
  });
}

export async function updateAdminPackage(
  id: number,
  body: API.UpdatePackageRequest,
) {
  return request<API.AdminApi<API.PackageVO>>(`/api/admin/packages/${id}`, {
    method: 'PUT',
    data: body,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ======================== Dashboard ========================

export async function getAdminDashboard() {
  return request<API.AdminApi<API.DashboardVO>>('/api/admin/dashboard', {
    method: 'GET',
  });
}
