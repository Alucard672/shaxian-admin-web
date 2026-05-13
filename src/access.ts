export default (initialState: {
  currentUser?: API.UserSession;
  isLogin?: boolean;
}) => {
  const isLogin = !!initialState?.isLogin;
  const isSuperAdmin = !!initialState?.currentUser?.superAdmin && isLogin;
  return {
    isLogin,
    canAccessAdmin: isSuperAdmin,
    canAccessTenant: isSuperAdmin,
  };
};
