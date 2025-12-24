import { Modal } from 'antd';
import React, { useEffect } from 'react';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-components';

interface UpdateEmployeeFormProps {
  modalVisible: boolean;
  employee?: API.Employee;
  onCancel: () => void;
  onSubmit: (values: API.UpdateEmployeeRequest) => Promise<boolean>;
}

const UpdateEmployeeForm: React.FC<UpdateEmployeeFormProps> = ({
  modalVisible,
  employee,
  onCancel,
  onSubmit,
}) => {
  const [form] = ProForm.useForm();

  useEffect(() => {
    if (employee && modalVisible) {
      form.setFieldsValue({
        name: employee.name,
        position: employee.position,
        phone: employee.phone,
        email: employee.email,
        role: employee.role,
        status: employee.status,
      });
    }
  }, [employee, modalVisible, form]);

  return (
    <Modal
      destroyOnHidden
      title="编辑员工"
      width={600}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProForm<API.UpdateEmployeeRequest>
        form={form}
        grid={true}
        onFinish={async (values) => {
          await onSubmit(values);
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
          label="修改密码"
          colProps={{ span: 24 }}
          placeholder="留空则不修改密码"
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateEmployeeForm;

