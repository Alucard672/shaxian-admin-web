import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  ProForm,
  ProFormSelect,
  ProFormDatePicker,
  ProFormText,
  ProFormTextArea,
  ProFormList,
  ProFormDigit,
} from '@ant-design/pro-components';
import { getAllProducts } from '@/services/product';
import { getAllCustomers } from '@/services/customer';

interface CreateSalesOrderFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateSalesOrderRequest) => Promise<boolean>;
}

const CreateSalesOrderForm: React.FC<CreateSalesOrderFormProps> = ({
  modalVisible,
  onCancel,
  onSubmit,
}) => {
  const [products, setProducts] = useState<API.Product[]>([]);
  const [customers, setCustomers] = useState<API.Customer[]>([]);
  const [form] = ProForm.useForm();

  useEffect(() => {
    if (modalVisible) {
      // 加载产品列表
      getAllProducts().then((res) => {
        if (res.success && res.data) {
          setProducts(res.data);
        }
      });
      // 加载客户列表
      getAllCustomers().then((res) => {
        if (res.success && res.data) {
          setCustomers(res.data);
        }
      });
      form.resetFields();
    }
  }, [modalVisible, form]);

  return (
    <Modal
      destroyOnHidden
      title="销售开单 (产品授权)"
      width={800}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateSalesOrderRequest>
        form={form}
        grid={true}
        onFinish={async (values) => {
          await onSubmit(values);
        }}
        initialValues={{
          salesDate: new Date().toISOString().split('T')[0],
          status: 'APPROVED',
        }}
      >
        <ProFormSelect
          name="customerId"
          label="客户 (租户)"
          colProps={{ span: 24 }}
          rules={[{ required: true, message: '请选择客户' }]}
          options={customers.map((c) => ({
            label: `${c.name} (${c.code})`,
            value: c.id,
          }))}
          fieldProps={{
            onChange: (value) => {
              const customer = customers.find((c) => c.id === value);
              if (customer) {
                form.setFieldsValue({ customerName: customer.name });
              }
            },
          }}
        />
        <ProFormText
          name="customerName"
          label="客户名称"
          hidden
        />

        <ProFormList
          name="items"
          label="销售明细"
          colProps={{ span: 24 }}
          rules={[{ required: true, message: '请至少添加一个产品' }]}
          min={1}
          itemRender={({ listDom, action }) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: 16,
                padding: 16,
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                backgroundColor: '#fafafa',
              }}
            >
              <div style={{ flex: 1 }}>{listDom}</div>
              <div style={{ marginLeft: 16 }}>{action}</div>
            </div>
          )}
        >
          {(f, index) => {
            return (
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <ProFormSelect
                    name="productId"
                    label="选择产品"
                    rules={[{ required: true, message: '请选择产品' }]}
                    options={products.map((p) => ({
                      label: `${p.name} (${p.code})`,
                      value: p.id,
                    }))}
                    fieldProps={{
                      onChange: async (value) => {
                        const product = products.find((p) => p.id === value);
                        if (product) {
                          const currentItems = form.getFieldValue('items') || [];
                          currentItems[index] = {
                            ...currentItems[index],
                            productId: value,
                            productName: product.name,
                          productCode: product.code,
                          unit: product.unit || '年',
                          quantity: product.defaultPortCount || 1, // 默认填入产品的端口数
                          price: product.price || 0, // 默认填入产品的单价
                        };
                          form.setFieldsValue({ items: currentItems });
                        }
                      },
                    }}
                  />
                </div>
                <ProFormText name="productName" hidden />
                <ProFormText name="productCode" hidden />
                
                <div style={{ flex: '1 1 120px' }}>
                  <ProFormDigit
                    name="quantity"
                    label="授权端口"
                    rules={[{ required: true, message: '必填' }]}
                    min={1}
                    initialValue={1}
                  />
                </div>
                
                <div style={{ flex: '1 1 80px' }}>
                  <ProFormText
                    name="unit"
                    label="单位"
                    readonly
                  />
                </div>
                
                <div style={{ flex: '1 1 120px' }}>
                  <ProFormDigit
                    name="price"
                    label="销售单价"
                    rules={[{ required: true, message: '必填' }]}
                    min={0}
                    fieldProps={{ prefix: '¥' }}
                  />
                </div>
              </div>
            );
          }}
        </ProFormList>

        <ProFormDatePicker
          name="salesDate"
          label="销售日期"
          rules={[{ required: true, message: '请选择销售日期' }]}
          colProps={{ xs: 24, sm: 12, md: 8 }}
        />
        <ProFormDatePicker
          name="expectedDate"
          label="有效期至 (预计日期)"
          colProps={{ xs: 24, sm: 12, md: 8 }}
        />
        <ProFormText
          name="operator"
          label="操作员"
          colProps={{ xs: 24, sm: 12, md: 8 }}
        />
        <ProFormTextArea
          name="remark"
          label="备注"
          colProps={{ span: 24 }}
        />
      </ProForm>
    </Modal>
  );
};

export default CreateSalesOrderForm;
