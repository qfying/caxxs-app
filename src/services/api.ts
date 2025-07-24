import { http } from '../utils/request';

interface LoginResponse {
  token: string;
  // 添加其他可能的返回字段
}

interface ChatMessage {
  content: string;
  role: string;
  dataId: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  variables: Record<string, any>;
  responseChatItemId: string;
  shareId: string;
  chatId: string;
  appType: string;
  outLinkUid: string;
  detail: boolean;
  stream: boolean;
  finish_reason_type: number;
}

interface ApiLoginResponse {
  code: number;
  message: string;
  data: LoginResponse;
}

export const loginByPassword = (username: string, password: string): Promise<ApiLoginResponse> => {
  return http.post<LoginResponse>('/openapi/v1/user/loginByPassword', {
    username,
    password,
  }) as Promise<ApiLoginResponse>;
};

export const sendChatMessage = (request: ChatCompletionRequest): Promise<Response> => {
  return http.post('/openapi/chat/completions', request) as Promise<Response>;
};

export const taskCreate = ({ data }: any): Promise<ApiLoginResponse> => {
  return http.post<LoginResponse>('/openapi/v2/task/create', data) as Promise<ApiLoginResponse>;
};
