import { login } from '@/services/auth';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { history, useAccess, useModel } from '@umijs/max';
import { message } from 'antd';
import React, { useEffect } from 'react';
import styles from './index.less';

const Login: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const { isLogin } = useAccess();

  // 如果已登录，跳转到首页
  useEffect(() => {
    if (isLogin) {
      history.push('/home');
    }
  }, [isLogin]);

  const handleSubmit = async (values: { phone: string; password: string }) => {
    try {
      const response = await login(values);
      if (response.success && response.data) {
        // 管理端只允许平台超级管理员登录
        if (!response.data.superAdmin) {
          message.error('该账号无管理后台权限');
          return false;
        }

        // 保存登录信息到 localStorage
        localStorage.setItem('sessionId', response.data.sessionId || '');
        localStorage.setItem('userInfo', JSON.stringify(response.data));

        // 更新全局状态
        await setInitialState((s: any) => ({
          ...s,
          currentUser: response.data,
          isLogin: true,
        }));

        // 使用 setTimeout 确保状态更新完成后再显示消息和跳转
        setTimeout(() => {
          message.success('登录成功！');
          // 跳转到首页
          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/home');
        }, 0);

        return true;
      } else {
        message.error(response.message || '登录失败，请检查用户名和密码');
        return false;
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || '登录失败，请重试';
      message.error(errorMessage);
      return false;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
              纱线ERP
            </div>
          }
          title="纱线ERP 管理后台"
          subTitle="仅限平台超级管理员登录"
          initialValues={{
            phone: '13003629527',
          }}
          onFinish={async (values) => {
            await handleSubmit(values as { phone: string; password: string });
          }}
        >
          <ProFormText
            name="phone"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请输入手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入正确的手机号格式!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: '请输入密码!',
              },
            ]}
          />
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
