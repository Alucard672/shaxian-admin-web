import { Modal } from 'antd';
import React, { useEffect } from 'react';
import { ProForm, ProFormDigit } from '@ant-design/pro-components';

interface AuthorizeEmployeeFormProps {
  modalVisible: boolean;
  employee?: API.Employee;
  onCancel: () => void;
  onSubmit: (values: { tenantId: number }) => Promise<boolean>;
}

const AuthorizeEmployeeForm: React.FC<AuthorizeEmployeeFormProps> = ({
  modalVisible,
  employee,
  onCancel,
  onSubmit,
}) => {
  const [form] = ProForm.useForm();

  useEffect(() => {
    if (modalVisible) {
      form.resetFields();
    }
  }, [modalVisible, form]);

  return (
    <Modal
      destroyOnHidden
      title={`授权员工登录 - ${employee?.name}`}
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<{ tenantId: number }>
        form={form}
        onFinish={async (values) => {
          await onSubmit(values);
        }}
        initialValues={{}}
      >
        <ProFormDigit
          name="tenantId"
          label="租户ID"
          rules={[
            {
              required: true,
              message: '请输入租户ID',
            },
          ]}
          placeholder="请输入要关联的租户ID"
        />
      </ProForm>
    </Modal>
  );
};

export default AuthorizeEmployeeForm;

