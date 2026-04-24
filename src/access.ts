export default (initialState: {
  currentUser?: API.UserSession;
  isLogin?: boolean;
}) => {
  const isLogin = !!initialState?.isLogin;
  return {
    isLogin,
    canAccessTenant: isLogin,
    canAccessEmployee: isLogin,
  };
};
