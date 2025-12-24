export default (initialState: { currentUser?: API.UserSession; isLogin?: boolean }) => {
  // 先行开发阶段，关闭登录校验，全部放行
  const isLogin = true;
  return {
    isLogin,
    canAccessTenant: true,
    canAccessEmployee: true,
  };
};
