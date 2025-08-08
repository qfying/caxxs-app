/**
 * Android应用专用的fetch处理器
 * 用于绕过Capacitor HTTP插件的限制，支持流式响应
 */

export class AndroidFetchHandler {
  /**
   * 检测是否为Android环境
   */
  static isAndroidEnvironment(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      window.location.protocol === 'capacitor:' ||
      (window as any).Capacitor?.isNativePlatform() ||
      userAgent.includes('android')
    );
  }

  /**
   * 获取原生fetch函数
   * 优先级：webFetch > window.fetch > fetch
   */
  static getNativeFetch(): typeof fetch {
    return (window as any).webFetch || window.fetch || fetch;
  }

  /**
   * 为流式请求创建专用的fetch处理器
   */
  static createStreamFetchHandler(timeout: number = 10000) {
    const nativeFetch = this.getNativeFetch();

    return async (input: RequestInfo, options: RequestInit = {}): Promise<Response> => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      try {
        console.log('Android流式请求 - URL:', input);
        console.log('Android流式请求 - Options:', options);

        const response = await nativeFetch(input, {
          ...options,
          signal: controller.signal,
        });

        console.log('Android流式响应 - Status:', response.status);
        console.log('Android流式响应 - Headers:', response.headers);
        console.log('Android流式响应 - Body可读性:', !!response.body);

        clearTimeout(id);
        return response;
      } catch (error) {
        console.error('Android流式请求失败:', error);
        clearTimeout(id);
        throw error;
      }
    };
  }

  /**
   * 验证流式响应是否可用
   */
  static validateStreamResponse(response: Response): boolean {
    if (!response.body) {
      console.warn('响应体为空，流式功能不可用');
      return false;
    }

    if (!response.body.getReader) {
      console.warn('响应体不支持getReader方法，流式功能不可用');
      return false;
    }

    return true;
  }
}
