import { Modal } from 'antd';
import React from 'react';
import { ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';

interface CreateEmployeeFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (values: API.CreateEmployeeRequest) => Promise<boolean>;
}

const CreateEmployeeForm: React.FC<CreateEmployeeFormProps> = ({
  modalVisible,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      destroyOnHidden
      title="新建员工"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.CreateEmployeeRequest>
        grid={true}
        onFinish={async (values) => {
          await onSubmit(values);
        }}
        initialValues={{
          status: 'active',
        }}
      >
        <ProFormText
          name="name"
          label="姓名"
          colProps={{ xs: 24, sm: 12 }}
          rules={[
            {
              required: true,
              message: '请输入姓名',
            },
          ]}
          placeholder="请输入姓名"
        />
        <ProFormText
          name="position"
          label="职位"
          colProps={{ xs: 24, sm: 12 }}
          placeholder="请输入职位"
        />
        <ProFormText
          name="phone"
          label="电话"
          colProps={{ xs: 24, sm: 12 }}
          placeholder="请输入电话"
        />
        <ProFormText
          name="email"
          label="邮箱"
          colProps={{ xs: 24, sm: 12 }}
          placeholder="请输入邮箱"
        />
        <ProFormText
          name="role"
          label="角色"
          colProps={{ xs: 24, sm: 12 }}
          placeholder="请输入角色"
        />
        <ProFormSelect
          name="status"
          label="状态"
          colProps={{ xs: 24, sm: 12 }}
          options={[
            { label: '启用', value: 'active' },
            { label: '停用', value: 'inactive' },
          ]}
        />
        <ProFormText.Password
          name="password"
          label="登录密码"
          colProps={{ span: 24 }}
          placeholder="请输入密码（可选）"
        />
      </ProForm>
    </Modal>
  );
};

export default CreateEmployeeForm;

