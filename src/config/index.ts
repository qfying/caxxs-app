export const API_CONFIG = {
  // 根据环境设置不同的BASE_URL
  BASE_URL: process.env.NODE_ENV === 'development'
    ? '' // 开发环境使用相对路径，通过Vite代理
    : 'http://10.110.163.79:8787', // 生产环境使用实际的后端地址
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
