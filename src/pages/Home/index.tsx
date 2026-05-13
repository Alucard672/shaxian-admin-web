import { getAdminDashboard } from '@/services/admin';
import {
  PageContainer,
  ProColumns,
  ProTable,
  StatisticCard,
} from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { Tabs, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [data, setData] = useState<API.DashboardVO | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAdminDashboard()
      .then((r) => {
        if (r.success && r.data) setData(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: ProColumns<API.TenantVO>[] = [
    { title: '租户', dataIndex: 'name', ellipsis: true },
    { title: '套餐', dataIndex: 'packageName', render: (v) => v || '-' },
    {
      title: '到期',
      dataIndex: 'expiresAt',
      render: (_, r) =>
        r.expiresAt ? dayjs(r.expiresAt).format('YYYY-MM-DD') : '-',
    },
    {
      title: '剩余',
      dataIndex: 'remainingDays',
      render: (_, r) => {
        const d = r.remainingDays;
        if (d === null || d === undefined) return '-';
        if (d < 0) return <Tag color="default">已过期</Tag>;
        if (d <= 7) return <Tag color="red">{d} 天</Tag>;
        if (d <= 30) return <Tag color="orange">{d} 天</Tag>;
        return `${d} 天`;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, r) => (
        <a onClick={() => history.push(`/tenant/${r.id}`)}>详情</a>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '管理后台首页',
        subTitle: `欢迎，${
          currentUser?.username || currentUser?.phone || '超级管理员'
        }`,
      }}
      loading={loading}
    >
      <StatisticCard.Group direction="row" style={{ marginBottom: 24 }}>
        <StatisticCard
          statistic={{ title: '租户总数', value: data?.totalTenants ?? 0 }}
        />
        <StatisticCard.Divider />
        <StatisticCard
          statistic={{ title: '在用租户', value: data?.activeTenants ?? 0 }}
        />
        <StatisticCard.Divider />
        <StatisticCard
          statistic={{
            title: '30 天内到期',
            value: data?.expiringIn30Days?.length ?? 0,
            valueStyle: { color: '#fa8c16' },
          }}
          chartPlacement="left"
          onClick={() => history.push('/tenant')}
          style={{ cursor: 'pointer' }}
        />
        <StatisticCard.Divider />
        <StatisticCard
          statistic={{
            title: '已到期',
            value: data?.expired?.length ?? 0,
            valueStyle: { color: '#f5222d' },
          }}
          onClick={() => history.push('/tenant')}
          style={{ cursor: 'pointer' }}
        />
      </StatisticCard.Group>

      <Tabs
        items={[
          {
            key: 'expiring',
            label: `30 天内到期 (${data?.expiringIn30Days?.length ?? 0})`,
            children: (
              <ProTable<API.TenantVO>
                search={false}
                options={false}
                pagination={false}
                rowKey="id"
                columns={columns}
                dataSource={data?.expiringIn30Days || []}
              />
            ),
          },
          {
            key: 'expired',
            label: `已到期 (${data?.expired?.length ?? 0})`,
            children: (
              <ProTable<API.TenantVO>
                search={false}
                options={false}
                pagination={false}
                rowKey="id"
                columns={columns}
                dataSource={data?.expired || []}
              />
            ),
          },
        ]}
      />
    </PageContainer>
  );
};

export default HomePage;
