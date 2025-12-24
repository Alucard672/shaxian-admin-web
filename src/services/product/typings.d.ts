declare namespace API {
  type CreateProductRequest = {
    name: string;
    code: string;
    specification?: string;
    composition?: string;
    count?: string;
    unit?: string;
    type?: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
    defaultPortCount?: number;
    price?: number;
    isWhiteYarn?: boolean;
    description?: string;
  };

  type UpdateProductRequest = {
    name?: string;
    code?: string;
    specification?: string;
    composition?: string;
    count?: string;
    unit?: string;
    type?: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
    defaultPortCount?: number;
    price?: number;
    isWhiteYarn?: boolean;
    description?: string;
  };

  type Product = {
    id?: number;
    tenantId?: number;
    name?: string;
    code?: string;
    specification?: string;
    composition?: string;
    count?: string;
    unit?: string;
    type?: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
    defaultPortCount?: number;
    price?: number;
    isWhiteYarn?: boolean;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type ApiResponseProduct = {
    success?: boolean;
    message?: string;
    data?: Product;
  };

  type ApiResponseListProduct = {
    success?: boolean;
    message?: string;
    data?: Product[];
  };

  type Color = {
    id?: number;
    tenantId?: number;
    productId?: number;
    code?: string;
    name?: string;
    colorValue?: string;
    description?: string;
    status?: 'ON_SALE' | 'DISCONTINUED';
    createdAt?: string;
    updatedAt?: string;
    product?: Product;
  };

  type ApiResponseListColor = {
    success?: boolean;
    message?: string;
    data?: Color[];
  };

  type Batch = {
    id?: number;
    tenantId?: number;
    colorId?: number;
    code?: string;
    productionDate?: string;
    supplierId?: number;
    supplierName?: string;
    purchasePrice?: number;
    stockQuantity?: number;
    initialQuantity?: number;
    stockLocation?: string;
    remark?: string;
    createdAt?: string;
    updatedAt?: string;
    color?: Color;
  };

  type ApiResponseListBatch = {
    success?: boolean;
    message?: string;
    data?: Batch[];
  };

  type ApiResponseVoid = {
    success?: boolean;
    message?: string;
    data?: any;
  };
}
