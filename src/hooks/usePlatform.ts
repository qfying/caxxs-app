import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from 'react';

interface PlatformInfo {
  isAndroid: boolean;
  isIOS: boolean;
  isWeb: boolean;
  isNative: boolean;
  platform: string;
}

export const usePlatform = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isAndroid: false,
    isIOS: false,
    isWeb: true,
    isNative: false,
    platform: 'web'
  });

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();

    setPlatformInfo({
      isAndroid: platform === 'android',
      isIOS: platform === 'ios',
      isWeb: platform === 'web',
      isNative,
      platform
    });
  }, []);

  return platformInfo;
};

export default usePlatform;

