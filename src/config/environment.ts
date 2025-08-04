import { Capacitor } from '@capacitor/core';

// 检测当前平台
const isNative = Capacitor.isNativePlatform();
const isAndroid = Capacitor.getPlatform() === 'android';
const isIOS = Capacitor.getPlatform() === 'ios';

// 根据平台设置不同的API基础URL
export const getApiBaseUrl = () => {
  if (isNative) {
    // 在移动端使用完整的服务器地址
    return 'http://10.110.163.79:8787';
  } else {
    // 在Web端使用相对路径，通过Vite代理
    return '';
  }
};

// 获取WebSocket URL
export const getWebSocketUrl = () => {
  if (isNative) {
    return 'ws://10.110.163.79:21095';
  } else {
    return 'ws://localhost:3000/ws';
  }
};

// 环境配置
export const ENV_CONFIG = {
  isNative,
  isAndroid,
  isIOS,
  apiBaseUrl: getApiBaseUrl(),
  wsUrl: getWebSocketUrl(),
}; 