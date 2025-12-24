import { Modal } from 'antd';
import React from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';

interface CreateTenantFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateTenantRequest) => Promise<boolean>;
}

const CreateTenantForm: React.FC<CreateTenantFormProps> = ({
  modalVisible,
  onCancel,
  onSubmit,
}) => {
  return (
      <Modal
      destroyOnHidden
      title="新建客户"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateTenantRequest>
        grid={true}
        onFinish={async (values) => {
          await onSubmit(values);
        }}
        initialValues={{}}
      >
        <ProFormText
          name="name"
          label="客户名称"
          colProps={{ span: 24 }}
          rules={[
            {
              required: true,
              message: '请输入客户名称',
            },
          ]}
          placeholder="请输入客户名称"
        />
        <ProFormText
          name="address"
          label="客户地址"
          colProps={{ span: 24 }}
          rules={[
            {
              required: true,
              message: '请输入地址',
            },
          ]}
          placeholder="请输入详细地址"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateTenantForm;

