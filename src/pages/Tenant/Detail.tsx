import { getAdminTenantDetail, updateAdminTenant } from '@/services/admin';
import { getCachedPackages } from '@/services/admin/cache';
import {
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import RenewModalForm from './components/RenewModalForm';

const TenantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tenantId = Number(id);
  const [detail, setDetail] = useState<API.TenantDetailVO | null>(null);
  const [packages, setPackages] = useState<API.PackageVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [renewVisible, setRenewVisible] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const [res, pkgs] = await Promise.all([
        getAdminTenantDetail(tenantId),
        getCachedPackages(),
      ]);
      if (res.success && res.data) setDetail(res.data);
      setPackages(pkgs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Number.isFinite(tenantId)) reload();
  }, [tenantId]);

  const currentPackage = detail?.packageId
    ? packages.find((p) => p.id === detail.packageId)
    : undefined;

  const toggleStatus = async () => {
    if (!detail) return;
    const next = detail.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await updateAdminTenant(tenantId, { status: next });
      if (res.success) {
        message.success(`已${next === 'ACTIVE' ? '启用' : '停用'}`);
        reload();
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (e: any) {
      message.error(e?.message || '操作失败');
    }
  };

  const subColumns: ProColumns<API.SubscriptionVO>[] = [
    { title: '金额', dataIndex: 'amount', render: (v) => `¥${v}` },
    { title: '上次到期', dataIndex: 'prevExpiresAt', valueType: 'dateTime' },
    { title: '续至', dataIndex: 'newExpiresAt', valueType: 'dateTime' },
    { title: '操作人', dataIndex: 'operatorUserName' },
    { title: '备注', dataIndex: 'note', ellipsis: true },
    { title: '操作时间', dataIndex: 'createdAt', valueType: 'dateTime' },
  ];

  const sessionColumns: ProColumns<API.ActiveSessionVO>[] = [
    { title: '手机号', dataIndex: 'phone' },
    { title: '用户名', dataIndex: 'userName', render: (v) => v || '-' },
    { title: '登录时间', dataIndex: 'createdAt', valueType: 'dateTime' },
  ];

  return (
    <PageContainer
      header={{
        title: detail ? `租户详情：${detail.name}` : '租户详情',
        breadcrumb: {},
        onBack: () => history.push('/tenant'),
      }}
      loading={loading}
      extra={
        detail && (
          <Space>
            <Button type="primary" onClick={() => setRenewVisible(true)}>
              续费
            </Button>
            <Popconfirm
              title={`确定${
                detail.status === 'ACTIVE' ? '停用' : '启用'
              }该租户吗？该租户所有活跃 session 会被立即失效`}
              onConfirm={toggleStatus}
            >
              <Button danger={detail.status === 'ACTIVE'}>
                {detail.status === 'ACTIVE' ? '停用' : '启用'}
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    >
      {detail && (
        <>
          <ProDescriptions
            column={2}
            title="基础信息"
            style={{ marginBottom: 24 }}
          >
            <ProDescriptions.Item label="ID">{detail.id}</ProDescriptions.Item>
            <ProDescriptions.Item label="租户代码">
              {detail.code}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="名称">
              {detail.name}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="状态">
              <Tag color={detail.status === 'ACTIVE' ? 'green' : 'red'}>
                {detail.status === 'ACTIVE' ? '启用' : '停用'}
              </Tag>
            </ProDescriptions.Item>
            <ProDescriptions.Item label="地址">
              {detail.address || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="到期时间">
              {detail.expiresAt
                ? dayjs(detail.expiresAt).format('YYYY-MM-DD HH:mm')
                : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="剩余天数">
              {detail.remainingDays !== null &&
              detail.remainingDays !== undefined ? (
                detail.remainingDays < 0 ? (
                  <Tag color="default">已过期</Tag>
                ) : (
                  `${detail.remainingDays} 天`
                )
              ) : (
                '-'
              )}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="套餐">
              {detail.packageName
                ? `${detail.packageName}（${detail.packageConcurrentLimit} 并发）`
                : '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="业务员">
              {detail.assignedUserName || '-'}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="创建时间">
              {detail.createdAt
                ? dayjs(detail.createdAt).format('YYYY-MM-DD HH:mm')
                : '-'}
            </ProDescriptions.Item>
          </ProDescriptions>

          <ProTable<API.SubscriptionVO>
            headerTitle="订阅 / 续费记录"
            search={false}
            options={false}
            pagination={false}
            rowKey="id"
            columns={subColumns}
            dataSource={detail.subscriptions || []}
            style={{ marginBottom: 24 }}
          />

          <ProTable<API.ActiveSessionVO>
            headerTitle="当前活跃 Session"
            search={false}
            options={false}
            pagination={false}
            rowKey={(r) => `${r.phone}-${r.createdAt}`}
            columns={sessionColumns}
            dataSource={detail.activeSessions || []}
          />

          <RenewModalForm
            modalVisible={renewVisible}
            tenant={detail}
            packageYearlyPrice={currentPackage?.yearlyPrice}
            onCancel={() => setRenewVisible(false)}
            onSuccess={() => {
              setRenewVisible(false);
              reload();
            }}
          />
        </>
      )}
    </PageContainer>
  );
};

export default TenantDetail;
