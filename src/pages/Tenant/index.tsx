import { queryAdminTenants } from '@/services/admin';
import { getCachedPackages } from '@/services/admin/cache';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import CreateTenantForm from './components/CreateTenantForm';
import './index.less';

function rowClassName(record: API.TenantVO) {
  const d = record.remainingDays;
  if (d === null || d === undefined) return '';
  if (d <= 7) return 'tenant-row-red';
  if (d <= 30) return 'tenant-row-orange';
  return '';
}

const TenantManagement: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [packages, setPackages] = useState<API.PackageVO[]>([]);
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    let cancelled = false;
    getCachedPackages().then((list) => {
      if (!cancelled) setPackages(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const columns: ProColumns<API.TenantVO>[] = [
    { title: 'ID', dataIndex: 'id', width: 80, hideInSearch: true },
    { title: '租户名称', dataIndex: 'name', ellipsis: true },
    {
      title: '租户代码',
      dataIndex: 'code',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '套餐',
      dataIndex: 'packageName',
      hideInSearch: true,
      render: (v) => v || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        ACTIVE: { text: '启用', status: 'Success' },
        INACTIVE: { text: '停用', status: 'Error' },
      },
      render: (_, r) => (
        <Tag color={r.status === 'ACTIVE' ? 'green' : 'red'}>
          {r.status === 'ACTIVE' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '到期时间',
      dataIndex: 'expiresAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '剩余天数',
      dataIndex: 'remainingDays',
      hideInSearch: true,
      render: (_, r) => {
        const d = r.remainingDays;
        if (d === null || d === undefined) return '-';
        if (d < 0) return <Tag color="default">已过期</Tag>;
        return <span>{d} 天</span>;
      },
    },
    {
      title: '业务员',
      dataIndex: 'assignedUserName',
      hideInSearch: true,
      render: (v) => v || '-',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, r) => (
        <Space>
          <a onClick={() => history.push(`/tenant/${r.id}`)}>详情</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer header={{ title: '租户管理', breadcrumb: {} }}>
      <ProTable<API.TenantVO>
        headerTitle="租户列表"
        actionRef={actionRef}
        rowKey="id"
        rowClassName={rowClassName}
        search={{ labelWidth: 100 }}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            新建租户
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params as any;
          const res = await queryAdminTenants(
            { pageNo: current ?? 1, pageSize: pageSize ?? 20 },
            {
              name: rest.name,
              code: rest.code,
              status: rest.status,
            },
          );
          if (res.success && res.data) {
            return {
              data: res.data.items,
              success: true,
              total: res.data.total,
            };
          }
          return { data: [], success: false, total: 0 };
        }}
        columns={columns}
        scroll={{ x: 'max-content' }}
      />

      <CreateTenantForm
        modalVisible={createModalVisible}
        packages={packages}
        onCancel={() => setCreateModalVisible(false)}
        onSuccess={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
};

export default TenantManagement;
