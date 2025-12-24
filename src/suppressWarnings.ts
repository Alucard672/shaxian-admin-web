// 抑制来自第三方库的警告
// 这个文件需要在应用启动前加载

if (typeof window !== 'undefined') {
  // 保存原始的 console 方法
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;

  // 拦截所有 console 方法
  const filterMessage = (message: any): boolean => {
    if (typeof message === 'string') {
      return (
        message.includes('findDOMNode is deprecated') ||
        message.includes('Warning: findDOMNode') ||
        message.includes('Download the React DevTools')
      );
    }
    return false;
  };

  console.error = (...args: any[]) => {
    if (!filterMessage(args[0])) {
      originalError.apply(console, args);
    }
  };

  console.warn = (...args: any[]) => {
    if (!filterMessage(args[0])) {
      originalWarn.apply(console, args);
    }
  };

  // 也拦截 console.log（某些警告可能通过 log 输出）
  console.log = (...args: any[]) => {
    if (!filterMessage(args[0])) {
      originalLog.apply(console, args);
    }
  };
}

