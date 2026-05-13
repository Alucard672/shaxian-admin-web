import { login } from '@/services/auth';
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import { history, useAccess, useModel } from '@umijs/max';
import { Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

const Login: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const { isLogin } = useAccess();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLogin) history.push('/home');
  }, [isLogin]);

  const handleSubmit = async (values: { phone: string; password: string }) => {
    setLoading(true);
    try {
      const response = await login(values);
      if (response.success && response.data) {
        if (!response.data.superAdmin) {
          message.error('该账号无管理后台权限');
          return;
        }
        localStorage.setItem('sessionId', response.data.sessionId || '');
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        await setInitialState((s: any) => ({
          ...s,
          currentUser: response.data,
          isLogin: true,
        }));
        setTimeout(() => {
          message.success('登录成功');
          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/home');
        }, 0);
      } else {
        message.error(response.message || '登录失败');
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || error?.message || '登录失败',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* 渐变背景 + 模糊光斑 */}
      <div className={styles.bg}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>纱</div>
          <div>
            <div className={styles.brandName}>纱线通 ERP</div>
            <div className={styles.brandSub}>YARN ERP · 管理后台</div>
          </div>
        </div>

        <div className={styles.titleWrap}>
          <div className={styles.title}>欢迎回来</div>
          <div className={styles.subtitle}>仅限平台超级管理员登录</div>
        </div>

        <Form
          layout="vertical"
          requiredMark={false}
          onFinish={handleSubmit}
          autoComplete="off"
          className={styles.form}
        >
          <Form.Item
            name="phone"
            label={<span className={styles.label}>手机号</span>}
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input
              size="large"
              prefix={<MobileOutlined className={styles.icon} />}
              placeholder="请输入手机号"
              className={styles.input}
              maxLength={11}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className={styles.label}>密码</span>}
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className={styles.icon} />}
              placeholder="请输入密码"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              className={styles.submit}
            >
              登 录 进 入 系 统
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.footer}>
          <span>© 2026 纱线通</span>
          <span className={styles.dot}>·</span>
          <span>仅供平台运营使用</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
