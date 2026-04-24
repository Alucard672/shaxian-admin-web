declare namespace API {
  type SalesOrderQueryRequest = {
    status?: string;
    customerId?: number;
    startDate?: string;
    endDate?: string;
  };

  type CreateSalesOrderRequest = {
    customerId: number;
    customerName: string;
    salesDate: string;
    expectedDate?: string;
    status?: string;
    operator?: string;
    remark?: string;
    items: SalesOrderItemRequest[];
  };

  type UpdateSalesOrderRequest = {
    customerName?: string;
    salesDate?: string;
    expectedDate?: string;
    status?: string;
    operator?: string;
    remark?: string;
    items?: SalesOrderItemRequest[];
  };

  type SalesOrderItemRequest = {
    productId: number;
    productName?: string;
    productCode?: string;
    quantity: number;
    unit?: string;
    price: number;
    remark?: string;
  };

  type SalesOrder = {
    id?: number;
    tenantId?: number;
    orderNumber?: string;
    customerId?: number;
    customerName?: string;
    salesDate?: string;
    expectedDate?: string;
    totalAmount?: number;
    receivedAmount?: number;
    unpaidAmount?: number;
    status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'SHIPPED' | 'CANCELLED';
    operator?: string;
    remark?: string;
    createdAt?: string;
    updatedAt?: string;
    items?: SalesOrderItem[];
  };

  type SalesOrderItem = {
    id?: number;
    tenantId?: number;
    orderId?: number;
    productId?: number;
    productName?: string;
    productCode?: string;
    quantity?: number;
    unit?: string;
    price?: number;
    amount?: number;
    remark?: string;
    createdAt?: string;
  };

  type ApiResponseSalesOrder = {
    success?: boolean;
    message?: string;
    data?: SalesOrder;
  };

  type ApiResponseListSalesOrder = {
    success?: boolean;
    message?: string;
    data?: SalesOrder[];
  };

  type ApiResponseVoid = {
    success?: boolean;
    message?: string;
    data?: any;
  };
}
