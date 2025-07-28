import { http } from '../utils/request';

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    [key: string]: any;
  };
  // 添加其他可能的返回字段
}

interface TaskData {
  customer: string;
  address: string;
  order_id: string;
  product: string;
  description: string;
  create: string;
  end: string;
  executeId: string;
  id: string;
  start: string;
  status: string;
  deleted: boolean;
  [key: string]: any;
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

interface ApiTaskResponse {
  code: number;
  message: string;
  data: TaskData;
}

interface ApiTaskListResponse {
  code: number;
  message: string;
  data: TaskData[];
}

export const loginByPassword = (username: string, password: string): Promise<ApiLoginResponse> => {
  return http.post<LoginResponse>('/openapi/v1/user/loginByPassword', {
    username,
    password,
  }) as Promise<ApiLoginResponse>;
};

export const sendChatMessage = (request: ChatCompletionRequest): Promise<any> => {
  return http.post('/openapi/chat/completions', request);
};

export const taskCreate = ({ data }: any): Promise<ApiTaskResponse> => {
  return http.post<TaskData>('/openapi/v2/task/create', data);
};

export const taskUpdate = ({ data }: any): Promise<ApiTaskResponse> => {
  return http.put<TaskData>('/openapi/v2/task/update', data);
};

export const getTaskList = ({ executeId }: { executeId: string }): Promise<ApiTaskListResponse> => {
  return http.get<TaskData[]>(`/openapi/v2/task/list?executeId=${executeId}`);
};

// http://172.30.232.95:23081/openapi/v2/task/list?executeId=123



