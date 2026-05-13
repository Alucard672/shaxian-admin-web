declare namespace API {
  type TenantStatus = 'ACTIVE' | 'INACTIVE';
  type PackageStatus = 'ACTIVE' | 'INACTIVE';

  type TenantVO = {
    id: number;
    name: string;
    code: string;
    address?: string;
    expiresAt?: string;
    status: TenantStatus;
    packageId?: number;
    packageName?: string;
    packageConcurrentLimit?: number;
    assignedUserId?: number;
    assignedUserName?: string;
    remainingDays?: number;
    createdAt?: string;
    updatedAt?: string;
  };

  type SubscriptionVO = {
    id: number;
    tenantId: number;
    amount: number;
    prevExpiresAt?: string;
    newExpiresAt: string;
    operatorUserId?: number;
    operatorUserName?: string;
    note?: string;
    createdAt: string;
  };

  type ActiveSessionVO = {
    phone: string;
    userName?: string;
    createdAt?: string;
  };

  type TenantDetailVO = TenantVO & {
    subscriptions?: SubscriptionVO[];
    activeSessions?: ActiveSessionVO[];
  };

  type PackageVO = {
    id: number;
    name: string;
    concurrentLimit: number;
    yearlyPrice: number;
    status: PackageStatus;
  };

  type DashboardVO = {
    totalTenants: number;
    activeTenants: number;
    expiringIn30Days?: TenantVO[];
    expired?: TenantVO[];
  };

  type CreateTenantAdminRequest = {
    name: string;
    address?: string;
    expiresAt?: string;
    packageId?: number;
    assignedUserId?: number;
  };

  type UpdateTenantAdminRequest = {
    name?: string;
    address?: string;
    status?: TenantStatus;
    expiresAt?: string;
    packageId?: number;
    assignedUserId?: number;
  };

  type TenantAdminQueryRequest = {
    name?: string;
    code?: string;
    status?: TenantStatus;
    packageId?: number;
    assignedUserId?: number;
    expiringDays?: number;
  };

  type RenewRequest = {
    amount: number;
    newExpiresAt: string;
    note?: string;
  };

  type UpdatePackageRequest = {
    name?: string;
    concurrentLimit?: number;
    yearlyPrice?: number;
    status?: PackageStatus;
  };

  type AdminApiPage<T> = {
    success?: boolean;
    message?: string;
    data?: {
      items: T[];
      total: number;
      pageNo: number;
      pageSize: number;
      totalPages?: number;
    };
  };

  type AdminApi<T> = {
    success?: boolean;
    message?: string;
    data?: T;
  };
}
