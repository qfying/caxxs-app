/**
 * Android环境流式体验增强器
 * 用于在Android应用中改善流式输出的用户体验
 */

export class AndroidStreamEnhancer {
  private static readonly ANDROID_DELAY_MS = 200;
  private static readonly MIN_EVENTS_FOR_DELAY = 3;

  /**
   * 检测是否为Android环境
   */
  static isAndroidEnvironment(): boolean {
    return navigator.userAgent.toLowerCase().includes('android') ||
           window.location.protocol === 'capacitor:' ||
           (window as any).Capacitor?.isNativePlatform();
  }

  /**
   * 处理Android环境下的事件延迟
   * @param eventIndex 当前事件索引
   * @param totalEvents 总事件数
   * @param customDelay 自定义延迟时间（毫秒）
   */
  static async handleEventDelay(
    eventIndex: number,
    totalEvents: number,
    customDelay?: number
  ): Promise<void> {
    if (!this.isAndroidEnvironment()) {
      return;
    }

    // 只有在有多个事件且不是第一个事件时才添加延迟
    if (totalEvents >= this.MIN_EVENTS_FOR_DELAY && eventIndex > 0) {
      const delay = customDelay || this.ANDROID_DELAY_MS;
      console.log(`Android延迟处理: 第${eventIndex + 1}个事件，等待${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  /**
   * 根据内容类型调整延迟时间
   * @param eventType 事件类型
   * @param contentLength 内容长度
   */
  static getAdaptiveDelay(eventType: string, contentLength: number = 0): number {
    if (!this.isAndroidEnvironment()) {
      return 0;
    }

    switch (eventType) {
      case 'message_chunk':
        // 对于消息块，根据内容长度调整延迟
        return Math.min(300, Math.max(150, contentLength / 10));
      case 'fastAnswer':
        return 100;
      case 'answer':
        return 150;
      case 'interrupt':
        return 50;
      default:
        return this.ANDROID_DELAY_MS;
    }
  }

  /**
   * 创建渐进式延迟
   * 让后续事件的延迟时间逐渐减少，模拟更自然的流式效果
   * @param eventIndex 事件索引
   * @param totalEvents 总事件数
   * @param baseDelay 基础延迟时间
   */
  static getProgressiveDelay(
    eventIndex: number,
    totalEvents: number,
    baseDelay: number = this.ANDROID_DELAY_MS
  ): number {
    if (!this.isAndroidEnvironment() || eventIndex === 0) {
      return 0;
    }

    // 使用指数衰减公式，让延迟时间逐渐减少
    const decayFactor = 0.8;
    const progressiveDelay = baseDelay * Math.pow(decayFactor, eventIndex - 1);

    return Math.max(50, progressiveDelay); // 最小50ms延迟
  }

  /**
   * 记录Android环境下的流式处理统计信息
   * @param chunkCount 总chunk数量
   * @param totalEvents 总事件数量
   * @param processingTime 处理时间（毫秒）
   */
  static logStreamingStats(
    chunkCount: number,
    totalEvents: number,
    processingTime: number
  ): void {
    if (this.isAndroidEnvironment()) {
      console.log(`📱 Android流式处理统计:`, {
        环境: 'Android应用',
        总chunk数: chunkCount,
        总事件数: totalEvents,
        处理时间: `${processingTime}ms`,
        平均每chunk事件数: Math.round(totalEvents / chunkCount * 100) / 100,
        是否启用延迟: totalEvents >= this.MIN_EVENTS_FOR_DELAY
      });
    }
  }

  /**
   * 优化Android环境下的UI更新频率
   * @param callback 更新回调函数
   * @param throttleMs 节流时间（毫秒）
   */
  static createThrottledUpdate<T extends (...args: any[]) => void>(
    callback: T,
    throttleMs: number = 100
  ): T {
    if (!this.isAndroidEnvironment()) {
      return callback;
    }

    let lastCall = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    return ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastCall >= throttleMs) {
        lastCall = now;
        callback(...args);
      } else {
        // 清除之前的延迟调用
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // 设置新的延迟调用
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          callback(...args);
          timeoutId = null;
        }, throttleMs - (now - lastCall));
      }
    }) as T;
  }
}
