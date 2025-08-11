import { API_CONFIG, HTTP_STATUS } from '../config';
import { AndroidFetchHandler } from './android-fetch';

interface RequestOptions extends RequestInit {
  timeout?: number;
  isStream?: boolean;
  skipDefaultContentType?: boolean;
}

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

class RequestError extends Error {
  constructor(public code: number, message: string) {
    super(message);
    this.name = 'RequestError';
  }
}

class HttpRequest {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private defaultTimeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
    this.defaultTimeout = API_CONFIG.TIMEOUT;
  }

  private getToken(): string | null {
    // 不缓存token，每次请求时重新获取
    return null;
  }

  private async timeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new RequestError(408, '请求超时'));
      }, timeout);
    });
  }

  private async fetchWithTimeout(
    input: RequestInfo,
    options: RequestOptions = {}
  ): Promise<Response> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(input, {
        ...fetchOptions,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      switch (response.status) {
        case HTTP_STATUS.UNAUTHORIZED:
          // 不缓存token，无需清除
          throw new RequestError(
            HTTP_STATUS.UNAUTHORIZED,
            '未授权或token已过期'
          );
        case HTTP_STATUS.FORBIDDEN:
          throw new RequestError(HTTP_STATUS.FORBIDDEN, '无访问权限');
        case HTTP_STATUS.NOT_FOUND:
          throw new RequestError(HTTP_STATUS.NOT_FOUND, '请求的资源不存在');
        case HTTP_STATUS.SERVER_ERROR:
          throw new RequestError(HTTP_STATUS.SERVER_ERROR, '服务器错误');
        default:
          throw new RequestError(response.status, '请求失败');
      }
    }

    const data = await response.json();

    return data;
  }

  public async request<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers = new Headers();

    // 对于FormData上传，跳过默认的Content-Type
    if (!options.skipDefaultContentType) {
      Object.entries(this.defaultHeaders).forEach(([key, value]) => {
        headers.append(key, value);
      });
    }

    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    const finalOptions: RequestOptions = {
      ...options,
      headers: {
        ...Object.fromEntries(headers.entries()),
        ...options.headers,
      },
    };

    console.log('Request Headers:', finalOptions.headers);

    try {
      // 对于流式请求，如果在移动端则使用原生fetch绕过CapacitorHttp
      let fetchFunction = this.fetchWithTimeout.bind(this);

      console.log("流式请求检测 - isStream:", options.isStream, "isMobileApp:", this.isMobileApp());

      if (options.isStream && this.isMobileApp()) {
        console.log("使用Android专用fetch处理流式请求");
        fetchFunction = AndroidFetchHandler.createStreamFetchHandler(this.defaultTimeout);
      }

      const response = await fetchFunction(
        `${this.baseURL}${url}`,
        finalOptions
      );

      console.log('请求头===========', response);

      // 如果是流式输出，直接返回响应，不进行JSON解析
      if (options.isStream) {
        // 对于Android环境，验证流式响应是否可用
        if (this.isMobileApp()) {
          AndroidFetchHandler.validateStreamResponse(response);
        }
        return response as any;
      }

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      console.error('网络请求错误:', error);
      console.error('请求URL:', `${this.baseURL}${url}`);
      console.error('请求选项:', finalOptions);

      if (error instanceof RequestError) {
        throw error;
      }
      if (error.name === 'AbortError') {
        throw new RequestError(408, '请求超时');
      }
      if (error.message && error.message.includes('Failed to fetch')) {
        throw new RequestError(0, '网络连接失败，请检查网络设置');
      }
      throw new RequestError(500, `网络错误: ${error.message || '未知错误'}`);
    }
  }

  private isMobileApp(): boolean {
    return AndroidFetchHandler.isAndroidEnvironment();
  }

  public async get<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  public async post<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    // 检查是否是FormData
    let body: string | FormData;
    let finalOptions = { ...options };

    if (data instanceof FormData) {
      body = data;
      // 对于FormData，完全删除Content-Type，让浏览器自动设置boundary
      if (finalOptions.headers) {
        const headers = { ...finalOptions.headers };
        delete (headers as any)['Content-Type'];
        finalOptions.headers = headers;
      } else {
        finalOptions.headers = {};
      }
      // 确保不会从默认头中继承Content-Type
      finalOptions.skipDefaultContentType = true;
    } else {
      body = JSON.stringify(data);
    }

    return this.request<T>(url, {
      ...finalOptions,
      method: 'POST',
      body,
    });
  }

  public async put<T = any>(
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async delete<T = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export const http = new HttpRequest();
