import { createAdminTenant } from '@/services/admin';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { message } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface Props {
  modalVisible: boolean;
  packages: API.PackageVO[];
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateTenantForm: React.FC<Props> = ({
  modalVisible,
  packages,
  onCancel,
  onSuccess,
}) => {
  const defaultPkgId =
    packages.find((p) => p.name === '标准版')?.id || packages[0]?.id;

  return (
    <ModalForm
      title="新建租户"
      open={modalVisible}
      modalProps={{ destroyOnClose: true, onCancel }}
      initialValues={{
        packageId: defaultPkgId,
        expiresAt: dayjs().add(1, 'year').format('YYYY-MM-DD'),
      }}
      onFinish={async (values: any) => {
        try {
          const body: API.CreateTenantAdminRequest = {
            name: values.name,
            address: values.address,
            packageId: values.packageId,
            expiresAt: dayjs(values.expiresAt)
              .hour(23)
              .minute(59)
              .second(59)
              .format('YYYY-MM-DDTHH:mm:ss'),
          };
          const res = await createAdminTenant(body);
          if (res.success) {
            message.success('创建成功');
            onSuccess();
            return true;
          }
          message.error(res.message || '创建失败');
          return false;
        } catch (e: any) {
          message.error(e?.message || '创建失败');
          return false;
        }
      }}
    >
      <ProFormText
        name="name"
        label="租户名称"
        rules={[{ required: true, message: '请输入租户名称' }]}
      />
      <ProFormTextArea
        name="address"
        label="地址"
        rules={[{ required: true, message: '请输入地址' }]}
      />
      <ProFormSelect
        name="packageId"
        label="套餐"
        options={packages.map((p) => ({
          label: `${p.name}（${p.concurrentLimit} 并发，¥${p.yearlyPrice}/年）`,
          value: p.id,
        }))}
        rules={[{ required: true, message: '请选择套餐' }]}
      />
      <ProFormDatePicker
        name="expiresAt"
        label="初始有效期"
        rules={[{ required: true, message: '请选择初始有效期' }]}
      />
    </ModalForm>
  );
};

export default CreateTenantForm;
