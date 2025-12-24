import { Modal } from 'antd';
import React, { useEffect } from 'react';
import { ProForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';

interface AuthorizeTenantFormProps {
  modalVisible: boolean;
  tenant?: API.UserTenant;
  onCancel: () => void;
  onSubmit: (values: { tenantId: number; sessionId?: string }) => Promise<boolean>;
}

const AuthorizeTenantForm: React.FC<AuthorizeTenantFormProps> = ({
  modalVisible,
  tenant,
  onCancel,
  onSubmit,
}) => {
  const [form] = ProForm.useForm();

  useEffect(() => {
    if (tenant && modalVisible) {
      form.setFieldsValue({
        tenantId: tenant.tenantId,
      });
    }
  }, [tenant, modalVisible, form]);

  return (
    <Modal
      destroyOnHidden
      title="授权客户"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<{ tenantId: number; sessionId?: string }>
        form={form}
        onFinish={async (values) => {
          await onSubmit(values);
        }}
        initialValues={{
          tenantId: tenant?.tenantId,
        }}
      >
        <ProFormDigit
          name="tenantId"
          label="客户ID"
          disabled
          rules={[
            {
              required: true,
              message: '客户ID不能为空',
            },
          ]}
        />
        <ProFormText
          name="sessionId"
          label="会话ID"
          placeholder="请输入会话ID（可选）"
        />
      </ProForm>
    </Modal>
  );
};

export default AuthorizeTenantForm;

