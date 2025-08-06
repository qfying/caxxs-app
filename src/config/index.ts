// 动态配置API基础URL，支持不同环境
const getBaseURL = () => {
  // 检查是否在Capacitor环境中（移动端）
  if (window.location.protocol === 'capacitor:') {
    // 移动端使用外网可访问的地址或局域网地址
    return 'http://172.30.232.95:22080';
  }

  // 生产环境
  return 'http://172.30.232.95:22080';
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
