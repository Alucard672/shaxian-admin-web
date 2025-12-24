declare namespace API {
  type CreateEmployeeRequest = {
    name: string;
    position?: string;
    phone?: string;
    email?: string;
    role?: string;
    password?: string;
    status?: string;
  };

  type UpdateEmployeeRequest = {
    name?: string;
    position?: string;
    phone?: string;
    email?: string;
    role?: string;
    password?: string;
    status?: string;
  };

  type Employee = {
    id?: number;
    name?: string;
    position?: string;
    phone?: string;
    email?: string;
    role?: string;
    password?: string;
    status?: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
  };

  type ApiResponseEmployee = {
    success?: boolean;
    message?: string;
    data?: Employee;
  };

  type ApiResponseListEmployee = {
    success?: boolean;
    message?: string;
    data?: Employee[];
  };

  type ApiResponseVoid = {
    success?: boolean;
    message?: string;
    data?: any;
  };

  type User = {
    id?: number;
    phone?: string;
    name?: string;
    email?: string;
    password?: string;
    employeeId?: number;
    status?: 'ACTIVE' | 'INACTIVE';
    createdAt?: string;
    updatedAt?: string;
  };

  type ApiResponseUser = {
    success?: boolean;
    message?: string;
    data?: User;
  };
}

