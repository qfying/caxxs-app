// 动态配置API基础URL，支持不同环境
const getBaseURL = () => {
  // 检查是否为Android手机应用
  const isAndroidApp = () => {
    // 检查用户代理是否包含Android
    const userAgent = navigator.userAgent.toLowerCase();

    console.log(
      '88888888888888888888888888',
      window.location.protocol,
      userAgent
    );
    // 检查是否在Capacitor环境中（移动端）或者用户代理包含Android
    if (
      window.location.protocol === 'capacitor:' ||
      userAgent.includes('android')
    ) {
      return userAgent.includes('android');
    }
    return false;
  };


  console.log('99999999999999999999============', isAndroidApp());
  // Android手机应用返回指定地址，其他情况返回空字符串
  if (isAndroidApp()) {
    console.log('10000000000000000000============', isAndroidApp());
    return 'http://172.30.232.95:22081';
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
