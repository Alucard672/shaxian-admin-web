import { listAdminPackages, updateAdminPackage } from '@/services/admin';
import { invalidatePackagesCache } from '@/services/admin/cache';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Form, message, Tag } from 'antd';
import React, { useRef, useState } from 'react';

const PackagePage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [editVisible, setEditVisible] = useState(false);
  const [editing, setEditing] = useState<API.PackageVO | null>(null);
  const [form] = Form.useForm();

  const startEdit = (pkg: API.PackageVO) => {
    setEditing(pkg);
    form.setFieldsValue({
      name: pkg.name,
      concurrentLimit: pkg.concurrentLimit,
      yearlyPrice: pkg.yearlyPrice,
      status: pkg.status,
    });
    setEditVisible(true);
  };

  const columns: ProColumns<API.PackageVO>[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '套餐名', dataIndex: 'name' },
    {
      title: '并发上限',
      dataIndex: 'concurrentLimit',
      render: (v) => `${v} 个并发`,
    },
    { title: '年单价', dataIndex: 'yearlyPrice', render: (v) => `¥${v}` },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, r) => (
        <Tag color={r.status === 'ACTIVE' ? 'green' : 'red'}>
          {r.status === 'ACTIVE' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, r) => <a onClick={() => startEdit(r)}>编辑</a>,
    },
  ];

  return (
    <PageContainer header={{ title: '套餐管理', breadcrumb: {} }}>
      <ProTable<API.PackageVO>
        headerTitle="套餐列表"
        actionRef={actionRef}
        search={false}
        options={false}
        pagination={false}
        rowKey="id"
        columns={columns}
        request={async () => {
          const res = await listAdminPackages();
          if (res.success && res.data) {
            return { data: res.data, success: true, total: res.data.length };
          }
          return { data: [], success: false, total: 0 };
        }}
      />

      <ModalForm
        title={editing ? `编辑套餐：${editing.name}` : '编辑套餐'}
        form={form}
        open={editVisible}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setEditVisible(false);
            setEditing(null);
          },
        }}
        onFinish={async (values: any) => {
          if (!editing) return false;
          try {
            const res = await updateAdminPackage(editing.id, {
              name: values.name,
              concurrentLimit: Number(values.concurrentLimit),
              yearlyPrice: Number(values.yearlyPrice),
              status: values.status,
            });
            if (res.success) {
              invalidatePackagesCache();
              message.success('更新成功');
              setEditVisible(false);
              setEditing(null);
              actionRef.current?.reload();
              return true;
            }
            message.error(res.message || '更新失败');
            return false;
          } catch (e: any) {
            message.error(e?.message || '更新失败');
            return false;
          }
        }}
      >
        <ProFormText
          name="name"
          label="套餐名"
          rules={[{ required: true, message: '请输入套餐名' }]}
        />
        <ProFormDigit
          name="concurrentLimit"
          label="并发上限"
          min={1}
          rules={[{ required: true, message: '请输入并发上限' }]}
          extra="改并发上限对现有 session 不立即生效，下次登录按新上限触发顶号"
        />
        <ProFormDigit
          name="yearlyPrice"
          label="年单价（元）"
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入年单价' }]}
        />
        <ProFormSelect
          name="status"
          label="状态"
          options={[
            { label: '启用', value: 'ACTIVE' },
            { label: '停用', value: 'INACTIVE' },
          ]}
          rules={[{ required: true, message: '请选择状态' }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default PackagePage;
