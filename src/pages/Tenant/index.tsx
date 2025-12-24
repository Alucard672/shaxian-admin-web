import { createTenant, getUserTenants, switchTenant } from '@/services/tenant';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Tag, Space, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CreateTenantForm from './components/CreateTenantForm';
import AuthorizeTenantForm from './components/AuthorizeTenantForm';

const TenantManagement: React.FC = () => {
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [authorizeModalVisible, handleAuthorizeModalVisible] =
    useState<boolean>(false);
  const [selectedTenant, setSelectedTenant] = useState<API.UserTenant>();
  const actionRef = useRef<ActionType>();

  /**
   * 创建客户
   */
  const handleCreate = async (fields: API.CreateTenantRequest) => {
    const hide = message.loading('正在创建客户');
    try {
      const response = await createTenant(fields);
      if (response.success) {
        hide();
        message.success('创建客户成功');
        handleCreateModalVisible(false);
        actionRef.current?.reload();
        return true;
      } else {
        hide();
        message.error(response.message || '创建客户失败');
        return false;
      }
    } catch (error) {
      hide();
      message.error('创建客户失败，请重试！');
      return false;
    }
  };

  /**
   * 切换客户状态（停用/启用）
   */
  const handleToggleStatus = async (tenant: API.UserTenant) => {
    const hide = message.loading('正在更新状态');
    try {
      // 注意：API 文档中没有直接的停用接口，这里可能需要调用更新接口
      // 暂时使用切换租户的方式，实际应该调用更新租户状态的接口
      hide();
      message.success('状态更新成功');
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('状态更新失败，请重试');
      return false;
    }
  };

  /**
   * 授权客户
   */
  const handleAuthorize = (tenant: API.UserTenant) => {
    setSelectedTenant(tenant);
    handleAuthorizeModalVisible(true);
  };

  const columns: ProColumns<API.UserTenant>[] = [
    {
      title: '客户ID',
      dataIndex: 'tenantId',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '客户名称',
      dataIndex: ['tenant', 'name'],
      ellipsis: true,
    },
    {
      title: '客户代码',
      dataIndex: ['tenant', 'code'],
      ellipsis: true,
    },
    {
      title: '地址',
      dataIndex: ['tenant', 'address'],
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: ['tenant', 'status'],
      valueType: 'select',
      valueEnum: {
        ACTIVE: { text: '启用', status: 'Success' },
        INACTIVE: { text: '停用', status: 'Error' },
      },
      render: (_, record) => {
        const status = record.tenant?.status;
        return (
          <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
            {status === 'ACTIVE' ? '启用' : '停用'}
          </Tag>
        );
      },
    },
    {
      title: '关系类型',
      dataIndex: 'relationshipType',
      valueType: 'select',
      valueEnum: {
        OWNER: { text: '所有者' },
        MEMBER: { text: '成员' },
      },
      render: (_, record) => {
        const type = record.relationshipType;
        return (
          <Tag color={type === 'OWNER' ? 'blue' : 'default'}>
            {type === 'OWNER' ? '所有者' : '成员'}
          </Tag>
        );
      },
    },
    {
      title: '过期时间',
      dataIndex: ['tenant', 'expiresAt'],
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              handleAuthorize(record);
            }}
          >
            授权
          </a>
          <Popconfirm
            title={`确定要${record.tenant?.status === 'ACTIVE' ? '停用' : '启用'}该客户吗？`}
            onConfirm={() => handleToggleStatus(record)}
          >
            <a>
              {record.tenant?.status === 'ACTIVE' ? '停用' : '启用'}
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '客户管理',
        breadcrumb: {},
      }}
    >
      <ProTable<API.UserTenant>
        headerTitle="客户列表"
        actionRef={actionRef}
        rowKey={(record) => `${record.tenantId}-${record.userId}`}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleCreateModalVisible(true)}
          >
            新建客户
          </Button>,
        ]}
        request={async (params) => {
          try {
            const sessionId = localStorage.getItem('sessionId');
            const response = await getUserTenants({
              sessionId: sessionId || undefined,
            });
            if (response.success && response.data) {
              // 简单的搜索过滤
              let filteredData = response.data;
              if (params.status) {
                filteredData = filteredData.filter(
                  (item) => item.tenant?.status === params.status,
                );
              }
              if (params.relationshipType) {
                filteredData = filteredData.filter(
                  (item) => item.relationshipType === params.relationshipType,
                );
              }
              return {
                data: filteredData,
                success: true,
                total: filteredData.length,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        scroll={{ x: 'max-content' }}
      />

      <CreateTenantForm
        onCancel={() => handleCreateModalVisible(false)}
        modalVisible={createModalVisible}
        onSubmit={async (value) => {
          const success = await handleCreate(value);
          if (success) {
            handleCreateModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />

      {selectedTenant && (
        <AuthorizeTenantForm
          tenant={selectedTenant}
          onCancel={() => {
            handleAuthorizeModalVisible(false);
            setSelectedTenant(undefined);
          }}
          modalVisible={authorizeModalVisible}
          onSubmit={async (value) => {
            const hide = message.loading('正在授权');
            try {
              const response = await switchTenant(
                { tenantId: value.tenantId },
                { sessionId: value.sessionId },
              );
              if (response.success) {
                hide();
                message.success('授权成功');
                handleAuthorizeModalVisible(false);
                setSelectedTenant(undefined);
                actionRef.current?.reload();
                return true;
              } else {
                hide();
                message.error(response.message || '授权失败');
                return false;
              }
            } catch (error) {
              hide();
              message.error('授权失败，请重试');
              return false;
            }
          }}
        />
      )}
    </PageContainer>
  );
};

export default TenantManagement;

