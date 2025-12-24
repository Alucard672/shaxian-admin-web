declare namespace API {
  type Customer = {
    id?: number;
    tenantId?: number;
    name?: string;
    code?: string;
    contactPerson?: string;
    phone?: string;
    address?: string;
    type?: 'DIRECT' | 'DEALER';
    creditLimit?: number;
    status?: 'NORMAL' | 'FROZEN';
    remark?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type ApiResponseListCustomer = {
    success?: boolean;
    message?: string;
    data?: Customer[];
  };
}

