import { Modal } from 'antd';
import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-components';

interface UpdateProductFormProps {
  modalVisible: boolean;
  product?: API.Product;
  onCancel: () => void;
  onSubmit: (values: API.UpdateProductRequest) => Promise<boolean>;
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({
  modalVisible,
  product,
  onCancel,
  onSubmit,
}) => {
  const [form] = ProForm.useForm();

  useEffect(() => {
    if (product && modalVisible) {
        form.setFieldsValue({
        name: product.name,
        code: product.code,
        type: product.type,
        defaultPortCount: product.defaultPortCount,
        price: product.price,
        unit: product.unit,
        description: product.description,
      });
    }
  }, [product, modalVisible, form]);

  return (
    <Modal
      destroyOnHidden
      title="编辑SAAS产品"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.UpdateProductRequest>
        form={form}
        grid={true}
        onFinish={async (values) => {
          await onSubmit(values);
        }}
      >
        <ProFormText
          name="name"
          label="产品名称"
          colProps={{ xs: 24, sm: 12 }}
          rules={[
            {
              required: true,
              message: '请输入产品名称',
            },
          ]}
        />
        <ProFormText
          name="code"
          label="产品编码"
          colProps={{ xs: 24, sm: 12 }}
          rules={[
            {
              required: true,
              message: '请输入产品编码',
            },
          ]}
        />
        <ProFormSelect
          name="type"
          label="产品版本"
          colProps={{ xs: 24, sm: 12 }}
          options={[
            { label: '标准版', value: 'STANDARD' },
            { label: '专业版', value: 'PREMIUM' },
            { label: '企业版', value: 'ENTERPRISE' },
          ]}
        />
        <ProFormDigit
          name="defaultPortCount"
          label="默认端口数"
          colProps={{ xs: 24, sm: 12 }}
          min={1}
        />
        <ProFormDigit
          name="price"
          label="默认销售单价"
          colProps={{ xs: 24, sm: 12 }}
          min={0}
          fieldProps={{ prefix: '¥' }}
        />
        <ProFormText
          name="unit"
          label="计费单位"
          colProps={{ xs: 24, sm: 12 }}
        />
        <ProFormTextArea
          name="description"
          label="产品描述"
          colProps={{ span: 24 }}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateProductForm;
