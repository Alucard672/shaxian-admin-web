import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  authorizeEmployeeLogin,
} from '@/services/employee';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Tag, Space, Popconfirm, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import CreateEmployeeForm from './components/CreateEmployeeForm';
import UpdateEmployeeForm from './components/UpdateEmployeeForm';
import AuthorizeEmployeeForm from './components/AuthorizeEmployeeForm';

const EmployeeManagement: React.FC = () => {
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [authorizeModalVisible, handleAuthorizeModalVisible] =
    useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<API.Employee>();
  const actionRef = useRef<ActionType>();

  /**
   * 创建员工
   */
  const handleCreate = async (fields: API.CreateEmployeeRequest) => {
    const hide = message.loading('正在创建员工');
    try {
      const response = await createEmployee(fields);
      if (response.success) {
        hide();
        message.success('创建员工成功');
        handleCreateModalVisible(false);
        actionRef.current?.reload();
        return true;
      } else {
        hide();
        message.error(response.message || '创建员工失败');
        return false;
      }
    } catch (error) {
      hide();
      message.error('创建员工失败，请重试！');
      return false;
    }
  };

  /**
   * 更新员工
   */
  const handleUpdate = async (fields: API.UpdateEmployeeRequest) => {
    if (!selectedEmployee?.id) return false;
    const hide = message.loading('正在更新员工');
    try {
      const response = await updateEmployee(
        { id: selectedEmployee.id },
        fields,
      );
      if (response.success) {
        hide();
        message.success('更新员工成功');
        handleUpdateModalVisible(false);
        setSelectedEmployee(undefined);
        actionRef.current?.reload();
        return true;
      } else {
        hide();
        message.error(response.message || '更新员工失败');
        return false;
      }
    } catch (error) {
      hide();
      message.error('更新员工失败，请重试！');
      return false;
    }
  };

  /**
   * 删除员工
   */
  const handleRemove = async (employee: API.Employee) => {
    if (!employee.id) return false;
    const hide = message.loading('正在删除员工');
    try {
      const response = await deleteEmployee({ id: employee.id });
      if (response.success) {
        hide();
        message.success('删除员工成功');
        actionRef.current?.reload();
        return true;
      } else {
        hide();
        message.error(response.message || '删除员工失败');
        return false;
      }
    } catch (error) {
      hide();
      message.error('删除员工失败，请重试');
      return false;
    }
  };

  /**
   * 授权员工登录
   */
  const handleAuthorize = (employee: API.Employee) => {
    setSelectedEmployee(employee);
    handleAuthorizeModalVisible(true);
  };

  const columns: ProColumns<API.Employee>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '姓名为必填项',
          },
        ],
      },
    },
    {
      title: '职位',
      dataIndex: 'position',
      ellipsis: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      ellipsis: true,
    },
    {
      title: '角色',
      dataIndex: 'role',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        active: { text: '启用', status: 'Success' },
        inactive: { text: '停用', status: 'Error' },
      },
      render: (_, record) => {
        const status = record.status;
        return (
          <Tag color={status === 'active' ? 'green' : 'red'}>
            {status === 'active' ? '启用' : '停用'}
          </Tag>
        );
      },
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
      width: 250,
      render: (_, record) => (
        <Space>
          <a
            onClick={() => {
              setSelectedEmployee(record);
              handleUpdateModalVisible(true);
            }}
          >
            编辑
          </a>
          <a
            onClick={() => {
              handleAuthorize(record);
            }}
          >
            授权登录
          </a>
          <Popconfirm
            title="确定要删除该员工吗？"
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
        title: '员工管理',
        breadcrumb: {},
      }}
    >
      <ProTable<API.Employee>
        headerTitle="员工列表"
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
            新建员工
          </Button>,
        ]}
        request={async (params) => {
          try {
            console.log('正在请求员工列表...');
            const response = await getAllEmployees();
            console.log('员工列表响应:', response);
            if (response.success && response.data) {
              // 简单的搜索过滤
              let filteredData = response.data;
              if (params.name) {
                filteredData = filteredData.filter((item) =>
                  item.name?.includes(params.name as string),
                );
              }
              if (params.status) {
                filteredData = filteredData.filter(
                  (item) => item.status === params.status,
                );
              }
              return {
                data: filteredData,
                success: true,
                total: filteredData.length,
              };
            }
            message.warning(response.message || '获取员工列表失败');
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error: any) {
            console.error('获取员工列表失败:', error);
            const errorMessage = error?.response?.data?.message || error?.message || '获取员工列表失败，请重试';
            message.error(errorMessage);
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

      <CreateEmployeeForm
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

      {selectedEmployee && (
        <UpdateEmployeeForm
          employee={selectedEmployee}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setSelectedEmployee(undefined);
          }}
          modalVisible={updateModalVisible}
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setSelectedEmployee(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        />
      )}

      {selectedEmployee && (
        <AuthorizeEmployeeForm
          employee={selectedEmployee}
          onCancel={() => {
            handleAuthorizeModalVisible(false);
            setSelectedEmployee(undefined);
          }}
          modalVisible={authorizeModalVisible}
          onSubmit={async (value) => {
            if (!selectedEmployee.id) return false;
            const hide = message.loading('正在授权');
            try {
              const response = await authorizeEmployeeLogin(
                { employeeId: selectedEmployee.id },
                { tenantId: value.tenantId },
              );
              if (response.success) {
                hide();
                message.success('授权成功');
                handleAuthorizeModalVisible(false);
                setSelectedEmployee(undefined);
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

export default EmployeeManagement;

