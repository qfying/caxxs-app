import {
  IonButtons,
  IonIcon,
  IonMenu,
  IonMenuButton,
  useIonRouter,
  useIonToast
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
import { HTTP_URL } from '../config';
import {
  chatReq,
  chatUpload,
  getFileUrl,
  sendChatMessage,
  updataChat
} from '../services/api';
import { useUserStore } from '../stores/userStore';
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
  aboutfile?: any[];
  isoption?: boolean;
  citationchunks?: any[];
}

type Prop = {
  message: Message;
  buttosearch: (option: any, message: any) => void;
};

// 消息渲染组件主体
const MessageItemInner = ({ message, buttosearch }: Prop) => {
  console.log('777777777777777777', message);

  const [isaboutfile, setIsboutfile] = useState('');

  const getFileUrlFn = async (id: string) => {
    console.log('id================', id);
    try {
      const res = await getFileUrl(id);
      const url = HTTP_URL + res.data.file_url;
      window.open(url);
    } catch (error) {
      console.log('error================', error);
    }
  };

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
      case 'convergence_check':
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
    message.agent === 'debug_answer_analysis' ||
    message.agent === 'convergence_check' ? null : (
    <div
      className={`message-container ${message.isUser ? 'user' : ''}`}
    // style={{
    //   border: "1px solid rgba(255, 255, 255, 0.5)",
    //   borderRadius: "2px 14px 14px 14px"
    // }}
    >
      <div
        className={`message-bubble ${message.isUser ? 'user' : 'bot'} ${message.status
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
          <div>
            {renderContentWithHoverNumbers(parsedUrlHtml)}
          </div>
        )}

        {message.isUser !== true &&
          message.options &&
          message.options.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: (message.options?.reduce((sum, opt) => sum + String(opt).length, 0) > 10) ? 'column' : 'row',
                gap: '6px',
                justifyContent: (message.options?.reduce((sum, opt) => sum + String(opt).length, 0) > 10) ? '' : 'flex-end',
                marginTop: '10px',
              }}
            >
              {message.options.map((option: any, index: number) => (

                <div
                  style={{
                  }}
                >

                  <button
                    disabled={message.isoption ? true : false}
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
                      width: "100%",
                      backgroundColor: "transparent",
                      color: message.isoption ? "grey" : "#fff"
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      buttosearch(option, message);
                    }}>
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
                  </button>
                </div>
              ))}
            </div>

          )}

        {message.citationchunks
          && message.citationchunks
            .length > 0 && (
            <div
              style={{
                borderTop: '0.5px solid var(--base-white-15, #FFFFFF26)',
                padding: '10px 0',
                marginTop: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  height: '36px',
                  backgroundColor: '#3D3E58',
                  borderRadius: '10px',
                  alignItems: 'center',
                  padding: '0 10px',
                }}
              >
                <span>参考来源</span>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
                  onClick={() => {
                    console.log('点击了');
                    if (isaboutfile === message.id) {
                      setIsboutfile('');
                    } else {
                      setIsboutfile(message.id);
                    }
                  }}
                >
                  <span>{message.citationchunks
                    .length}个案例文档</span>
                  <img
                    src='/assets/icon/Arrowbt.svg'
                    alt='历史'
                    style={{
                      width: '15px',
                      height: '15px',
                      filter: 'brightness(0) invert(1)',
                    }}
                  />
                </div>
              </div>
              {isaboutfile === message.id && (
                <div>
                  {message.citationchunks
                    .map((item: any) => (
                      <div key={item.id}>
                        <div
                          style={{
                            width: '100%',
                            height: '30px',
                            backgroundColor: 'white',
                            color: 'black',
                            borderRadius: '10px',
                            margin: '10px 0',
                            padding: '0 10px',
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            textDecoration: 'none',
                            minWidth: 0, // 关键：确保 flex 子元素可以收缩
                          }}
                          onClick={() => {
                            console.log('item==========', item);
                            getFileUrlFn(item.collectionId);
                          }}
                        >
                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1, // 占据剩余空间
                              minWidth: 0, // 允许收缩
                            }}
                          >
                            {item.sourceName}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
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

  // 判断是否正在流式输出
  const isStreaming = message.isStreaming || message.status === 'sending';

  // 如果正在流式输出，直接显示原始内容
  if (isStreaming) {
    return (
      <div>
        <div>
          <div>{message.content}</div>
        </div>
      </div>
    );
  }

  // 流式输出完成后，解析并显示格式化内容（memo 缓存）
  const parsedContent = useMemo(
    () => parseMarkdown(message.content),
    [message.content]
  );

  //文本匹配案例 1
  // `- ![video](http://172.30.232.95/videos/3M%E9%98%B2%E6%AF%92%E9%9D%A2%E5%85%B7%E7%A9%BF%E6%88%B4%E6%95%99%E5%AD%A6.mp4#t=0,30)
  // - ![video](http://172.30.232.95/videos/3M%E9%98%B2%E6%AF%92%E9%9D%A2%E5%85%B7%E7%A9%BF%E6%88%B4%E6%95%99%E5%AD%A6.mp4#t=30,60)`
  //文本匹配案例 2
  // `![video](
  // http://172.30.232.95/videos/3M%E9%98%B2%E6%AF%92%E9%9D%A2%E5%85%B7%E7%A9%BF%E6%88%B4%E6%95%99%E5%AD%A6.mp4#t=0,30
  // )`

  return (
    <div>
      <div>
        <div>
          {renderContentWithHoverNumbers(parsedContent)}
        </div>
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

const extractSummary = (content: string) => {
  const regex = /"summary"\s*:\s*"((?:\\"|\\n|\\\\.|[^"])*?)(?:"|$)/;
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


interface PlannerResult {
  title: string;
  steps: any[];
}

// 创建带有悬停提示的数字组件
const HoverNumber: React.FC<{
  number: string;
  header?: string;
  tooltip?: string;
  link?: string;
  collectionId?: string;
}> = ({ number, header, tooltip, link, collectionId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getFileUrlFn = async (id: string) => {
    console.log('id================', id);
    try {
      const res = await getFileUrl(id);
      const url = HTTP_URL + res.data.file_url;
      window.open(url);
    } catch (error) {
      console.log('error================', error);
    }
  };

  return (
    <div style={{ display: 'inline-block' }} onMouseLeave={() => setIsOpen(false)}>
      <span
        style={{
          color: 'white',
          cursor: 'pointer',
          width: "20px",
          height: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          lineHeight: "20px",
          borderRadius: "50%",
          fontWeight: 'bold',
          backgroundColor: "grey",
          margin: "0px 4px",

        }}
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => {
          if (collectionId) {
            getFileUrlFn(collectionId)
          }
        }}
      >
        {number}
      </span>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1000,
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            // marginTop: '8px'
          }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {header && (
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#333',
              borderBottom: '1px solid #eee',
              paddingBottom: '8px'
            }}>
              {header}
            </div>
          )}
          {tooltip && (
            <div style={{
              fontSize: '12px',
              color: '#666',
              lineHeight: '1.4',
              marginBottom: '12px'
            }}
              dangerouslySetInnerHTML={{ __html: tooltip }}
            />
          )}
        </div>
      )}
    </div>
  );
};

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
      // 处理带有悬停提示的数字 - 使用函数来提取属性
      .replace(/<span[^>]*class="eaitip"[^>]*>(\d+)<\/span>/g, (match, number) => {
        // 提取所有属性
        const tooltipMatch = match.match(/data-tooltip="([^"]*)"/);
        const headerMatch = match.match(/data-header="([^"]*)"/);
        const linkMatch = match.match(/data-link="([^"]*)"/);
        const collectionIdMatch = match.match(/collection-id="([^"]*)"/);

        const tooltip = tooltipMatch ? tooltipMatch[1] : '';
        const header = headerMatch ? headerMatch[1] : '';
        const link = linkMatch ? linkMatch[1] : '';
        const collectionId = collectionIdMatch ? collectionIdMatch[1] : '';

        // 构建占位符，使用特殊分隔符避免冒号冲突
        // 对包含管道符的属性进行转义，使用特殊字符替换
        const escapedTooltip = tooltip.replace(/\|/g, '&#124;');
        const escapedHeader = header.replace(/\|/g, '&#124;');
        const escapedLink = link.replace(/\|/g, '&#124;');
        const escapedCollectionId = collectionId.replace(/\|/g, '&#124;');

        return `{{HOVER_NUMBER:${number}|${escapedHeader}|${escapedTooltip}|${escapedLink}|${escapedCollectionId}}}`;
      })
      // 处理行内代码
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      // 处理超链接 - 排除图片格式（以!开头的）
      .replace(
        /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="solution-link">$1</a>'
      )
      // 处理图片
      .replace(/!\[([^\]]*)\]\(\s*([\s\S]+?)\s*\)/g, (match, alt, src) => {
        console.log("match===============", match, alt, src);

        // 检查是否为视频链接
        if (
          alt.toLowerCase() === 'video' ||
          src.match(/\.(mp4|webm|ogg|mov|avi)(#t=[^)]+)?$/i)
        ) {
          // 提取时间戳信息
          const timeMatch = src.match(/#t=([^)]+)$/);
          const timeParam = timeMatch ? timeMatch[1] : '';
          // 移除可能的多余换行符和空格
          const videoSrc = src.trim();

          console.log('videoSrc=================', videoSrc, timeMatch);

          return `<video controls style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;">
              <source src="${videoSrc}" type="video/mp4">
              您的浏览器不支持视频播放。
            </video>`;
        } else {
          // 普通图片处理
          return `<img src="${src.trim()}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" />`;
        }
      })
      // 处理列表
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      // .replace(/^- (.*$)/gim, '<li>$1</li>')
      // 处理换行
      .replace(/\n/g, '<br/>')
  );
};

// 渲染带有悬停提示的内容
const renderContentWithHoverNumbers = (content: string) => {
  if (!content) return null;

  // 分割内容，找到占位符
  const parts = content.split(/(\{\{HOVER_NUMBER:[^}]+\}\})/);

  console.log("parts============", parts);

  return parts.map((part, index) => {
    // 匹配新的占位符格式：{{HOVER_NUMBER:number|header|tooltip|link|collectionId}}
    const fullMatch = part.match(/\{\{HOVER_NUMBER:(\d+)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\}\}/);

    console.log("fullMatch============", fullMatch);

    if (fullMatch) {
      const [, number, header, tooltip, link, collectionId] = fullMatch;
      // 解码转义的管道符
      const decodedHeader = header ? header.replace(/&#124;/g, '|') : '';
      const decodedTooltip = tooltip ? tooltip.replace(/&#124;/g, '|') : '';
      const decodedLink = link ? link.replace(/&#124;/g, '|') : '';
      const decodedCollectionId = collectionId ? collectionId.replace(/&#124;/g, '|') : '';

      return (
        <HoverNumber
          key={index}
          number={number}
          header={decodedHeader || undefined}
          tooltip={decodedTooltip || undefined}
          link={decodedLink || undefined}
          collectionId={decodedCollectionId || undefined}
        />
      );
    }

    // 匹配基础格式：{{HOVER_NUMBER:number}}
    const basicMatch = part.match(/\{\{HOVER_NUMBER:(\d+)\}\}/);
    if (basicMatch) {
      const number = basicMatch[1];
      return <HoverNumber key={index} number={number} />;
    }

    return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
  });
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
            renderContentWithHoverNumbers(parsedContent)
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
            >
              {renderContentWithHoverNumbers(parsedContent)}
            </div>
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
  const [type2, setType2] = useState('0');
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; name: string; id: string }>
  >([]);
  const { userInfo, setUserInfo, databaseList } = useUserStore();

  const [taskParams, setTaskParams] = useState({});

  const clearTask = () => {
    setSectionName('');
    setTaskParams({});
    setUserInfo({} as any);
  }

  const router = useIonRouter();

  const [hello, setHello] = useState('');

  useEffect(() => {
    if (sectionName) {
      setType('1');
    } else {
      setType('0');
    }
  }, [sectionName]);

  // 接收URL参数
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log('searchParams==============', searchParams);
    const address = searchParams.get('address');
    const create = searchParams.get('create');
    const customer = searchParams.get('customer');
    const deleted = searchParams.get('deleted');
    const description = searchParams.get('description');
    const end = searchParams.get('end');
    const executeId = searchParams.get('executeId');
    const id = searchParams.get('id');
    const order_id = searchParams.get('order_id');
    const product = searchParams.get('product');
    const start = searchParams.get('start');
    const status = searchParams.get('status');
    const task_name = searchParams.get('task_name');
    const task_type = searchParams.get('task_type');
    const chatType = searchParams.get('chatType');
    setSectionName(task_name || '');

    setTaskParams({
      address: address,
      create: create,
      customer: customer,
      deleted: deleted,
      description: description,
      end: end,
      executeId: executeId,
      id: id,
      order_id: order_id,
      product: product,
      start: start,
      status:
        status == '1'
          ? '进行中'
          : status == '2'
            ? '即将开始'
            : status == '3'
              ? '已完成'
              : status == '4'
                ? '已取消'
                : '',
      task_name: task_name,
      task_type: task_type,
    });

    if (chatType == '1') {
      setShowInputType(1);
    }
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

    setMessages(prev => {

      const newMessages = [...prev];
      const messageIndex = newMessages.findIndex(msg => msg.id === message.id);

      if (messageIndex !== -1) {
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          isoption: true,
        };
      }

      console.log('newMessages==============', newMessages);

      return newMessages;
    });

  };

  const upload = async (message: any) => {
    console.log("sectionName===============", sectionName);

    const uploadData = {
      text: message,
      file_name: sectionName + '.md',
      parent_id: databaseList?.case || '',
      app_id: databaseList?.app_info_list?.find((item: any) => item.type == "多模态问答工作流")?.app_id || '',
      datasetId: databaseList?.case || '',
      userId: "6890805c3897878cdd928c34",
      teamId: "688c856f13e9f1c3b8aa1d31",
      tmbId: "688c856f13e9f1c3b8aa1d32",
      entrance: ""
    }
    try {
      const response = await chatUpload(uploadData);
      console.log('uploadresponse==============', response);
      present({
        message: '上传成功',
        duration: 2000,
        position: 'top',
        color: 'success',
      });
    } catch (err) {
      present({
        message: '上传失败',
        duration: 2000,
        position: 'top',
        color: 'danger',
      });
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
          feedback: variablesFeedback ? {
            content: variablesFeedback ? iptvalue : '',
            image_url: uploadedImages.map(image => ({
              url: image.url,
            })),
          } : "",
          internet_search: true,
          quote_enable: true,
          enable_graphKB: type2,
          task_info: taskParams,
          user_info: userInfo,
          knowledge: databaseList?.dataset_list || [],
        },
        responseChatItemId: 'b1jmtV7hdBHokPUT2jzQwAwJ',
        // shareId: '6e6q0y0lnlw9t247jl2y9fbi',
        shareId:
          type == '1' ? databaseList?.app_info_list?.find((item: any) => item.type == "HTTP SSE")?.shareId || '' : databaseList?.app_info_list?.find((item: any) => item.type == "多模态问答工作流")?.shareId || '',  // 1 是 知识库 2 是 知识库
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

      console.log('responsechunk=========', response);

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
        console.log('done=========', done, 'value长度:', value, value?.length);

        if (done) {
          console.log(`流式读取完成，总共读取${chunkCount}次`);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log(
          `第${chunkCount}次chunk数据 (长度: ${chunk.length}):`,
          chunk,
          reader
        );

        // 解析 chunk 中的事件 - 支持多个事件
        try {
          // 累积到缓冲区，等待形成完整的 SSE 事件块（空行分隔）
          buffer += chunk;

          const blocks = buffer.split(/\r?\n\r?\n/);
          buffer = blocks.pop() || '';

          console.log(
            `SSE事件块数: ${blocks.length}, 残余长度: ${buffer.length}`
          );

          for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (!block.trim()) continue;

            // 使用Android流式增强器处理延迟
            await AndroidStreamEnhancer.handleEventDelay(i, blocks.length);

            // 解析事件类型
            const eventMatch = block.match(/^event:\s*(\w+)/m);
            if (!eventMatch) continue;
            const eventType = eventMatch[1];
            console.log(
              `处理事件类型: ${eventType} (${i + 1}/${blocks.length})`
            );

            // 合并同一事件块中的多行 data
            const dataLines = block.match(/^data:\s?(.*)$/gm) || [];
            const dataStr = dataLines
              .map(line => line.replace(/^data:\s?/, ''))
              .join('\n')
              .trim();

            if (!dataStr || dataStr === '[DONE]') {
              continue;
            }



            // 按事件类型分发处理
            if (eventType == 'fastAnswer') {
              try {
                const data = JSON.parse(dataStr);
                const answerContent = data.choices?.[0]?.delta?.content;
                if (answerContent) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      ...newMessages[newMessages.length - 1],
                      url: answerContent,
                    };
                    return newMessages;
                  });
                }
              } catch (e) {
                console.warn('解析 fastAnswer 数据失败', e);
              }
            } else if (eventType == 'flowResponses') {
              try {
                const data = JSON.parse(dataStr);

                // 兼容原有两处对 flowResponses 的处理：
                // 1) aboutfile = data[0].quoteList
                if (Array.isArray(data) && data[0]?.quoteList) {
                  const answerContent = data[0].quoteList;
                  setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      ...newMessages[newMessages.length - 1],
                      aboutfile: answerContent,
                    };
                    return newMessages;
                  });
                }

                // 2) searchResults = response.quoteList（遍历数组）
                if (Array.isArray(data)) {
                  data.forEach((response: any) => {
                    if (
                      response?.moduleType === 'datasetSearchNode' &&
                      response?.quoteList
                    ) {
                      setMessages(prev => {
                        const newMessages = [...prev];
                        if (newMessages.length > 0) {
                          const lastMessage =
                            newMessages[newMessages.length - 1];
                          if (!lastMessage.isUser) {
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
            } else if (eventType == 'answer') {
              try {
                const data = JSON.parse(dataStr);
                if (
                  data.choices &&
                  data.choices[0] &&
                  data.choices[0].delta &&
                  typeof data.choices[0].delta.content === 'string'
                ) {
                  const answerContent = data.choices[0].delta.content;

                  const currentContent = agentMessages.get('default') || '';
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
                      const newMessages = [...prev];
                      newMessages[existingMessageIndex] = {
                        ...newMessages[existingMessageIndex],
                        content: newContent,
                        reasoningContent: data.reasoningContent,
                      };
                      return newMessages;
                    } else {
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
            } else if (eventType === 'message_chunk') {
              try {
                const data = JSON.parse(dataStr);
                console.log('message data=========', data);
                console.log('agent===========', data.agent);

                if (data.content) {
                  const content = data.content as string;
                  const agent = (data.agent as string) || 'default';

                  let researcherAgentid = '';
                  if (agent == 'researcher') {
                    researcherAgentid = data.id as string;
                  }

                  // 更新 agent 消息内容
                  if (agent === 'researcher') {
                    const currentContent =
                      researcherMessages.get(researcherAgentid) || '';
                    researcherMessages.set(
                      researcherAgentid,
                      currentContent + content
                    );
                  } else {
                    const currentContent = agentMessages.get(agent) || '';
                    agentMessages.set(agent, currentContent + content);
                  }

                  setMessages(prev => {
                    // 对于 researcher agent，需要根据 researcherAgentid 查找现有消息
                    let existingMessageIndex = -1;

                    if (agent === 'researcher') {
                      existingMessageIndex = prev.findIndex(
                        msg =>
                          !msg.isUser &&
                          msg.agent === agent &&
                          msg.status === 'sending' &&
                          msg.dataId === researcherAgentid
                      );
                    } else {
                      existingMessageIndex = prev.findIndex(
                        msg =>
                          !msg.isUser &&
                          msg.agent === agent &&
                          msg.status === 'sending'
                      );
                    }

                    if (existingMessageIndex !== -1) {
                      let filterdata: any = null;
                      if (agent == 'coordinator') {
                        filterdata = extractSupplementReply(
                          agentMessages.get(agent) || ''
                        );
                      } else if (agent == 'repeater') {

                        filterdata = extractSummary(
                          agentMessages.get(agent) || ''
                        );
                      }
                      else if (agent == 'planner') {
                        filterdata = extractPlanner(
                          agentMessages.get(agent) || ''
                        );
                      } else if (agent == 'researcher') {
                        filterdata =
                          researcherMessages.get(researcherAgentid) || '';
                      } else {
                        filterdata = agentMessages.get(agent) || '';
                      }

                      const newMessages = [...prev];
                      newMessages[existingMessageIndex] = {
                        ...newMessages[existingMessageIndex],
                        content: filterdata || '',
                        reasoningContent:
                          data.reasoningContent ||
                          newMessages[existingMessageIndex].reasoningContent,
                      };
                      return newMessages;
                    } else {
                      const newMessageId =
                        Date.now() + Math.random().toString(36).substr(2, 9);
                      const newMessage: Message = {
                        id: newMessageId,
                        dataId:
                          agent === 'researcher'
                            ? researcherAgentid
                            : (data.id as string) || '',
                        role: 'assistant',
                        content:
                          agent === 'researcher'
                            ? researcherMessages.get(researcherAgentid) || ''
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
              } catch (e) {
                console.warn('解析 message_chunk 数据失败', e);
              }
            } else if (eventType == 'interrupt') {
              try {
                const data = JSON.parse(dataStr);
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

                if (data.finish_reason == 'interrupt') {
                  console.log('发送===========');
                  setVariablesFeedback(true);
                }
              } catch (e) {
                console.warn('解析 interrupt 数据失败', e);
              }
            } else if (eventType == 'flowNodeStatus') {
              try {
                const data = JSON.parse(dataStr);
                console.log('flowNodeStatus data=========', data);
                if (data.status && data.name) {
                  console.log(`节点状态: ${data.name} - ${data.status}`);
                }
              } catch (e) {
                console.warn('解析 flowNodeStatus 数据失败', e);
              }
            }

          }
        } catch (e) {
          console.error('解析响应数据出错:', e, '原始数据:', chunk);
        }
      }

      if (chatId) {
        try {
          const res = await updataChat({ chatId: chatId });
          console.log("更新 chatId 数据=============", res.data.citation_answer);
          const answerContent = res.data.citation_answer;
          const citationchunks = res.data.citation_chunks;
          if (answerContent && citationchunks) {
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                ...newMessages[newMessages.length - 1],
                content: answerContent,
                citationchunks: citationchunks,
              };
              return newMessages;
            });
          }



        } catch (e) {
          console.warn('更新 chatId 数据失败', e);
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
                src='/assets/icon/timeclock.svg'
                alt='历史'
                style={{
                  width: '20px',
                  height: '20px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </IonMenuButton>

            {/* <IonButton>
              <img
                src='/assets/icon/add.svg'
                alt='添加'
                style={{
                  width: '20px',
                  height: '20px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </IonButton> */}
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
            paddingTop: sectionName ? '42px' : '0',
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
              {messages.map((message) => (
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
            // border: '1px solid red',
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
              {sectionName && (
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
                    // backgroundColor: type == '1' ? '#3A3C61' : '',
                    background:
                      type == '1'
                        ? 'linear-gradient(0deg, var(--base-white-15, rgba(255, 255, 255, 0.15)), var(--base-white-15, rgba(255, 255, 255, 0.15))),linear-gradient(158.13deg, #30247C -14.18%, #00033E 88.47%)'
                        : '',
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
              )}

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
                  // backgroundColor: type2 == '1' ? '#3A3C61' : '',
                  background:
                    type2 == '1'
                      ? 'linear-gradient(0deg, var(--base-white-15, rgba(255, 255, 255, 0.15)), var(--base-white-15, rgba(255, 255, 255, 0.15))),linear-gradient(158.13deg, #30247C -14.18%, #00033E 88.47%)'
                      : '',
                }}
                onClick={() => {
                  if (type2 == '1') {
                    setType2('0');
                  } else {
                    setType2('1');
                  }
                }}
              >
                深度检索
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
            clearTask={clearTask}
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
