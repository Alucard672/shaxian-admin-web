import { history, Outlet, useAccess } from '@umijs/max';
import { useEffect } from 'react';

export default () => {
  const { isLogin } = useAccess();

  useEffect(() => {
    if (!isLogin) {
      history.push('/login');
    }
  }, [isLogin]);

  if (!isLogin) return null;
  return <Outlet />;
};
