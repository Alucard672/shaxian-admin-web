import { Modal } from 'antd';
import React from 'react';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-components';

interface CreateProductFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateProductRequest) => Promise<boolean>;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  modalVisible,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      destroyOnHidden
      title="新建SAAS产品"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateProductRequest>
        grid={true}
        onFinish={async (values) => {
          await onSubmit(values);
        }}
        initialValues={{
          type: 'STANDARD',
          unit: '年',
          defaultPortCount: 1,
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
          placeholder="例如：纱线ERP核心模块"
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
          placeholder="例如：ERP-CORE"
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
          placeholder="包含用户数"
        />
        <ProFormDigit
          name="price"
          label="默认单价"
          colProps={{ xs: 24, sm: 12 }}
          min={0}
          fieldProps={{ prefix: '¥' }}
          placeholder="建议售价"
        />
        <ProFormText
          name="unit"
          label="计费单位"
          colProps={{ xs: 24, sm: 12 }}
          placeholder="年、月"
        />
        <ProFormTextArea
          name="description"
          label="产品描述"
          colProps={{ span: 24 }}
          placeholder="请输入产品功能详情介绍"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateProductForm;
