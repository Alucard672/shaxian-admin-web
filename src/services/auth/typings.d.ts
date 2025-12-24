declare namespace API {
  type RegisterRequest = {
    phone: string;
    password: string;
    tenantCode?: string;
  };

  type UserSession = {
    sessionId?: string;
    userId?: number;
    username?: string;
    phone?: string;
    email?: string;
    role?: string;
    position?: string;
    tenantId?: number;
    tenantName?: string;
    tenantCode?: string;
  };

  type ApiResponseUserSession = {
    success?: boolean;
    message?: string;
    data?: UserSession;
  };

  type ApiResponseMapStringObject = {
    success?: boolean;
    message?: string;
    data?: Record<string, any>;
  };

  type ApiResponseVoid = {
    success?: boolean;
    message?: string;
    data?: any;
  };
}

