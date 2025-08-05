import { Capacitor } from '@capacitor/core';

export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    if (Capacitor.isNativePlatform()) {
      // 在原生平台上，我们可以尝试一个简单的网络请求来检查连接
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        mode: 'no-cors',
      });
      return true;
    } else {
      // 在 Web 平台上，检查 navigator.onLine
      return navigator.onLine;
    }
  } catch (error) {
    console.error('网络状态检查失败:', error);
    return false;
  }
};

export const isNetworkAvailable = (): boolean => {
  if (Capacitor.isNativePlatform()) {
    // 在原生平台上，我们假设网络可用
    return true;
  } else {
    return navigator.onLine;
  }
}; 