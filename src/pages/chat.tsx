import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  IonMenu,
  IonMenuButton,
  IonPage,
  IonPopover,
  useIonToast
} from '@ionic/react';
import {
  personCircle
} from 'ionicons/icons';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChatCompletionRequest, loginByPassword, sendChatMessage } from '../services/api';
import './chat.css';


interface StreamEvent {
  event: string;
  data: string;
}

interface Message {
  id: string;
  dataId: string;
  role: string;
  content: string;
  isUser: boolean;
  status?: 'sending' | 'sent' | 'error';
  agent?: string;
  reasoningContent?: string;
  isStreaming?: boolean;
  isMatch?: boolean;
}

type Prop = {
  message: Message,
  buttosearch: () => void
}

// 消息渲染组件
const MessageItem = ({ message, buttosearch }: Prop) => {
  console.log("123456", message);

  // 处理不同类型的 agent

  const renderMessageByAgent = () => {
    switch (message.agent) {
      case "planner":
        return <PlannerMessage message={message} />;
      case "podcast":
        return <PodcastMessage message={message} />;
      case "coordinator":
        return <CoordinatorMessage message={message} />;
      case "researcher":
        return <ResearcherMessage message={message} />;
      case "coder":
        return <CoderMessage message={message} />;
      case "debug_planner":
        return <LoadMessage message={message} msg={"排障计划正在生成中..."} />;
      case "debug_answer_analysis":
        return null;
      default:
        return <DefaultMessage message={message} />;
    }
  };

  return (

    (message.agent === 'debug_planner' && message.status === 'sent' && message.content && message.content.trim() !== '') || (message.agent === 'debug_answer_analysis') ? null :

      <div
        className={`message-container ${message.isUser ? 'user' : ''}`}
      // style={{
      //   border: "1px solid rgba(255, 255, 255, 0.5)",
      //   borderRadius: "2px 14px 14px 14px"
      // }}
      >
        <div className={`message-bubble ${message.isUser ? 'user' : 'bot'} ${message.status}`}>
          {renderMessageByAgent()}
          {message.isUser !== true && message.isMatch && (<div style={{ display: "flex", marginTop: "10px", justifyContent: "flex-end" }}>
            <div onClick={(e) => {
              console.log("确认");
              e.stopPropagation();
              buttosearch()
            }} style={{ width: "60px", borderRadius: "10px", height: "30px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", border: "1px solid rgba(255, 255, 255, 0.2)" }}>确认</div>
            <div onClick={(e) => {
              console.log("修改");
              e.stopPropagation();

            }} style={{ marginLeft: "10px", width: "60px", borderRadius: "10px", height: "30px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", border: "1px solid rgba(255, 255, 255, 0.2)" }}>修改</div>
          </div>)
          }
        </div>
      </div>
  )
};

// 默认消息组件
const DefaultMessage: React.FC<{ message: Message }> = ({ message }) => {
  console.log("渲染============");

  const parsedContent = parseMarkdown(message.content);
  return (
    <div >
      <div >
        <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
      </div>
    </div>
  );
};

type props1 = {
  message: any;
  msg: string
}

const LoadMessage = ({ message, msg }: props1) => {
  console.log("LoadMessage 渲染============", message.status, message.content, message.agent);

  // 如果是 debug_planner 类型且消息已完成且有内容，返回 null
  if (message.agent === 'debug_planner' && message.status === 'sent' && message.content && message.content.trim() !== '') {
    return null;
  }

  // 如果是 debug_answer_analysis 类型且消息已完成且有内容，返回 null
  if (message.agent === 'debug_answer_analysis' && message.status === 'sent' && message.content && message.content.trim() !== '') {
    return null;
  }

  // 其他情况显示加载提示
  return (
    <div >
      <div >
        <div>{msg}</div>
      </div>
    </div>
  );
};

// Planner 消息组件
const PlannerMessage: React.FC<{ message: Message }> = ({ message }) => {
  const [isThoughtOpen, setIsThoughtOpen] = useState(false);

  // 解析计划内容
  const parsePlan = (content: string) => {
    try {
      return JSON.parse(content);
    } catch {
      return { title: "计划", thought: content, steps: [] };
    }
  };

  const plan = parsePlan(message.content);
  const hasMainContent = Boolean(message.content && message.content.trim() !== "");
  const isThinking = Boolean(message.reasoningContent && !hasMainContent);

  return (
    <div >
      {/* 推理内容 */}
      <div >
        {message.reasoningContent && (
          <div className="thought-block">
            <div
              className={`thought-header ${isThinking ? 'thinking' : ''}`}
              onClick={() => setIsThoughtOpen(!isThoughtOpen)}
            >
              <span>💭 深度思考</span>
              {isThinking && <span className="thinking-indicator">思考中...</span>}
              <span className="toggle-icon">{isThoughtOpen ? '▼' : '▶'}</span>
            </div>
            {isThoughtOpen && (
              <div className="thought-content">
                <p>{message.reasoningContent}</p>
              </div>
            )}
          </div>
        )}

        {/* 计划内容 */}
        {hasMainContent && (
          <div className="plan-card">
            <div className="plan-header">
              <span className="researcher-title">{plan.title || "深度研究计划"}</span>
            </div>
            <div className="plan-content">
              {/* {plan.thought && <p className="plan-thought">{plan.thought}</p>} */}
              {plan.steps && plan.steps.length > 0 && (
                <ol className="plan-steps">
                  {plan.steps.map((step: any, index: number) => (
                    <li key={index}>
                      <p style={{ color: "white" }}>{step.title}</p>
                      {/* <p>{step.description}</p> */}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

// Podcast 消息组件
const PodcastMessage: React.FC<{ message: Message }> = ({ message }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const parsePodcast = (content: string) => {
    try {
      return JSON.parse(content);
    } catch {
      return { title: "播客", audioUrl: "", error: "解析失败" };
    }
  };

  const podcast = parsePodcast(message.content);
  const isGenerating = message.isStreaming;
  const hasError = podcast.error !== undefined;

  return (
    <div >
      <div >
        <div className="podcast-header">
          <div className="podcast-info">
            {isGenerating ? (
              <span className="generating">🎙️ 生成播客中...</span>
            ) : (
              <span className="podcast-icon">🎧 播客</span>
            )}
            {!hasError && !isGenerating && (
              <a
                href={podcast.audioUrl}
                download={`${podcast.title || 'podcast'}.mp3`}
                className="download-btn"
              >
                📥 下载
              </a>
            )}
          </div>
          <h3 className="podcast-title">{podcast.title || "播客"}</h3>
        </div>
        <div className="podcast-content">
          {hasError ? (
            <div className="error-message">生成播客时出错，请重试。</div>
          ) : podcast.audioUrl ? (
            <audio
              className="podcast-audio"
              src={podcast.audioUrl}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="audio-placeholder">音频加载中...</div>
          )}
        </div>
      </div>
    </div>
  );
};

// 提取 supplement_reply 内容的函数
const extractSupplementReply = (content: string) => {
  // 正则匹配 "supplement_reply": "..." 的值（包括转义字符）
  // const regex = /"supplement_reply"\s*:\s*"([^"]*(?:\\"|[^"])*)"/;
  // const regex = /"supplement_reply"\s*:\s*"((?:\\"|\\n|\\\\.|[^"])*)"/;
  const regex = /"supplement_reply"\s*:\s*"((?:\\"|\\n|\\\\.|[^"])*?)(?:"|$)/;
  const match = content.match(regex);
  return match?.[1] || '';
};
// const extractSupplementReply = (content: string): string => {
//   // 增强版正则表达式，处理以下情况：
//   // 1. 包含转义字符（如 \\", \\n）
//   // 2. 值可能跨多行
//   // 3. 处理 JSON 未闭合的情况
//   const regex = /"supplement_reply"\s*:\s*"((?:\\["\\/bfnrt]|\\u[0-9a-fA-F]{4}|[^"\\])*?)"(?=\s*[,}])/;

//   const match = content.match(regex);


//   if (!match) return '';

//   // 处理转义字符
//   try {
//     return JSON.parse(`"${match[1]}"`)
//       .replace(/\\n/g, '\n')  // 将 \n 转义符转为实际换行
//       .replace(/\\t/g, '\t'); // 处理制表符等其他转义
//   } catch (e) {
//     console.warn('转义字符处理失败，返回原始值', e);
//     return match[1];
//   }
// };

const extractPlanner = (content: string) => {
  try {
    // 首先尝试直接解析为 JSON
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed);
  } catch {
    // 如果直接解析失败，尝试提取部分内容
    let title = '';
    let steps: any[] = [];
    let thought = '';

    // 提取 title
    const titleMatch = content.match(/"title"\s*:\s*"([^"]*?)"/);
    if (titleMatch) {
      title = titleMatch[1];
    }

    // 提取 thought
    const thoughtMatch = content.match(/"thought"\s*:\s*"([^"]*?)"/);
    if (thoughtMatch) {
      thought = thoughtMatch[1];
    }

    // 尝试提取 steps 数组
    const stepsMatch = content.match(/"steps"\s*:\s*(\[[\s\S]*?\])/);
    if (stepsMatch) {
      try {
        steps = JSON.parse(stepsMatch[1]);
      } catch {
        // 如果解析失败，尝试手动构建步骤
        const stepItems = content.match(/"title"\s*:\s*"([^"]*?)".*?"description"\s*:\s*"([^"]*?)"/g);
        if (stepItems) {
          steps = stepItems.map((item, index) => {
            const titleMatch = item.match(/"title"\s*:\s*"([^"]*?)"/);
            const descMatch = item.match(/"description"\s*:\s*"([^"]*?)"/);
            return {
              title: titleMatch ? titleMatch[1] : `步骤 ${index + 1}`,
              description: descMatch ? descMatch[1] : ''
            };
          });
        }
      }
    }

    // 如果没有找到 steps 数组，尝试从文本中提取步骤信息
    if (steps.length === 0) {
      const stepLines = content.match(/\d+\.\s*([^\n]+)/g);
      if (stepLines) {
        steps = stepLines.map((line, index) => ({
          title: `步骤 ${index + 1}`,
          description: line.replace(/^\d+\.\s*/, '')
        }));
      }
    }

    const result = {
      title: title || '深度研究计划',
      thought: thought,
      steps: steps
    };

    console.log("提取的 planner 数据:", result);
    return JSON.stringify(result);
  }
};

const extractResearcher = (content: string) => {
  const regextitle = /"title"\s*:\s*"((?:\\["\\/bfnrt]|\\u[0-9a-fA-F]{4}|[^"\\])*?)"(?=\s*[,}])/;
  const regexcontent = /"content"\s*:\s*"((?:\\["\\/bfnrt]|\\u[0-9a-fA-F]{4}|[^"\\])*?)"(?=\s*[,}])/;


  const matchtitle = content.match(regextitle);
  const matchcontent = content.match(regexcontent);

  const data = {
    title: matchtitle && matchtitle[1],
    content: matchcontent && matchcontent[1],
  }

  console.log("extractResearcher=========", matchtitle, matchcontent);

  return JSON.stringify(data)
};



interface PlannerResult {
  title: string;
  steps: any[];
}


// 简单的 Markdown 解析函数
const parseMarkdown = (text: string) => {
  if (!text) return '';

  return text
    // 处理标题
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 处理粗体
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 处理斜体
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 处理代码块
    .replace(/```([\s\S]*?)```/g, '<pre class="markdown-code"><code>$1</code></pre>')
    // 处理行内代码
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // 处理列表
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    // 处理换行
    .replace(/\n/g, '<br/>');
};

// Coordinator 消息组件
const CoordinatorMessage: React.FC<{ message: Message }> = ({ message }) => {
  // const supplementReply = extractSupplementReply(message.content);
  // console.log("supplementReply===========", supplementReply);

  // 解析 markdown 格式
  console.log("parseMarkdown222=========", message.content);

  // 判断是否正在流式输出
  const isStreaming = message.isStreaming || message.status === 'sending';

  // 如果正在流式输出，直接显示原始内容
  if (isStreaming) {
    return (
      <div >
        <div >
          <div className="coordinator-header">
            {/* <span className="coordinator-icon">🤖</span> */}
            <span className="coordinator-title">协调专家</span>
          </div>
          <div className="coordinator-content">
            <div>{message.content}</div>
          </div>
        </div>
      </div>
    );
  }

  // 数据完整后，解析并显示格式化内容
  let parsedContent = '';
  try {
    const parsedContentbofore = JSON.parse(`"${message.content}"`)
      .replace(/\\n/g, '\n')  // 将 \n 转义符转为实际换行
      .replace(/\\t/g, '\t'); // 处理制表符等其他转义

    parsedContent = parseMarkdown(parsedContentbofore);
  } catch (error) {
    console.error('解析内容失败:', error);
    // 如果解析失败，回退到原始内容
    parsedContent = '';
  }

  console.log("parseMarkdown=========", parsedContent);

  return (
    <div >
      <div >
        <div className="coordinator-header">
          {/* <span className="coordinator-icon">🤖</span> */}
          <span className="coordinator-title">协调专家</span>
        </div>
        <div className="coordinator-content">
          {parsedContent ? <div dangerouslySetInnerHTML={{ __html: parsedContent }} /> : <div>{message.content}</div>}
        </div>
      </div>
    </div>
  );
};

// Researcher 消息组件
const ResearcherMessage: React.FC<{ message: Message }> = ({ message }) => {
  console.log("researchermessage========", message);
  const [isCollapsed, setIsCollapsed] = useState(false);


  useEffect(() => {
    console.log("message.dataId==================", message.dataId);
    if (message.dataId) {
      setIsCollapsed(true);
    }
  }, [message.dataId]);

  const parsedContent = parseMarkdown(message.content);

  return (
    <div >
      <div >
        <div
          className="researcher-header"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ cursor: 'pointer', userSelect: 'none', width: "100%" }}
        >
          {/* <span className="researcher-title">研究专家</span> */}
          <div style={{ marginTop: "6px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", fontSize: "16px" }}  >{message.content}</div>
          <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.7 }}>
            {isCollapsed ? '▶' : '▼'}
          </span>
        </div>


        <div className="researcher-content">
          {
            !isCollapsed && <div style={{ marginTop: "6px" }} dangerouslySetInnerHTML={{ __html: parsedContent }} />
          }
        </div>
      </div>
    </div>
  );
};

// Coder 消息组件
const CoderMessage: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div >
      <div>
        <div className="coder-header">
          <span className="coder-icon">💻</span>
          <span className="coder-title">代码专家</span>
        </div>
        <div className="coder-content">
          <pre className="code-block">
            <code>{message.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const [showInputType, setShowInputType] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [present] = useIonToast();
  const currentBotMessageId = useRef<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const isTouchDevice = useRef(false);
  const [selecthisItem, setSelecthisItem] = useState<any>(null);
  const [variablesFeedback, setVariablesFeedback] = useState<any>(false);
  const currentInputRef = useRef("")
  const chatid = useRef("")
  const [isbtn, setisbtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAIResponding, setIsAIResponding] = useState(false);


  useEffect(() => {
    chatid.current = generateRandomString(8)
  }, [])

  const buttosearch = () => {
    // setInputValue("ok")

    sendMessage("OK")
  }

  // 滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 生成随机 chatId：时间戳 + 随机字符串
  const generateRandomString = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };




  const demoList = [
    {
      id: 1,
      name: '对话历史1'
    },
    {
      id: 2,
      name: '对话历史2'
    },
    {
      id: 3,
      name: '对话历史3'
    }
  ]



  useEffect(() => {
    initLogin();
  }, []);

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initLogin = async () => {
    try {
      const response = await loginByPassword('root', '53e880894f3cc53d5071c679f1afcd223a3faca09148c6898da13f0afc3535ad');
      localStorage.setItem('token', response.data.token)
    } catch (error) {
      console.log(error);
    }
  };

  const toggleInput = () => {
    setShowInputType(1);
  };

  const handleInputChange = (e: CustomEvent) => {
    setInputValue(e.detail.value || '');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      sendMessage(inputValue);
    }
  };

  const handleLongPress = () => {
    // 如果是触摸设备且已经通过触摸事件处理，则跳过
    if (isTouchDevice.current) return;

    setIsRecording(true);
    setRecordingTime(0);

    // 开始计时
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const handleLongPressEnd = () => {
    // 如果是触摸设备且已经通过触摸事件处理，则跳过
    if (isTouchDevice.current) return;

    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    setRecordingTime(0);
    // 这里可以添加发送语音消息的逻辑
  };

  const handleTouchStart = () => {
    isTouchDevice.current = true;
    setIsRecording(true);
    setRecordingTime(0);

    // 开始计时
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const handleTouchEnd = () => {
    isTouchDevice.current = false;
    setIsRecording(false);
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    setRecordingTime(0);
    // 这里可以添加发送语音消息的逻辑
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  useEffect(() => {
    console.log("messages========", messages);

  }, [messages]);

  const sendMessage = async (iptvalue: any) => {
    if (!iptvalue.trim()) return;

    // 如果AI正在响应，阻止发送新消息
    if (isAIResponding) {
      present({
        message: 'AI正在输出中，请稍候...',
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      return;
    }



    const timestamp = Date.now();
    const randomString = chatid.current;
    const chatId = `${randomString}123`;


    if (variablesFeedback == false) {

      currentInputRef.current = iptvalue
    }

    console.log("currentInputRef.current===============", currentInputRef.current);


    const messagebody: ChatCompletionRequest = {
      messages: [{
        dataId: chatId + 456,
        role: "user",
        // content: variablesFeedback ? currentInputRef.current : inputValue
        content: iptvalue
      }],
      variables: {
        // feedback: variablesFeedback,
        feedback: variablesFeedback ? iptvalue : ""
      },
      responseChatItemId: "iwE8mnTwNkOLjnCoZwLcNeA6",
      shareId: "iedjfub8493w7wyvk00fv4rh",
      chatId: chatId,
      appType: "advanced",
      outLinkUid: "shareChat-1753087419979-S1TS4Yh1x1daxImmOkYMxvg",
      detail: true,
      stream: true,
      finish_reason_type: 0
    };

    // 创建用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      dataId: "f3ours7VSQVJRGENhmJGw7",
      role: "user",
      content: iptvalue,
      isUser: true,
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // 设置AI正在响应状态
    setIsAIResponding(true);

    try {
      const response = await sendChatMessage(messagebody);

      console.log(11111111111, response.body);

      if (!response.body) {
        throw new Error('无法读取响应流');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // 更新用户消息状态为已发送
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ));

      // 用于跟踪不同 agent 的消息
      const agentMessages = new Map<string, string>();
      // 用于跟踪不同 researcher agent 的消息
      const researcherMessages = new Map<string, string>();
      let buffer = '';
      console.log(22222);

      while (reader) {
        console.log("执行次数");

        const { done, value } = await reader.read();
        console.log("done=========", done, value);

        if (done) break;

        const chunk = decoder.decode(value, { stream: false });
        console.log("chunk=========", chunk);

        // 将新数据添加到缓冲区


        // 解析 chunk 中的事件 - 支持多个事件
        try {
          // 使用正则表达式分割多个事件
          const events = chunk.split(/(?=event: )/);

          for (const eventChunk of events) {
            if (!eventChunk.trim()) continue;

            const eventMatch = eventChunk.match(/event: (\w+)/);
            console.log("eventMatch================", eventMatch);

            if (eventMatch) {
              const eventType = eventMatch[1];
              console.log("event type=========", eventType);

              // 只处理 message 类型的事件
              if (eventType === 'message_chunk') {
                const dataMatch = eventChunk.match(/data: (.+)/);
                if (dataMatch) {
                  const jsonStr = dataMatch[1].trim();
                  if (jsonStr && jsonStr !== '[DONE]') {
                    const data = JSON.parse(jsonStr);
                    console.log("message data=========", data);
                    console.log("agent===========", data.agent);

                    if (data.content) {
                      const content = data.content;
                      const agent = data.agent || 'default';

                      let researcherAgentid = "";

                      if (agent == "researcher") {
                        researcherAgentid = data.id
                      }

                      console.log("researcherAgentid==============", researcherAgentid);

                      // 更新 agent 消息内容
                      if (agent === "researcher") {
                        // 对于 researcher，使用 researcherAgentid 作为 key
                        const currentContent = researcherMessages.get(researcherAgentid) || '';
                        console.log("currentContent===========", currentContent);

                        researcherMessages.set(researcherAgentid, currentContent + content);
                      } else {
                        // 其他 agent 使用原来的逻辑
                        const currentContent = agentMessages.get(agent) || '';
                        agentMessages.set(agent, currentContent + content);
                      }

                      setMessages(prev => {
                        // 对于 researcher agent，需要根据 researcherAgentid 查找现有消息
                        let existingMessageIndex = -1;

                        if (agent === "researcher") {
                          // 查找具有相同 researcherAgentid 的消息
                          existingMessageIndex = prev.findIndex(msg =>
                            !msg.isUser &&
                            msg.agent === agent &&
                            msg.status === 'sending' &&
                            msg.dataId === researcherAgentid
                          );
                        } else {
                          // 其他 agent 使用原来的逻辑
                          existingMessageIndex = prev.findIndex(msg =>
                            !msg.isUser && msg.agent === agent && msg.status === 'sending'
                          );
                        }

                        if (existingMessageIndex !== -1) {
                          // 更新现有消息
                          let filterdata = null
                          if (agent == "coordinator") {
                            filterdata = extractSupplementReply(agentMessages.get(agent) || "")
                            // filterdata = agentMessages.get(agent) || ""
                            console.log("555555555555=========", agentMessages.get(agent), filterdata);
                          } else if (agent == "planner") {
                            // extractPlanner
                            filterdata = extractPlanner(agentMessages.get(agent) || "")
                            // filterdata = agentMessages.get(agent) || ""
                          } else if (agent == "researcher") {
                            // filterdata = extractResearcher(researcherMessages.get(researcherAgentid) || "")
                            console.log("currentContent===========", researcherMessages.get(researcherAgentid));
                            // console.log("currentContent111===========", filterdata);
                            filterdata = researcherMessages.get(researcherAgentid) || ""
                          }
                          else {
                            filterdata = agentMessages.get(agent) || ""
                          }
                          console.log("agentMessages.get(agent)===========",);

                          const newMessages = [...prev];
                          newMessages[existingMessageIndex] = {
                            ...newMessages[existingMessageIndex],
                            content: filterdata || '',
                            reasoningContent: data.reasoningContent || newMessages[existingMessageIndex].reasoningContent
                          };
                          return newMessages;
                        } else {
                          // 创建新的 agent 消息
                          const newMessageId = Date.now() + Math.random().toString(36).substr(2, 9);
                          const newMessage: Message = {
                            id: newMessageId,
                            dataId: agent === "researcher" ? researcherAgentid : (data.id || ''),
                            role: 'assistant',
                            content: agent === "researcher" ? (researcherMessages.get(researcherAgentid) || '') : (agentMessages.get(agent) || ''),
                            isUser: false,
                            status: 'sending',
                            agent: agent,
                            reasoningContent: data.reasoningContent,
                            isStreaming: true
                          };
                          return [...prev, newMessage];
                        }
                      });
                    }
                  }
                }
              } else if (eventType == 'interrupt') {
                console.log("收到 interrupt 事件，暂不处理");
                // interrupt 事件暂不处理
                const dataMatch = eventChunk.match(/data: (.+)/);

                if (dataMatch) {
                  const jsonStr = dataMatch[1].trim();
                  if (jsonStr && jsonStr !== '[DONE]') {
                    const data = JSON.parse(jsonStr);
                    console.log("interruptdata============", data);

                    if (data.id) {
                      const isMatch = /^repeat_human_feedback:/.test(data.id) || /^human_feedback:/.test(data.id) || /^summary_human_feedback:/.test(data.id);

                      console.log("isMatch===============", isMatch);
                      setisbtn(isMatch);

                      // 将isMatch状态添加到最新的消息中
                      setMessages(prev => {
                        const newMessages = [...prev];
                        if (newMessages.length > 0) {
                          const lastMessage = newMessages[newMessages.length - 1];
                          if (!lastMessage.isUser) {
                            newMessages[newMessages.length - 1] = {
                              ...lastMessage,
                              isMatch: isMatch
                            };
                          }
                        }
                        return newMessages;
                      });
                    }

                    if (data.finish_reason == "interrupt") {
                      console.log("发送===========");
                      setVariablesFeedback(true);
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          console.error('解析响应数据出错:', e, '原始数据:', chunk);
        }
      }

      // 完成后更新所有正在发送的消息状态
      setMessages(prev => prev.map(msg =>
        !msg.isUser && msg.status === 'sending' ? { ...msg, status: 'sent', isStreaming: false } : msg
      ));

      // AI响应完成，重置状态
      setIsAIResponding(false);

    } catch (error: any) {
      // 更新消息状态为错误
      setMessages(prev => prev.map(msg =>
        msg.id === userMessage.id || msg.id === currentBotMessageId.current
          ? { ...msg, status: 'error' }
          : msg
      ));

      // AI响应出错，重置状态
      setIsAIResponding(false);

      present({
        message: error.message || '发送失败，请重试',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
    }
  };

  const histotyitemFn = (item: any) => {
    console.log(item);
    setSelecthisItem(item)
  }


  return (
    <IonPage>
      <IonMenu className='menubg' menuId="second-menu" contentId="main2-content">
        <div className='history-menu' >
          <div className='history-menu-title'>对话历史</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: "20px" }}>
            {demoList.map((item) => {
              return <div onClick={() => { histotyitemFn(item) }} key={item.id}>{item.name}</div>
            })}
          </div>

        </div>
      </IonMenu>
      <div className='body-container' id="main2-content">
        <div className="header-content">
          <div className="user-info">
            <IonIcon icon={personCircle} className="user-avatar" />
            <div>
              <span className="user-title">老王</span>
              <span className="user-subtitle">资深技术专家</span>
            </div>
          </div>
          <IonButtons slot="end">
            <IonMenuButton menu="second-menu">
              <img src="/assets/icon/History.svg" alt="历史" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
            </IonMenuButton>

            <IonButton>
              <img src="/assets/icon/add.svg" alt="添加" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
            </IonButton>
          </IonButtons>
        </div>

        <div className='chatbody' onClick={(e) => {
          e.stopPropagation();
          if (!isAIResponding) setShowInputType(0)
        }}>
          {messages.length === 0 ? (
            <div className="welcome-container">
              <div className="welcome-circle"></div>
              <h2 className="welcome-text">Hi, 老王</h2>
              <p className="welcome-subtitle">欢迎您的到来，今日请事顺利</p>
            </div>
          ) : (
            <div className="messages-container" style={{ height: "calc(100% - 53px)", overflowY: "auto", padding: "8px 16px" }}>
              {messages.map(message => (
                <MessageItem key={message.id} message={message} buttosearch={buttosearch} />
              ))}
              {isAIResponding && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  color: '#fff',
                  fontSize: '14px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #fff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '10px'
                  }}></div>
                  AI正在思考中...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>


        {showInputType === 4 && (
          <div className='flag-container'>
            <div style={{ display: "flex", color: "#fff" }}>
              <div>不锈钢管道系统安装<img src="/assets/icon/clock.svg" alt="" style={{ width: '10px', height: '10px' }} /><span>2-3h</span>
              </div>
              <div>进行中</div>
            </div>
          </div>
        )}



        {showInputType === 1 ? (
          <div className="input-area">
            <div className="input-container">
              <div className="input-wrapper">
                <IonInput
                  label={isAIResponding ? 'AI正在输出中...' : '输入中'}
                  className="chat-input"
                  value={inputValue}
                  onIonInput={handleInputChange}
                  onKeyDown={handleKeyDown}
                  autoFocus={true}
                  disabled={isAIResponding}
                />
              </div>
              <div className="action-buttons">
                <IonButton fill="clear" disabled={isAIResponding}>
                  <img src="/assets/icon/voice.svg" alt="" style={{ width: '32px', height: '32px', opacity: isAIResponding ? 0.5 : 1 }} />
                </IonButton>
                <IonButton fill="clear" disabled={isAIResponding}>
                  <img src="/assets/icon/cam.svg" alt="" style={{ width: '32px', height: '32px', opacity: isAIResponding ? 0.5 : 1 }} />
                </IonButton>
              </div>
            </div>
          </div>
        ) :
          showInputType === 2 ? (
            <div onTouchStart={isAIResponding ? undefined : handleLongPress}
              onTouchEnd={isAIResponding ? undefined : handleLongPressEnd}
              onMouseDown={isAIResponding ? undefined : handleLongPress}
              onMouseUp={isAIResponding ? undefined : handleLongPressEnd}
              onMouseLeave={isAIResponding ? undefined : handleLongPressEnd}
              style={{ opacity: isAIResponding ? 0.5 : 1, pointerEvents: isAIResponding ? 'none' : 'auto' }}>
              {!isRecording ? <div className='voice-input'>
                <div onClick={(e) => {
                  e.stopPropagation();
                  if (!isAIResponding) setShowInputType(1)
                }}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  style={{ opacity: isAIResponding ? 0.5 : 1, pointerEvents: isAIResponding ? 'none' : 'auto' }}>
                  <img src="/assets/icon/keyboard.svg" alt="" style={{ width: '48px', height: '48px' }} />
                </div>
                <div style={{ fontSize: '14px', color: '#F9F9F9' }}>长按说出您的问题</div>
                <div onClick={(e) => {
                  e.stopPropagation();
                  if (!isAIResponding) setShowInputType(0)
                }}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  style={{ opacity: isAIResponding ? 0.5 : 1, pointerEvents: isAIResponding ? 'none' : 'auto' }}>
                  <img src="/assets/icon/delet.svg" alt="" style={{ width: '48px', height: '48px' }} />
                </div>
              </div> : <div className='voice-input2'>
                <div>
                  <img src="/assets/icon/VoiceWave.svg" alt="" style={{ width: '48px', height: '48px' }} />
                </div>
                <div style={{ fontSize: '14px', color: '#F9F9F9' }}>
                  {formatTime(recordingTime)}
                </div>
              </div>}
            </div>

          ) : (
            <div className="footer-buttons">
              <div style={{ opacity: isAIResponding ? 0.5 : 1, pointerEvents: isAIResponding ? 'none' : 'auto' }}>
                <img src="/assets/icon/cam.svg" alt="" style={{ width: '48px', height: '48px' }} />
              </div>
              <div onClick={() => { if (!isAIResponding) setShowInputType(1) }} style={{ opacity: isAIResponding ? 0.5 : 1, pointerEvents: isAIResponding ? 'none' : 'auto' }}>
                <img src="/assets/icon/keyboard.svg" alt="" style={{ width: '48px', height: '48px' }} />
              </div>
              <div onClick={() => { if (!isAIResponding) setShowInputType(2) }} style={{ opacity: isAIResponding ? 0.5 : 1, pointerEvents: isAIResponding ? 'none' : 'auto' }}>
                <img src="/assets/icon/voice.svg" alt="" style={{ width: '48px', height: '48px' }} />
              </div>
              <div id="top-center" onClick={() => { if (!isAIResponding) setShowInputType(4) }} style={{ opacity: isAIResponding ? 0.5 : 1, pointerEvents: isAIResponding ? 'none' : 'auto' }}>
                <img src="/assets/icon/flag.svg" alt="" style={{ width: '48px', height: '48px' }} />
              </div>

              <IonPopover trigger="top-center" side="top" alignment="center">
                <IonContent class="ion-padding">Hello World!</IonContent>
              </IonPopover>
            </div>
          )}
      </div>

    </IonPage>
  );
};

export default Chat;
