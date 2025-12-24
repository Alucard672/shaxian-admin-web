
import { Request, Response } from 'express';

// 本地内存存储，模拟数据库
let products = [
  { id: 1, name: '标准版 ERP', code: 'ERP-STD', type: 'STANDARD', price: 1999, unit: '年', defaultPortCount: 5, description: '适合小型加工厂' },
  { id: 2, name: '专业版 ERP', code: 'ERP-PRO', type: 'PREMIUM', price: 4999, unit: '年', defaultPortCount: 20, description: '包含高级排程功能' }
];

let customers = [
  { id: 1, name: '演示客户 A', code: 'TENANT-001', status: 'ACTIVE', address: '上海市徐汇区' },
  { id: 2, name: '演示客户 B', code: 'TENANT-002', status: 'ACTIVE', address: '杭州市西湖区' }
];

let sales = [];
let employees = [
  { id: 1, name: '管理员', position: '系统管理', phone: '13000000000', role: 'admin', status: 'active', createdAt: '2023-01-01' }
];

export default {
  // --- 产品接口 ---
  'GET /api/products': (req: Request, res: Response) => {
    res.send({ success: true, data: products });
  },
  'POST /api/products': (req: Request, res: Response) => {
    const newItem = { ...req.body, id: Date.now(), createdAt: new Date().toISOString() };
    products.unshift(newItem);
    res.send({ success: true, data: newItem });
  },
  'PUT /api/products/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    products = products.map(item => item.id === Number(id) ? { ...item, ...req.body } : item);
    res.send({ success: true });
  },
  'DELETE /api/products/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    products = products.filter(item => item.id !== Number(id));
    res.send({ success: true });
  },

  // --- 销售接口 ---
  'GET /api/sales': (req: Request, res: Response) => {
    res.send({ success: true, data: sales });
  },
  'POST /api/sales': (req: Request, res: Response) => {
    const newItem = { ...req.body, id: Date.now(), orderNumber: 'SO' + Date.now(), createdAt: new Date().toISOString() };
    sales.unshift(newItem);
    res.send({ success: true, data: newItem });
  },

  // --- 客户/租户接口 ---
  'GET /api/auth/user-tenants': (req: Request, res: Response) => {
    res.send({ 
      success: true, 
      data: customers.map(c => ({
        tenantId: c.id,
        userId: 1,
        relationshipType: 'OWNER',
        tenant: c
      }))
    });
  },
  'GET /api/contacts/customers': (req: Request, res: Response) => {
    res.send({ success: true, data: customers });
  },
  'POST /api/tenants': (req: Request, res: Response) => {
    const newItem = { ...req.body, id: Date.now(), status: 'ACTIVE' };
    customers.unshift(newItem);
    res.send({ success: true, data: newItem });
  },

  // --- 员工接口 ---
  'GET /api/employees': (req: Request, res: Response) => {
    res.send({ success: true, data: employees });
  },
  'POST /api/employees': (req: Request, res: Response) => {
    const newItem = { ...req.body, id: Date.now(), createdAt: new Date().toISOString() };
    employees.unshift(newItem);
    res.send({ success: true, data: newItem });
  },
  'PUT /api/employees/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    employees = employees.map(item => item.id === Number(id) ? { ...item, ...req.body } : item);
    res.send({ success: true });
  },
};

