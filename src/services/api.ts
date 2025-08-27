import { http } from '../utils/request';

// 导入ApiResponse类型
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

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
  content:
    | string
    | Array<{
        type: string;
        text?: any;
        image_url?: {
          url: string;
        };
      }>;
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

export interface chatReq {
  payload: ChatCompletionRequest;
  type: string;
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

interface UserInfo {
  user_id: string;
  name: string;
  age: string;
  role: string;
  work_experience_years: string;
  experience_level: string;
  primary_domains: string;
  equipment_familiarity: string;
  communication_style: string;
}

export const loginByPassword = (
  username: string,
  password: string
): Promise<ApiLoginResponse> => {
  return http.post<LoginResponse>('/openapi/v1/user/loginByPassword', {
    username,
    password,
  }) as Promise<ApiLoginResponse>;
};

export const sendChatMessage = (request: chatReq): Promise<any> => {
  return http.post('/openapi/v1/v0/chat/completions', request, {
    isStream: true,
  });
};

export const taskCreate = ({ data }: any): Promise<ApiTaskResponse> => {
  return http.post<TaskData>('/openapi/v2/task/create', data);
};

export const taskaiparse = ({ data }: any): Promise<ApiTaskResponse> => {
  return http.post<TaskData>('/openapi/v2/task/ai_parse', data);
};

export const taskUpdate = ({ data }: any): Promise<ApiTaskResponse> => {
  return http.put<TaskData>('/openapi/v2/task/update', data);
};

export const getTaskList = ({
  executeId,
}: {
  executeId: string;
}): Promise<ApiTaskListResponse> => {
  return http.get<TaskData[]>(`/openapi/v2/task/list?executeId=${executeId}`);
};

export const getHealth = (): Promise<ApiTaskListResponse> => {
  return http.get<TaskData[]>(`/openapi/v1/v0/chat/test`);
};

export const chatUpload = (data: any): Promise<ApiTaskListResponse> => {
  return http.post<TaskData[]>(`/openapi/v1/v0/chat/upload`, data);
};

// 文件上传函数
export const uploadFile = (
  file: File,
  shareId: string
): Promise<ApiResponse<{ fileId: string; previewUrl: string }>> => {
  console.log('uploadFile==============', file);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('shareId', shareId);
  console.log('uploadFile==============', formData.get('file'));

  // 不设置Content-Type，让浏览器自动设置multipart/form-data和boundary
  return http.post<{ fileId: string; previewUrl: string }>(
    '/openapi/v1/v0/chat/upload/file',
    formData
  );
};

export const userinfoCreate = ({ data }: any): Promise<ApiTaskResponse> => {
  return http.post<TaskData>('/openapi/v2/user-profile/create', data);
};

export const getFileUrl = (id: string): Promise<ApiTaskResponse> => {
  return http.get<TaskData>(
    `/openapi/v1/dataset/collection?collection_id=${id}`
  );
};

export const getUserInfo = (
  user_id: string
): Promise<ApiResponse<UserInfo>> => {
  return http.get<UserInfo>(`/openapi/v2/user-profile/${user_id}`);
};

export const getChatKnowledgeBaseList = (): Promise<any> => {
  return http.get<TaskData>(`/openapi/v1/v0/chat/knowledge_base_list`);
};

export const updataChat = (data: { chatId: string }): Promise<any> => {
  return http.post<TaskData>('/openapi/v2/sentence_cite/update_chat', data);
};

export const getBriefing = (data: {
  task_id: string;
  fields: string;
}): Promise<ApiTaskResponse> => {
  return http.get<TaskData>(
    `/openapi/v2/task/briefing?task_id=${data.task_id}&fields=${data.fields}`
  );
};
