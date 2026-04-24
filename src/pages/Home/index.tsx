import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Col, Row, Typography } from 'antd';
import React from 'react';

const HomePage: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  return (
    <PageContainer ghost>
      <Card>
        <Typography.Title level={3}>欢迎使用纱线ERP管理系统</Typography.Title>
        <Typography.Paragraph type="secondary">
          当前登录用户：{currentUser?.username || currentUser?.phone || '-'}
          {currentUser?.tenantName ? `（${currentUser.tenantName}）` : ''}
        </Typography.Paragraph>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={6}>
            <Card size="small" title="客户管理">
              管理客户（租户）信息与授权
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" title="产品管理">
              维护可售卖的 SaaS 产品
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" title="销售管理">
              产品授权开单与跟踪
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" title="员工管理">
              管理员工账号与登录授权
            </Card>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default HomePage;
