import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/product';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Space, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CreateProductForm from './components/CreateProductForm';
import UpdateProductForm from './components/UpdateProductForm';

const ProductManagement: React.FC = () => {
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<API.Product>();
  const actionRef = useRef<ActionType>();

  /**
   * 创建产品
   */
  const handleCreate = async (fields: API.CreateProductRequest) => {
    const hide = message.loading('正在创建产品');
    try {
      const response = await createProduct(fields);
      if (response.success) {
        hide();
        message.success('创建产品成功');
        handleCreateModalVisible(false);
        actionRef.current?.reload();
        return true;
      } else {
        hide();
        message.error(response.message || '创建产品失败');
        return false;
      }
    } catch (error) {
      hide();
      message.error('创建产品失败，请重试！');
      return false;
    }
  };

  /**
   * 更新产品
   */
  const handleUpdate = async (fields: API.UpdateProductRequest) => {
    if (!selectedProduct?.id) return false;
    const hide = message.loading('正在更新产品');
    try {
      const response = await updateProduct(
        { id: selectedProduct.id },
        fields,
      );
      if (response.success) {
        hide();
        message.success('更新产品成功');
        handleUpdateModalVisible(false);
        setSelectedProduct(undefined);
        actionRef.current?.reload();
        return true;
      } else {
        hide();
        message.error(response.message || '更新产品失败');
        return false;
      }
    } catch (error) {
      hide();
      message.error('更新产品失败，请重试！');
      return false;
    }
  };

  /**
   * 删除产品
   */
  const handleRemove = async (product: API.Product) => {
    if (!product.id) return false;
    const hide = message.loading('正在删除产品');
    try {
      const response = await deleteProduct({ id: product.id });
      if (response.success) {
        hide();
        message.success('删除产品成功');
        actionRef.current?.reload();
        return true;
      } else {
        hide();
        message.error(response.message || '删除产品失败');
        return false;
      }
    } catch (error) {
      hide();
      message.error('删除产品失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<API.Product>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '产品编码',
      dataIndex: 'code',
      ellipsis: true,
    },
    {
      title: '默认端口数',
      dataIndex: 'defaultPortCount',
      valueType: 'digit',
      hideInSearch: true,
      width: 100,
      render: (_, record) => `${record.defaultPortCount || 0} 个`,
    },
    {
      title: '产品类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        STANDARD: { text: '标准版' },
        PREMIUM: { text: '专业版' },
        ENTERPRISE: { text: '企业版' },
      },
    },
    {
      title: '默认单价',
      dataIndex: 'price',
      valueType: 'money',
      hideInSearch: true,
    },
    {
      title: '产品描述',
      dataIndex: 'description',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      hideInSearch: true,
      width: 80,
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
      width: 150,
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              setSelectedProduct(record);
              handleUpdateModalVisible(true);
            }}
          >
            编辑
          </a>
          <Popconfirm
            title="确定要删除该产品吗？"
            onConfirm={() => handleRemove(record)}
          >
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'SAAS产品管理',
        breadcrumb: {},
      }}
    >
      <ProTable<API.Product>
        headerTitle="产品列表"
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
            新建产品
          </Button>,
        ]}
        request={async (params) => {
          try {
            const response = await getAllProducts();
            if (response.success && response.data) {
              let filteredData = response.data;
              if (params.name) {
                filteredData = filteredData.filter((item) =>
                  item.name?.includes(params.name as string),
                );
              }
              if (params.code) {
                filteredData = filteredData.filter((item) =>
                  item.code?.includes(params.code as string),
                );
              }
              if (params.type) {
                filteredData = filteredData.filter(
                  (item) => item.type === params.type,
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

      <CreateProductForm
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

      {selectedProduct && (
        <UpdateProductForm
          product={selectedProduct}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setSelectedProduct(undefined);
          }}
          modalVisible={updateModalVisible}
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setSelectedProduct(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />
      )}
    </PageContainer>
  );
};

export default ProductManagement;
