import {
  getAllSales,
  createSalesOrder,
  deleteSalesOrder,
} from '@/services/sales';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Tag, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CreateSalesOrderForm from './components/CreateSalesOrderForm';

const SalesManagement: React.FC = () => {
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  /**
   * 创建销售订单 (产品授权)
   */
  const handleCreate = async (fields: API.CreateSalesOrderRequest) => {
    const hide = message.loading('正在创建销售订单');
    try {
      const response = await createSalesOrder(fields);
      if (response.success) {
        hide();
        message.success('创建销售订单成功');
        handleCreateModalVisible(false);
        actionRef.current?.reload();
        return true;
      } else {
        hide();
        message.error(response.message || '创建销售订单失败');
        return false;
      }
    } catch (error) {
      hide();
      message.error('创建销售订单失败，请重试！');
      return false;
    }
  };

  /**
   * 删除销售订单
   */
  const handleRemove = async (order: API.SalesOrder) => {
    if (!order.id) return false;
    const hide = message.loading('正在删除销售订单');
    try {
      const response = await deleteSalesOrder({ id: order.id });
      if (response.success) {
        hide();
        message.success('删除销售订单成功');
        actionRef.current?.reload();
        return true;
      } else {
        hide();
        message.error(response.message || '删除销售订单失败');
        return false;
      }
    } catch (error) {
      hide();
      message.error('删除销售订单失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<API.SalesOrder>[] = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      ellipsis: true,
    },
    {
      title: '客户 (租户)',
      dataIndex: 'customerName',
      ellipsis: true,
    },
    {
      title: '签约日期',
      dataIndex: 'salesDate',
      valueType: 'date',
    },
    {
      title: '有效期至',
      dataIndex: 'expectedDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '合同总额',
      dataIndex: 'totalAmount',
      valueType: 'money',
      hideInSearch: true,
    },
    {
      title: '已收金额',
      dataIndex: 'receivedAmount',
      valueType: 'money',
      hideInSearch: true,
    },
    {
      title: '授权状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        DRAFT: { text: '草稿', status: 'Default' },
        PENDING: { text: '待开通', status: 'Warning' },
        APPROVED: { text: '已开通', status: 'Success' },
        SHIPPED: { text: '服务中', status: 'Processing' },
        CANCELLED: { text: '已终止', status: 'Error' },
      },
      render: (_, record) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          DRAFT: { text: '草稿', color: 'default' },
          PENDING: { text: '待开通', color: 'warning' },
          APPROVED: { text: '已开通', color: 'success' },
          SHIPPED: { text: '服务中', color: 'processing' },
          CANCELLED: { text: '已终止', color: 'error' },
        };
        const status = statusMap[record.status || ''] || { text: record.status, color: 'default' };
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '经办人',
      dataIndex: 'operator',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="确定要删除该销售订单吗？"
          onConfirm={() => handleRemove(record)}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '销售与授权管理',
        breadcrumb: {},
      }}
    >
      <ProTable<API.SalesOrder>
        headerTitle="销售订单 (产品授权列表)"
        actionRef={actionRef}
        rowKey="id"
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
            销售开单
          </Button>,
        ]}
        request={async (params) => {
          try {
            const response = await getAllSales({
              pageNo: (params.current || 1) - 1,
              pageSize: params.pageSize || 10,
              request: {
                status: params.status as string,
                customerId: params.customerId as number,
                startDate: params.startDate as string,
                endDate: params.endDate as string,
              },
            });
            if (response.success && response.data) {
              return {
                data: response.data,
                success: true,
                total: response.data.length,
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

      <CreateSalesOrderForm
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
    </PageContainer>
  );
};

export default SalesManagement;
