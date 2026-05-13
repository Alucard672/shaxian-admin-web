import { renewAdminTenant } from '@/services/admin';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Form, message, Space } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface Props {
  modalVisible: boolean;
  tenant: API.TenantDetailVO;
  packageYearlyPrice?: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const RenewModalForm: React.FC<Props> = ({
  modalVisible,
  tenant,
  packageYearlyPrice,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  const fillOneYear = () => {
    const base = tenant.expiresAt ? dayjs(tenant.expiresAt) : dayjs();
    form.setFieldsValue({
      amount: packageYearlyPrice ?? 0,
      newExpiresAt: base.add(1, 'year').format('YYYY-MM-DD'),
    });
  };

  return (
    <ModalForm
      title="续费"
      form={form}
      open={modalVisible}
      modalProps={{ destroyOnClose: true, onCancel }}
      onFinish={async (values: any) => {
        try {
          const newExpires = dayjs(values.newExpiresAt);
          if (
            tenant.expiresAt &&
            !newExpires.isAfter(dayjs(tenant.expiresAt))
          ) {
            message.error('延至日期必须晚于当前到期日');
            return false;
          }
          const res = await renewAdminTenant(tenant.id, {
            amount: Number(values.amount),
            newExpiresAt: newExpires.format('YYYY-MM-DD'),
            note: values.note,
          });
          if (res.success) {
            message.success('续费成功');
            onSuccess();
            return true;
          }
          message.error(res.message || '续费失败');
          return false;
        } catch (e: any) {
          message.error(e?.message || '续费失败');
          return false;
        }
      }}
    >
      <Space style={{ marginBottom: 12 }}>
        <Button type="dashed" onClick={fillOneYear}>
          延 1 年（¥{packageYearlyPrice ?? '-'}）
        </Button>
      </Space>
      <ProFormDigit
        name="amount"
        label="金额（元）"
        min={0}
        fieldProps={{ precision: 2 }}
        rules={[{ required: true, message: '请输入金额' }]}
      />
      <ProFormDatePicker
        name="newExpiresAt"
        label="延至日期"
        rules={[{ required: true, message: '请选择延至日期' }]}
      />
      <ProFormTextArea
        name="note"
        label="备注"
        placeholder="可选，例如：年费 / 赠送"
      />
    </ModalForm>
  );
};

export default RenewModalForm;
