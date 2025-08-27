import {
  IonButton,
  IonButtons,
  IonIcon,
  IonMenu,
  IonMenuButton,
  useIonRouter,
  useIonToast,
} from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import React, {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ChatInputArea from '../components/ChatInputArea';
import { chatReq, chatUpload, sendChatMessage } from '../services/api';
import { AndroidStreamEnhancer } from '../utils/android-stream-enhancer';
import './chat.css';
import Taskdemo from './taskdemo';

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
  options?: any[];
  btnAgent?: string;
  searchResults?: any[];
  url?: string;
  imgList?: any[];
}

type Prop = {
  message: Message;
  buttosearch: (option: any, message: any) => void;
};

// 消息渲染组件主体
const MessageItemInner = ({ message, buttosearch }: Prop) => {
  console.log('777777777777777777', message);

  // 处理不同类型的 agent

  const renderMessageByAgent = () => {
    switch (message.agent) {
      case 'planner':
        return <PlannerMessage message={message} />;
      case 'podcast':
        return <PodcastMessage message={message} />;
      case 'coordinator':
        return <CoordinatorMessage message={message} />;
      case 'researcher':
        return <ResearcherMessage message={message} />;
      case 'coder':
        return <CoderMessage message={message} />;
      case 'debug_planner':
        return <LoadMessage message={message} msg={'排障计划正在生成中...'} />;
      case 'debug_answer_analysis':
        return null;
      default:
        return <DefaultMessage message={message} />;
    }
  };

  const parsedUrlHtml = useMemo(
    () => parseMarkdown(message.url || ''),
    [message.url]
  );

  return (message.agent === 'debug_planner' &&
    message.status === 'sent' &&
    message.content &&
    message.content.trim() !== '') ||
    message.agent === 'debug_answer_analysis' ? null : (
    <div
      className={`message-container ${message.isUser ? 'user' : ''}`}
      // style={{
      //   border: "1px solid rgba(255, 255, 255, 0.5)",
      //   borderRadius: "2px 14px 14px 14px"
      // }}
    >
      <div
        className={`message-bubble ${message.isUser ? 'user' : 'bot'} ${
          message.status
        }`}
      >
        <div>
          {message.imgList && message.imgList.length > 0 && (
            <div>
              {message.imgList.map((img: any) => (
                <img src={img.url} alt='img' />
              ))}
            </div>
          )}
        </div>

        {renderMessageByAgent()}

        {message.url && (
          <div dangerouslySetInnerHTML={{ __html: parsedUrlHtml }} />
        )}

        {message.isUser !== true &&
          message.options &&
          message.options.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: message.options.length > 2 ? 'column' : 'row',
                gap: '6px',
                justifyContent: message.options.length > 2 ? '' : 'flex-end',
                marginTop: '10px',
              }}
            >
              {message.options.map((option: any) => (
                <div
                  style={{
                    borderRadius: '10px',
                    height: '30px',

                    minWidth: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden',
                    padding: '0 8px',
                  }}
                  key={option}
                  onClick={e => {
                    e.stopPropagation();
                    buttosearch(option, message);
                  }}
                >
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }}
                  >
                    {option}
                  </span>
                </div>
              ))}
            </div>

            // <div
            //   style={{
            //     display: 'flex',
            //     marginTop: '10px',
            //     justifyContent: 'flex-end',
            //   }}
            // >
            //   <div
            //     onClick={e => {
            //       console.log('确认');
            //       e.stopPropagation();
            //       buttosearch();
            //     }}
            //     style={{
            //       width: '60px',
            //       borderRadius: '10px',
            //       height: '30px',
            //       display: 'flex',
            //       justifyContent: 'center',
            //       alignItems: 'center',
            //       cursor: 'pointer',
            //       border: '1px solid rgba(255, 255, 255, 0.2)',
            //     }}
            //   >
            //     确认
            //   </div>
            //   <div
            //     onClick={e => {
            //       console.log('修改');
            //       e.stopPropagation();
            //     }}
            //     style={{
            //       marginLeft: '10px',
            //       width: '60px',
            //       borderRadius: '10px',
            //       height: '30px',
            //       display: 'flex',
            //       justifyContent: 'center',
            //       alignItems: 'center',
            //       cursor: 'pointer',
            //       border: '1px solid rgba(255, 255, 255, 0.2)',
            //     }}
            //   >
            //     修改
            //   </div>
            // </div>
          )}
      </div>
    </div>
  );
};

// 外层 memo，避免父组件（如输入变化）导致无关消息重渲染
const MessageItem = React.memo(
  MessageItemInner,
  (prevProps, nextProps) => prevProps.message === nextProps.message
);

// 默认消息组件
const DefaultMessage: React.FC<{ message: Message }> = ({ message }) => {
  console.log('test_answer==========', message.content);

  const parsedContent = useMemo(
    () => parseMarkdown(message.content),
    [message.content]
  );

  return (
    <div>
      <div>
        <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
        {/* <div>{message.content}</div> */}
      </div>
    </div>
  );
};

type props1 = {
  message: any;
  msg: string;
};

const LoadMessage = ({ message, msg }: props1) => {
  console.log(
    'LoadMessage 渲染============',
    message.status,
    message.content,
    message.agent
  );

  // 如果是 debug_planner 类型且消息已完成且有内容，返回 null
  if (
    message.agent === 'debug_planner' &&
    message.status === 'sent' &&
    message.content &&
    message.content.trim() !== ''
  ) {
    return null;
  }

  // 如果是 debug_answer_analysis 类型且消息已完成且有内容，返回 null
  if (
    message.agent === 'debug_answer_analysis' &&
    message.status === 'sent' &&
    message.content &&
    message.content.trim() !== ''
  ) {
    return null;
  }

  // 其他情况显示加载提示
  return (
    <div>
      <div>
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
      return { title: '计划', thought: content, steps: [] };
    }
  };

  const plan = parsePlan(message.content);
  const hasMainContent = Boolean(
    message.content && message.content.trim() !== ''
  );
  const isThinking = Boolean(message.reasoningContent && !hasMainContent);

  return (
    <div>
      {/* 推理内容 */}
      <div>
        {message.reasoningContent && (
          <div className='thought-block'>
            <div
              className={`thought-header ${isThinking ? 'thinking' : ''}`}
              onClick={() => setIsThoughtOpen(!isThoughtOpen)}
            >
              <span>💭 深度思考</span>
              {isThinking && (
                <span className='thinking-indicator'>思考中...</span>
              )}
              <span className='toggle-icon'>{isThoughtOpen ? '▼' : '▶'}</span>
            </div>
            {isThoughtOpen && (
              <div className='thought-content'>
                <p>{message.reasoningContent}</p>
              </div>
            )}
          </div>
        )}

        {/* 计划内容 */}
        {hasMainContent && (
          <div className='plan-card'>
            <div className='plan-header'>
              <span className='researcher-title'>
                {plan.title || '深度研究计划'}
              </span>
            </div>
            <div className='plan-content'>
              {/* {plan.thought && <p className="plan-thought">{plan.thought}</p>} */}
              {plan.steps && plan.steps.length > 0 && (
                <ol className='plan-steps'>
                  {plan.steps.map((step: any, index: number) => (
                    <li key={index}>
                      <p style={{ color: 'white' }}>{step.title}</p>
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
      return { title: '播客', audioUrl: '', error: '解析失败' };
    }
  };

  const podcast = parsePodcast(message.content);
  const isGenerating = message.isStreaming;
  const hasError = podcast.error !== undefined;

  return (
    <div>
      <div>
        <div className='podcast-header'>
          <div className='podcast-info'>
            {isGenerating ? (
              <span className='generating'>🎙️ 生成播客中...</span>
            ) : (
              <span className='podcast-icon'>🎧 播客</span>
            )}
            {!hasError && !isGenerating && (
              <a
                href={podcast.audioUrl}
                download={`${podcast.title || 'podcast'}.mp3`}
                className='download-btn'
              >
                📥 下载
              </a>
            )}
          </div>
          <h3 className='podcast-title'>{podcast.title || '播客'}</h3>
        </div>
        <div className='podcast-content'>
          {hasError ? (
            <div className='error-message'>生成播客时出错，请重试。</div>
          ) : podcast.audioUrl ? (
            <audio
              className='podcast-audio'
              src={podcast.audioUrl}
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className='audio-placeholder'>音频加载中...</div>
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
        const stepItems = content.match(
          /"title"\s*:\s*"([^"]*?)".*?"description"\s*:\s*"([^"]*?)"/g
        );
        if (stepItems) {
          steps = stepItems.map((item, index) => {
            const titleMatch = item.match(/"title"\s*:\s*"([^"]*?)"/);
            const descMatch = item.match(/"description"\s*:\s*"([^"]*?)"/);
            return {
              title: titleMatch ? titleMatch[1] : `步骤 ${index + 1}`,
              description: descMatch ? descMatch[1] : '',
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
          description: line.replace(/^\d+\.\s*/, ''),
        }));
      }
    }

    const result = {
      title: title || '深度研究计划',
      thought: thought,
      steps: steps,
    };

    console.log('提取的 planner 数据:', result);
    return JSON.stringify(result);
  }
};

const extractResearcher = (content: string) => {
  const regextitle =
    /"title"\s*:\s*"((?:\\["\\/bfnrt]|\\u[0-9a-fA-F]{4}|[^"\\])*?)"(?=\s*[,}])/;
  const regexcontent =
    /"content"\s*:\s*"((?:\\["\\/bfnrt]|\\u[0-9a-fA-F]{4}|[^"\\])*?)"(?=\s*[,}])/;

  const matchtitle = content.match(regextitle);
  const matchcontent = content.match(regexcontent);

  const data = {
    title: matchtitle && matchtitle[1],
    content: matchcontent && matchcontent[1],
  };

  console.log('extractResearcher=========', matchtitle, matchcontent);

  return JSON.stringify(data);
};

interface PlannerResult {
  title: string;
  steps: any[];
}

// 简单的 Markdown 解析函数
const parseMarkdown = (text: string) => {
  if (!text) return '';

  return (
    text
      // 去除开头和结尾的空白字符
      .trim()
      // 处理分隔线 - 需要在换行处理之前
      .replace(
        /^---+$/gim,
        '<hr style="border: none;height: 1px; background-color: rgba(255, 255, 255, 0.3);" />'
      )
      // 处理标题
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // 处理粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 处理斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 处理代码块
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="markdown-code"><code>$1</code></pre>'
      )
      // 处理行内代码
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // 处理超链接 - 排除图片格式（以!开头的）
      .replace(
        /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="solution-link">$1</a>'
      )
      // 处理图片
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        // 检查是否为视频链接
        if (
          alt.toLowerCase() === 'video' ||
          src.match(/\.(mp4|webm|ogg|mov|avi)$/i)
        ) {
          // 提取时间戳信息
          const timeMatch = src.match(/#t=([^)]+)$/);
          const timeParam = timeMatch ? timeMatch[1] : '';
          const videoSrc = src;

          console.log('videoSrc=================', videoSrc, timeMatch);

          return `<video controls style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;">
              <source src="${videoSrc}" type="video/mp4">
              您的浏览器不支持视频播放。
            </video>`;
        } else {
          // 普通图片处理
          return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" />`;
        }
      })
      // 处理列表
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      // 处理换行
      .replace(/\n/g, '<br/>')
  );
};

// Coordinator 消息组件
const CoordinatorMessage: React.FC<{ message: Message }> = ({ message }) => {
  // const supplementReply = extractSupplementReply(message.content);
  // console.log("supplementReply===========", supplementReply);

  // 解析 markdown 格式
  console.log('parseMarkdown222=========', message.content);

  // 判断是否正在流式输出
  const isStreaming = message.isStreaming || message.status === 'sending';

  // 如果正在流式输出，直接显示原始内容
  if (isStreaming) {
    return (
      <div>
        <div>
          <div className='coordinator-header'>
            {/* <span className="coordinator-icon">🤖</span> */}
            <span className='coordinator-title'>协调专家</span>
          </div>
          <div className='coordinator-content'>
            <div>{message.content}</div>
          </div>
        </div>
      </div>
    );
  }

  // 数据完整后，解析并显示格式化内容（memo 缓存）
  const parsedContent = useMemo(() => {
    try {
      const parsedContentbofore = JSON.parse(`"${message.content}"`)
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t');
      return parseMarkdown(parsedContentbofore);
    } catch (error) {
      console.error('解析内容失败:', error);
      return '';
    }
  }, [message.content]);

  console.log('parseMarkdown=========', parsedContent);

  return (
    <div>
      <div>
        <div className='coordinator-header'>
          {/* <span className="coordinator-icon">🤖</span> */}
          <span className='coordinator-title'>协调专家</span>
        </div>
        <div className='coordinator-content'>
          {parsedContent ? (
            <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
          ) : (
            <div>{message.content}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Researcher 消息组件
const ResearcherMessage: React.FC<{ message: Message }> = ({ message }) => {
  console.log('researchermessage========', message);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    console.log('message.dataId==================', message.dataId);
    if (message.dataId) {
      setIsCollapsed(true);
    }
  }, [message.dataId]);

  // 监听流式输出完成状态，自动收起盒子
  useEffect(() => {
    // 当消息状态为 'sent' 且不再流式输出时，自动收起盒子
    if (message.status === 'sent' && !message.isStreaming && message.dataId) {
      console.log('Researcher 流式输出完成，自动收起盒子', message.dataId);
      setIsCollapsed(true);
    }
  }, [message.status, message.isStreaming, message.dataId]);

  const parsedContent = useMemo(
    () => parseMarkdown(message.content),
    [message.content]
  );

  return (
    <div>
      <div>
        <div
          className='researcher-header'
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ cursor: 'pointer', userSelect: 'none', width: '100%' }}
        >
          {/* <span className="researcher-title">研究专家</span> */}
          <div
            style={{
              marginTop: '6px',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '16px',
            }}
          >
            {message.content}
          </div>
          <span style={{ marginLeft: '8px', fontSize: '12px', opacity: 0.7 }}>
            {isCollapsed ? '▶' : '▼'}
          </span>
        </div>

        <div className='researcher-content'>
          {!isCollapsed && (
            <div
              style={{ marginTop: '6px' }}
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Coder 消息组件
const CoderMessage: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div>
      <div>
        <div className='coder-header'>
          <span className='coder-icon'>💻</span>
          <span className='coder-title'>代码专家</span>
        </div>
        <div className='coder-content'>
          <pre className='code-block'>
            <code>{message.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const [showInputType, setShowInputType] = useState(4);
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
  const currentInputRef = useRef('');
  const chatid = useRef('');
  const [isbtn, setisbtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [showtag, setShowtag] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [type, setType] = useState('1');
  const [type2, setType2] = useState('1');
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; name: string; id: string }>
  >([]);

  const router = useIonRouter();

  const [hello, setHello] = useState('');

  // 接收URL参数
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sectionId = searchParams.get('name');
    const itemId = searchParams.get('id');
    const taskType = searchParams.get('taskType');
    setSectionName(sectionId || '');

    if (taskType == '1') {
      setShowInputType(1);
    }

    console.log('接收到的URL参数:', {
      sectionId,
      itemId,
      taskType,
    });
  }, []);

  useEffect(() => {
    chatid.current = generateRandomString(8);
  }, []);

  const buttosearch = (option: any, message: any) => {
    console.log('buttosearchoption==============', option, message);
    // setInputValue("ok")
    if (option == '修改' || option.includes('其他')) {
      setShowtag(true);
    } else {
      if (
        message.btnAgent &&
        message.btnAgent.startsWith('summary_human_feedback')
      ) {
        upload(message.content);
      } else {
        sendMessage(option);
        // upload(message.content);
      }
    }
  };

  const upload = async (message: any) => {
    try {
      const response = await chatUpload({ text: message });
      console.log('uploadresponse==============', response);
    } catch (err) {
      console.log('上传失败');
    }
  };

  // 滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 生成随机 chatId：时间戳 + 随机字符串
  const generateRandomString = (length: number) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const demoList = [
    {
      id: 1,
      name: '对话历史1',
    },
    {
      id: 2,
      name: '对话历史2',
    },
    {
      id: 3,
      name: '对话历史3',
    },
  ];

  // useEffect(() => {
  //   initLogin();
  // }, []);

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const initLogin = async () => {
  //   try {
  //     const response = await loginByPassword('root', '53e880894f3cc53d5071c679f1afcd223a3faca09148c6898da13f0afc3535ad');
  //     localStorage.setItem('token', response.data.token)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
    console.log('messages========', messages);
  }, [messages]);

  const sendMessage = async (iptvalue: any) => {
    setShowtag(false);
    if (!iptvalue.trim()) return;

    // 如果AI正在响应，阻止发送新消息
    if (isAIResponding) {
      present({
        message: 'AI正在输出中，请稍候...',
        duration: 2000,
        position: 'top',
        color: 'warning',
      });
      return;
    }

    const timestamp = Date.now();
    const randomString = chatid.current;
    const chatId = `${randomString}123`;

    if (variablesFeedback == false) {
      currentInputRef.current = iptvalue;
    }

    console.log(
      'currentInputRef.current===============',
      currentInputRef.current
    );

    const messagebody: chatReq = {
      payload: {
        messages: [
          {
            dataId: chatId + 456,
            role: 'user',
            // content: iptvalue,
            content: [
              {
                type: 'text',
                text: iptvalue,
              },
              ...uploadedImages.map(image => ({
                type: 'image_url',
                image_url: {
                  url: image.url,
                },
              })),
            ],
          },
        ],
        variables: {
          // feedback: variablesFeedback,
          feedback: {
            content: variablesFeedback ? iptvalue : '',
            image_url: uploadedImages.map(image => ({
              url: image.url,
            })),
          },
          internet_search: true,
          quote_enable: true,
          enable_graphKB: type2,
        },
        responseChatItemId: 'b1jmtV7hdBHokPUT2jzQwAwJ',
        // shareId: '6e6q0y0lnlw9t247jl2y9fbi',
        shareId:
          type == '1' ? 'iuj6er9dbwlvfyvmrtxdg9em' : 'zybc1bm3xzt6u3uccoxttyp6',

        chatId: chatId,
        appType: 'advanced',
        outLinkUid: 'shareChat-1754533192615-v8Ejm6GhhxpNhjhk9w_ZGzNR',
        detail: true,
        stream: true,
        finish_reason_type: 0,
      },
      type: type,
    };

    // 创建用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      dataId: 'f3ours7VSQVJRGENhmJGw7',
      role: 'user',
      content: iptvalue,
      isUser: true,
      status: 'sending',
      imgList: uploadedImages,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // 设置AI正在响应状态
    setIsAIResponding(true);

    console.log('调用接口前');

    try {
      const response = await sendChatMessage(messagebody);

      setUploadedImages([]);

      if (!response.body) {
        throw new Error('无法读取响应流');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // 更新用户消息状态为已发送
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );

      // 用于跟踪不同 agent 的消息
      const agentMessages = new Map<string, string>();
      // 用于跟踪不同 researcher agent 的消息
      const researcherMessages = new Map<string, string>();
      let buffer = '';
      console.log('开始流式数据读取');

      // 检测是否为Android环境
      const isAndroid = AndroidStreamEnhancer.isAndroidEnvironment();
      let chunkCount = 0;
      let totalEvents = 0;
      const startTime = Date.now();

      while (reader) {
        chunkCount++;
        console.log(`第${chunkCount}次读取数据`);

        const { done, value } = await reader.read();
        console.log('done=========', done, 'value长度:', value?.length);

        if (done) {
          console.log(`流式读取完成，总共读取${chunkCount}次`);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log(
          `第${chunkCount}次chunk数据 (长度: ${chunk.length}):`,
          chunk.length > 200 ? chunk.substring(0, 200) + '...' : chunk
        );

        // 将新数据添加到缓冲区

        // 解析 chunk 中的事件 - 支持多个事件
        try {
          // 使用正则表达式分割多个事件
          const events = chunk.split(/(?=event: )/);

          console.log(`处理${events.length}个事件 (Android环境: ${isAndroid})`);
          totalEvents += events.length;

          for (let i = 0; i < events.length; i++) {
            const eventChunk = events[i];
            if (!eventChunk.trim()) continue;

            // 使用Android流式增强器处理延迟
            await AndroidStreamEnhancer.handleEventDelay(i, events.length);

            const eventMatch = eventChunk.match(/event: (\w+)/);

            if (eventMatch) {
              const eventType = eventMatch[1];
              console.log(
                `处理事件类型: ${eventType} (${i + 1}/${events.length})`
              );

              if (eventType == 'fastAnswer') {
                const dataMatch = eventChunk.match(/data: (.+)/);
                console.log('fastAnswer==========', dataMatch);
                if (dataMatch) {
                  const jsonStr = dataMatch[1].trim();
                  console.log('event type2===============', jsonStr);
                  if (jsonStr) {
                    const data = JSON.parse(jsonStr);
                    console.log('fastAnswer data=========', data);
                    const answerContent = data.choices[0].delta.content;
                    console.log('answerContent=========', answerContent);
                    setMessages(prev => {
                      const newMessages = [...prev];
                      newMessages[newMessages.length - 1] = {
                        ...newMessages[newMessages.length - 1],
                        url: answerContent,
                      };
                      return newMessages;
                    });
                  }
                }
              }

              if (eventType == 'answer') {
                // 解析 answer 类型的数据流
                const dataMatch = eventChunk.match(/data: (.+)/);

                console.log('event type1==========', dataMatch);
                if (dataMatch) {
                  const jsonStr = dataMatch[1].trim();
                  console.log('event type2===============', jsonStr);

                  if (jsonStr && jsonStr !== '[DONE]') {
                    try {
                      const data = JSON.parse(jsonStr);
                      // 这里可以根据需要处理 answer 数据
                      // 例如：将 assistant 的内容追加到消息流
                      if (
                        data.choices &&
                        data.choices[0] &&
                        data.choices[0].delta &&
                        typeof data.choices[0].delta.content === 'string'
                      ) {
                        const answerContent = data.choices[0].delta.content;
                        console.log('answerContent=========', answerContent);

                        // 假设 answer 属于 agent: 'default'
                        const currentContent =
                          agentMessages.get('default') || '';
                        const newContent = currentContent + answerContent;
                        agentMessages.set('default', newContent);

                        setMessages(prev => {
                          // 查找现有的 default agent 消息
                          const existingMessageIndex = prev.findIndex(
                            msg =>
                              !msg.isUser &&
                              msg.agent === 'default' &&
                              msg.status === 'sending'
                          );

                          if (existingMessageIndex !== -1) {
                            // 更新现有消息
                            const newMessages = [...prev];
                            newMessages[existingMessageIndex] = {
                              ...newMessages[existingMessageIndex],
                              content: newContent,
                              reasoningContent: data.reasoningContent,
                            };
                            return newMessages;
                          } else {
                            // 创建新的消息
                            const newmessage: Message = {
                              id:
                                Date.now().toString() +
                                Math.random().toString(36).substr(2, 9),
                              dataId: data.id || '',
                              role: 'assistant',
                              content: newContent,
                              isUser: false,
                              status: 'sending',
                              agent: 'default',
                              reasoningContent: data.reasoningContent,
                              isStreaming: true,
                            };
                            return [...prev, newmessage];
                          }
                        });
                      }
                    } catch (e) {
                      console.warn('解析 answer 数据失败', e);
                    }
                  }
                }
              }

              // 只处理 message 类型的事件
              if (eventType === 'message_chunk') {
                const dataMatch = eventChunk.match(/data: (.+)/);
                if (dataMatch) {
                  const jsonStr = dataMatch[1].trim();
                  if (jsonStr && jsonStr !== '[DONE]') {
                    const data = JSON.parse(jsonStr);
                    console.log('message data=========', data);
                    console.log('agent===========', data.agent);

                    if (data.content) {
                      const content = data.content;
                      const agent = data.agent || 'default';

                      let researcherAgentid = '';

                      if (agent == 'researcher') {
                        researcherAgentid = data.id;
                      }

                      // 更新 agent 消息内容
                      if (agent === 'researcher') {
                        // 对于 researcher，使用 researcherAgentid 作为 key
                        const currentContent =
                          researcherMessages.get(researcherAgentid) || '';
                        console.log(
                          'currentContent===========',
                          currentContent
                        );

                        researcherMessages.set(
                          researcherAgentid,
                          currentContent + content
                        );
                      } else {
                        // 其他 agent 使用原来的逻辑
                        const currentContent = agentMessages.get(agent) || '';
                        agentMessages.set(agent, currentContent + content);
                      }

                      setMessages(prev => {
                        // 对于 researcher agent，需要根据 researcherAgentid 查找现有消息
                        let existingMessageIndex = -1;

                        if (agent === 'researcher') {
                          // 查找具有相同 researcherAgentid 的消息
                          existingMessageIndex = prev.findIndex(
                            msg =>
                              !msg.isUser &&
                              msg.agent === agent &&
                              msg.status === 'sending' &&
                              msg.dataId === researcherAgentid
                          );
                        } else {
                          // 其他 agent 使用原来的逻辑
                          existingMessageIndex = prev.findIndex(
                            msg =>
                              !msg.isUser &&
                              msg.agent === agent &&
                              msg.status === 'sending'
                          );
                        }

                        if (existingMessageIndex !== -1) {
                          // 更新现有消息
                          let filterdata = null;
                          if (agent == 'coordinator') {
                            filterdata = extractSupplementReply(
                              agentMessages.get(agent) || ''
                            );
                            // filterdata = agentMessages.get(agent) || ""
                            console.log(
                              '555555555555=========',
                              agentMessages.get(agent),
                              filterdata
                            );
                          } else if (agent == 'planner') {
                            // extractPlanner
                            filterdata = extractPlanner(
                              agentMessages.get(agent) || ''
                            );
                            // filterdata = agentMessages.get(agent) || ""
                          } else if (agent == 'researcher') {
                            // filterdata = extractResearcher(researcherMessages.get(researcherAgentid) || "")
                            console.log(
                              'currentContent===========',
                              researcherMessages.get(researcherAgentid)
                            );
                            // console.log("currentContent111===========", filterdata);
                            filterdata =
                              researcherMessages.get(researcherAgentid) || '';
                          } else {
                            filterdata = agentMessages.get(agent) || '';
                          }
                          console.log('agentMessages.get(agent)===========');

                          const newMessages = [...prev];
                          newMessages[existingMessageIndex] = {
                            ...newMessages[existingMessageIndex],
                            content: filterdata || '',
                            reasoningContent:
                              data.reasoningContent ||
                              newMessages[existingMessageIndex]
                                .reasoningContent,
                          };
                          return newMessages;
                        } else {
                          // 创建新的 agent 消息
                          const newMessageId =
                            Date.now() +
                            Math.random().toString(36).substr(2, 9);
                          const newMessage: Message = {
                            id: newMessageId,
                            dataId:
                              agent === 'researcher'
                                ? researcherAgentid
                                : data.id || '',
                            role: 'assistant',
                            content:
                              agent === 'researcher'
                                ? researcherMessages.get(researcherAgentid) ||
                                  ''
                                : agentMessages.get(agent) || '',
                            isUser: false,
                            status: 'sending',
                            agent: agent,
                            reasoningContent: data.reasoningContent,
                            isStreaming: true,
                          };
                          return [...prev, newMessage];
                        }
                      });
                    }
                  }
                }
              } else if (eventType == 'interrupt') {
                console.log('收到 interrupt 事件，暂不处理');
                // interrupt 事件暂不处理
                const dataMatch = eventChunk.match(/data: (.+)/);

                if (dataMatch) {
                  const jsonStr = dataMatch[1].trim();
                  if (jsonStr && jsonStr !== '[DONE]') {
                    const data = JSON.parse(jsonStr);
                    console.log('interruptdata============', data);
                    const btnOption = data.options;
                    const btnAgent = data.id;
                    setMessages(prev => {
                      const newMessages = [...prev];
                      if (newMessages.length > 0) {
                        const lastMessage = newMessages[newMessages.length - 1];
                        if (!lastMessage.isUser) {
                          newMessages[newMessages.length - 1] = {
                            ...lastMessage,
                            options: btnOption,
                            btnAgent: btnAgent,
                          };
                        }
                      }
                      return newMessages;
                    });

                    // if (data.id) {
                    //   const isMatch =
                    //     /^repeat_human_feedback:/.test(data.id) ||
                    //     /^human_feedback:/.test(data.id) ||
                    //     /^summary_human_feedback:/.test(data.id);

                    //   console.log('isMatch===============', isMatch);
                    //   setisbtn(isMatch);

                    //   // 将isMatch状态添加到最新的消息中
                    //   setMessages(prev => {
                    //     const newMessages = [...prev];
                    //     if (newMessages.length > 0) {
                    //       const lastMessage =
                    //         newMessages[newMessages.length - 1];
                    //       if (!lastMessage.isUser) {
                    //         newMessages[newMessages.length - 1] = {
                    //           ...lastMessage,
                    //           isMatch: isMatch,
                    //         };
                    //       }
                    //     }
                    //     return newMessages;
                    //   });
                    // }

                    if (data.finish_reason == 'interrupt') {
                      console.log('发送===========');
                      setVariablesFeedback(true);
                    }
                  }
                }
              } else if (eventType == 'flowResponses') {
                console.log('收到 flowResponses 事件');
                const dataMatch = eventChunk.match(/data: (.+)/);

                if (dataMatch) {
                  const jsonStr = dataMatch[1].trim();
                  if (jsonStr && jsonStr !== '[DONE]') {
                    try {
                      const data = JSON.parse(jsonStr);
                      console.log('flowResponses data=========', data);

                      // 处理知识库搜索结果
                      if (data && Array.isArray(data)) {
                        data.forEach((response: any) => {
                          if (
                            response.moduleType === 'datasetSearchNode' &&
                            response.quoteList
                          ) {
                            console.log('知识库搜索结果:', response.quoteList);

                            // 将搜索结果添加到当前消息中
                            setMessages(prev => {
                              const newMessages = [...prev];
                              if (newMessages.length > 0) {
                                const lastMessage =
                                  newMessages[newMessages.length - 1];
                                if (!lastMessage.isUser) {
                                  // 将搜索结果添加到消息中
                                  newMessages[newMessages.length - 1] = {
                                    ...lastMessage,
                                    searchResults: response.quoteList,
                                  };
                                }
                              }
                              return newMessages;
                            });
                          }
                        });
                      }
                    } catch (e) {
                      console.warn('解析 flowResponses 数据失败', e);
                    }
                  }
                }
              } else if (eventType == 'flowNodeStatus') {
                console.log('收到 flowNodeStatus 事件');
                const dataMatch = eventChunk.match(/data: (.+)/);

                if (dataMatch) {
                  const jsonStr = dataMatch[1].trim();
                  if (jsonStr && jsonStr !== '[DONE]') {
                    try {
                      const data = JSON.parse(jsonStr);
                      console.log('flowNodeStatus data=========', data);

                      // 可以在这里处理节点状态更新
                      // 例如：显示当前正在执行的节点名称
                      if (data.status && data.name) {
                        console.log(`节点状态: ${data.name} - ${data.status}`);
                        // 可以根据需要更新UI显示当前执行的节点
                      }
                    } catch (e) {
                      console.warn('解析 flowNodeStatus 数据失败', e);
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

      // 记录Android环境下的流式处理统计信息
      const processingTime = Date.now() - startTime;
      AndroidStreamEnhancer.logStreamingStats(
        chunkCount,
        totalEvents,
        processingTime
      );

      // 完成后更新所有正在发送的消息状态
      setMessages(prev =>
        prev.map(msg =>
          !msg.isUser && msg.status === 'sending'
            ? { ...msg, status: 'sent', isStreaming: false }
            : msg
        )
      );

      // AI响应完成，重置状态
      setIsAIResponding(false);
    } catch (error: any) {
      // 更新消息状态为错误
      setMessages(prev =>
        prev.map(msg =>
          msg.id === userMessage.id || msg.id === currentBotMessageId.current
            ? { ...msg, status: 'error' }
            : msg
        )
      );

      // AI响应出错，重置状态
      setIsAIResponding(false);

      present({
        message: error.message || '发送失败，请重试',
        duration: 2000,
        position: 'top',
        color: 'danger',
      });
    }
  };

  const histotyitemFn = (item: any) => {
    console.log(item);
    setSelecthisItem(item);
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <IonMenu
        className='menubg'
        menuId='second-menu'
        contentId='main2-content'
      >
        <div className='history-menu'>
          <div className='history-menu-title'>对话历史</div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginTop: '20px',
            }}
          >
            {demoList.map(item => {
              return (
                <div
                  onClick={() => {
                    histotyitemFn(item);
                  }}
                  key={item.id}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>
      </IonMenu>
      <div className='body-container' id='main2-content'>
        <div className='header-content'>
          <div className='user-info'>
            <IonIcon icon={personCircle} className='user-avatar' />
            <div>
              <span className='user-title'>{hello}</span>
              <span className='user-subtitle'>资深技术专家</span>
            </div>
          </div>
          <IonButtons slot='end'>
            <IonMenuButton menu='second-menu'>
              <img
                src='/assets/icon/History.svg'
                alt='历史'
                style={{
                  width: '20px',
                  height: '20px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </IonMenuButton>

            <IonButton>
              <img
                src='/assets/icon/add.svg'
                alt='添加'
                style={{
                  width: '20px',
                  height: '20px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </IonButton>
          </IonButtons>
        </div>

        {sectionName && (
          <div
            style={{
              width: '100%',
              height: '80px',
              // border: '1px solid red',
              position: 'absolute',
              top: '26px',
              left: '0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0 0 16px 16px',
              color: '#fff',
              display: 'flex',
              alignItems: 'end',
              padding: '0 16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '40px',
                width: '100%',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '30px',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF1A',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  任务
                </div>

                <div style={{ fontSize: '14px ', fontWeight: 'bold' }}>
                  {sectionName}
                </div>
              </div>

              <div
                style={{
                  width: '60px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF1A',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => {
                  console.log('返回上一个页面=============');
                  router.back();
                  // history.back();
                  setSectionName('');
                  // 回到上一个页面
                }}
              >
                {'返回 >'}
              </div>
            </div>
          </div>
        )}

        <div
          className='chatbody'
          style={{
            paddingTop: sectionName ? '40px' : '0',
          }}
          onClick={e => {
            e.stopPropagation();
            if (!isAIResponding) setShowInputType(0);
          }}
        >
          {showInputType == 4 ? (
            <Taskdemo />
          ) : messages.length === 0 ? (
            <div className='welcome-container'>
              <div className='welcome-circle'></div>
              <h2 className='welcome-text'>Hi, 老王</h2>
              <p className='welcome-subtitle'>欢迎您的到来，今日请事顺利</p>
            </div>
          ) : (
            <div
              className='messages-container'
              style={{
                height: 'calc(100% - 20px)',
                overflowY: 'auto',
                padding: '8px 16px',
              }}
            >
              {messages.map(message => (
                <MessageItem
                  key={message.id}
                  message={message}
                  buttosearch={buttosearch}
                />
              ))}
              {isAIResponding && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #fff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '10px',
                    }}
                  ></div>
                  AI正在思考中...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div
          style={{
            position: 'fixed',
            bottom: '40px',
            left: 0,
            right: 0,
            zIndex: '100',
          }}
        >
          {(showInputType == 1 || showInputType == 2) && (
            <div
              style={{
                color: '#fff',
                padding: '0 36px',
                display: 'flex',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '15px',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: type == '1' ? '#3A3C61' : '',
                }}
                onClick={() => {
                  if (type == '1') {
                    setType('0');
                  } else {
                    setType('1');
                  }
                }}
              >
                排障模式
              </div>
              <div
                style={{
                  width: '80px',
                  height: '30px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '15px',
                  fontSize: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: type2 == '1' ? '#3A3C61' : '',
                }}
                onClick={() => {
                  if (type2 == '1') {
                    setType2('0');
                  } else {
                    setType2('1');
                  }
                }}
              >
                知识图谱
              </div>
            </div>
          )}

          <ChatInputArea
            showInputType={showInputType}
            inputValue={inputValue}
            isAIResponding={isAIResponding}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSendMessage={sendMessage}
            onSetShowInputType={setShowInputType}
            showtag={showtag}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
function presentToast(arg0: {
  message: string;
  duration: number;
  position: string;
}) {
  throw new Error('Function not implemented.');
}
