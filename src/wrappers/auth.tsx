import { history, Outlet, useModel } from '@umijs/max';
import { useEffect, useMemo } from 'react';

export default () => {
  const { initialState } = useModel('@@initialState');

  // 双重校验：必须是 superAdmin 且 sessionId 存在；防止伪造 isLogin 绕过登录页
  const isAuthorized = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const sessionId = localStorage.getItem('sessionId');
    return !!sessionId && !!initialState?.currentUser?.superAdmin;
  }, [initialState]);

  useEffect(() => {
    if (!isAuthorized) {
      history.push('/login');
    }
  }, [isAuthorized]);

  if (!isAuthorized) return null;
  return <Outlet />;
};
