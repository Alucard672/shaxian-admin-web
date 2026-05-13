import { login } from '@/services/auth';
import {
  ArrowRightOutlined,
  LockOutlined,
  MobileOutlined,
} from '@ant-design/icons';
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
      {/* 左侧品牌区（仅桌面） */}
      <div className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />

        <div className={styles.heroInner}>
          <div className={styles.brand}>
            <div className={styles.logo}>织</div>
            <div>
              <div className={styles.brandName}>织云 ERP</div>
              <div className={styles.brandSub}>ZHIYUN · ADMIN</div>
            </div>
          </div>

          <div>
            <div className={styles.taglineMark}>PLATFORM CONSOLE</div>
            <h2 className={styles.taglineHead}>平台管理后台</h2>
            <p className={styles.taglineSub}>
              租户管理 · 套餐订阅 · 平台运营 一体化控制台
            </p>

            <ul className={styles.features}>
              <li>
                <span>·</span>租户全生命周期管理
              </li>
              <li>
                <span>·</span>套餐定价 / 并发授权
              </li>
              <li>
                <span>·</span>到期监控 / 续费记录
              </li>
              <li>
                <span>·</span>实时活跃会话审计
              </li>
            </ul>
          </div>

          <div className={styles.heroFooter}>
            © 2026 织云 ERP · ALL RIGHTS RESERVED
          </div>
        </div>
      </div>

      {/* 右侧表单区 */}
      <div className={styles.formWrap}>
        <div className={styles.formInner}>
          <div className={styles.brandMobile}>
            <div className={styles.logoSmall}>织</div>
            <div>
              <div className={styles.brandNameSmall}>织云 ERP</div>
              <div className={styles.brandSubSmall}>ZHIYUN · ADMIN</div>
            </div>
          </div>

          <div className={styles.titleWrap}>
            <div className={styles.tag}>SIGN IN</div>
            <div className={styles.title}>登录管理后台</div>
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

            <Form.Item style={{ marginBottom: 0, marginTop: 4 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                className={styles.submit}
              >
                登 录 <ArrowRightOutlined />
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.notice}>
            该入口仅供平台运营使用。租户用户请前往业务端登录。
          </div>

          <div className={styles.footerMobile}>© 2026 织云 ERP</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
