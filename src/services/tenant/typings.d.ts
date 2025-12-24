declare namespace API {
  type CreateTenantRequest = {
    name: string;
    address: string;
  };

  type Tenant = {
    id?: number;
    name?: string;
    code?: string;
    address?: string;
    expiresAt?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    createdAt?: string;
    updatedAt?: string;
  };

  type ApiResponseTenant = {
    success?: boolean;
    message?: string;
    data?: Tenant;
  };

  type UserTenant = {
    id?: number;
    userId?: number;
    tenantId?: number;
    isDefault?: boolean;
    relationshipType?: 'OWNER' | 'MEMBER';
    user?: User;
    tenant?: Tenant;
    createdAt?: string;
    updatedAt?: string;
  };

  type ApiResponseListUserTenant = {
    success?: boolean;
    message?: string;
    data?: UserTenant[];
  };

  type ApiResponseMapStringObject = {
    success?: boolean;
    message?: string;
    data?: Record<string, any>;
  };
}

