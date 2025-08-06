// 动态配置API基础URL，支持不同环境
const getBaseURL = () => {
  // 检查是否为Android手机应用
  const isAndroidApp = () => {
    // 检查是否在Capacitor环境中（移动端）
    if (window.location.protocol === 'capacitor:') {
      // 检查用户代理是否包含Android
      const userAgent = navigator.userAgent.toLowerCase();
      return userAgent.includes('android');
    }
    return false;
  };

  // Android手机应用返回指定地址，其他情况返回空字符串
  if (isAndroidApp()) {
    return 'http://172.30.232.95:22080';
  }

  return '';
};

export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  TIMEOUT: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

export const HTTP_STATUS = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
