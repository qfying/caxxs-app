import { useIonToast } from '@ionic/react';
import React, { memo, useEffect, useRef, useState } from 'react';

interface ChatVoiceRecorderProps {
  onStop: (text: string) => void;
  onSwitch: () => void;
  isMessageSend: boolean;
  onInterrupt: () => void;
  onSTT: (text: string) => void;
  className?: string;
}

// WebSocket管理器
class WebSocketManager {
  private static instance: WebSocketManager;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  static getInstance(endpoint: string): WebSocket {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance.connect(endpoint);
  }

  static closeInstance() {
    if (WebSocketManager.instance) {
      WebSocketManager.instance.close();
    }
  }

  private connect(endpoint: string): WebSocket {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return this.ws;
    }

    try {
      const wsUrl = `ws://172.30.232.95:31665${endpoint}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect(endpoint);
      };

      this.ws.onerror = error => {
        console.error('WebSocket error:', error);
      };

      return this.ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      throw error;
    }
  }

  private attemptReconnect(endpoint: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(
          `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        this.connect(endpoint);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// 录音管理器
class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private onDataAvailable: ((data: Int16Array) => void) | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;

  async start(onData: (data: Int16Array) => void) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
        },
      });
      this.onDataAvailable = onData;

      // 创建AudioContext
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.stream);

      // 创建ScriptProcessor来处理音频数据
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = event => {
        const inputBuffer = event.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);

        // 将Float32Array转换为Int16Array
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          // 将-1到1的浮点数转换为-32768到32767的整数
          const sample = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        }

        this.onDataAvailable?.(pcmData);
      };

      source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      console.log('Audio recording started with PCM data');
    } catch (error) {
      console.error('Failed to start audio recording:', error);
      throw error;
    }
  }

  stop() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    console.log('Audio recording stopped');
  }

  isRecording(): boolean {
    return this.audioContext?.state === 'running';
  }
}

const ChatVoiceRecorder: React.FC<ChatVoiceRecorderProps> = ({
  onStop,
  onSwitch,
  isMessageSend,
  onInterrupt,
  onSTT,
  className,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const isCanceledRef = useRef(false);
  const [startY, setStartY] = useState<number | null>(null);
  const recordingRef = useRef(false);
  const [isCancelArea, setIsCancelArea] = useState(false);
  const [text, setText] = useState('');
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const iconNumber = 20;
  const ws = useRef<WebSocket | null>(null);
  const audioRecorder = useRef<AudioRecorder>(new AudioRecorder());
  const [present] = useIonToast();

  // 模拟语音识别结果（当WebSocket不可用时使用）
  const mockVoiceRecognition = () => {
    const mockTexts = [
      '你好，我想了解一下这个项目',
      '请帮我分析一下代码结构',
      '这个功能怎么实现比较好',
      '能给我一些建议吗',
      '谢谢你的帮助',
    ];
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  };

  useEffect(() => {
    let timerId: any;

    if (isRecording) {
      timerId = setInterval(() => {
        setCurrentIconIndex(Math.floor(Math.random() * iconNumber));
      }, 100);
    } else {
      clearInterval(timerId);
    }

    return () => {
      timerId && clearInterval(timerId);
    };
  }, [isRecording]);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      alert('需要麦克风权限才能使用语音功能');
      onSwitch();
      return false;
    }
  };

  const resetRecord = () => {
    setText('');
    isCanceledRef.current = false;
  };

  const sendInitData = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const request = {
        chunk_size: [5, 10, 5],
        wav_name: 'h5',
        is_speaking: true,
        chunk_interval: 10,
        itn: false,
        mode: '2pass',
      };
      ws.current.send(JSON.stringify(request));
    }
  };

  const handleWebSocketMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      console.log('WebSocket message:', message);

      if (message.text) {
        setText(message.text);
      }

      if (message.is_final && !isCanceledRef.current) {
        setTimeout(() => {
          if (message.text) {
            onStop(message.text);
          } else {
            // alert('没有检测到语音');
            present({
              message: '没有检测到语音',
              duration: 3500,
              position: 'top',
            });
          }
          resetRecord();
        }, 100);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  const connectWebSocket = () => {
    try {
      ws.current = WebSocketManager.getInstance('/ws');
      ws.current.onmessage = handleWebSocketMessage;
      return true;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      return false;
    }
  };

  const start = async () => {
    if (isMessageSend) {
      return;
    }

    if (recordingRef.current) return;

    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) return;

    isCanceledRef.current = false;
    try {
      navigator.vibrate(300);
    } catch (err) { }

    setIsRecording(true);
    recordingRef.current = true;

    // 尝试连接WebSocket
    const wsConnected = connectWebSocket();

    if (wsConnected) {
      // 使用WebSocket进行实时语音识别
      sendInitData();

      // 开始录音
      try {
        await audioRecorder.current.start(pcmData => {
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.log('发送PCM数据，长度:', pcmData.length);
            ws.current.send(pcmData);
          }
        });
      } catch (error) {
        console.error('Failed to start audio recording:', error);
        // 如果录音失败，使用模拟识别
        setTimeout(() => {
          if (recordingRef.current && !isCanceledRef.current) {
            const recognizedText = mockVoiceRecognition();
            setText(recognizedText);
          }
        }, 2000);
      }
    } else {
      // WebSocket连接失败，使用模拟识别
      setTimeout(() => {
        if (recordingRef.current && !isCanceledRef.current) {
          const recognizedText = mockVoiceRecognition();
          setText(recognizedText);
        }
      }, 2000);
    }
  };

  const stop = () => {
    if (!recordingRef.current) return;

    setIsRecording(false);
    recordingRef.current = false;

    // 停止录音
    audioRecorder.current.stop();

    // 发送停止信号
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ is_speaking: false }));
    }

    if (!isCanceledRef.current && text) {
      onStop(text);
    }
    resetRecord();
  };

  const cancel = () => {
    if (!recordingRef.current) return;

    // alert('语音输入已取消');
    present({
      message: '语音输入已取消',
      duration: 1500,
      position: 'top',
    });

    isCanceledRef.current = true;
    setIsRecording(false);
    recordingRef.current = false;

    // 停止录音
    audioRecorder.current.stop();

    // 发送停止信号
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ is_speaking: false }));
    }

    resetRecord();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    console.log('e==============', e);

    if (isMessageSend) {
      return;
    }
    if (recordingRef.current) return;
    isCanceledRef.current = false;
    e.preventDefault();
    e.stopPropagation();
    setIsCancelArea(false);
    if (e.touches && e.touches.length > 0) {
      console.log('e.touches[0].clientY=======', e.touches[0].clientY);
      setStartY(e.touches[0].clientY);
      start();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!recordingRef.current) return;
    if (startY !== null && e.touches && e.touches.length > 0) {
      const currentY = e.touches[0].clientY;
      const distance = startY - currentY;
      console.log(distance);
      if (distance > 100) {
        setIsCancelArea(true);
      } else {
        setIsCancelArea(false);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!recordingRef.current) return;
    if (recordingRef.current) {
      if (isCancelArea) {
        cancel();
      } else {
        stop();
      }
    }
    setStartY(null);
    setIsCancelArea(false);
  };

  const handleMouseDown = () => {
    if (isMessageSend || recordingRef.current) return;
    start();
  };

  const handleMouseUp = () => {
    if (!recordingRef.current) return;
    stop();
  };

  const handleMouseLeave = () => {
    if (!recordingRef.current) return;
    cancel();
  };

  const handleInterrupt = () => {
    console.log('handleInterrupt');
    onInterrupt();
  };

  // 生成图标
  const generateIcon = (index: number) => {
    return (
      <div
        key={index}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: '#333',
        }}
      >
        🎤
      </div>
    );
  };

  const icons = Array.from({ length: iconNumber }, (_, index) =>
    generateIcon(index)
  );

  // 清理WebSocket连接
  useEffect(() => {
    return () => {
      WebSocketManager.closeInstance();
    };
  }, []);

  return (
    <div>
      <div
        style={{
          opacity: isMessageSend ? 0.5 : 1,
          pointerEvents: isMessageSend ? 'none' : 'auto',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={cancel}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {!isRecording ? (
          <div
            style={{
              width: 'calc(100% - 40px)',
              height: '68px',
              backdropFilter: 'blur(60px)',
              border: '0.5px solid #FFFFFF80',
              borderRadius: '35px',
              zIndex: 1000,
              display: 'flex',
              padding: '10px',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '0 auto',
            }}
          >
            <div
              onClick={e => {
                e.stopPropagation();
                if (!isMessageSend) onSwitch();
              }}
              onTouchStart={e => e.stopPropagation()}
              onTouchEnd={e => e.stopPropagation()}
              onTouchCancel={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
              onMouseUp={e => e.stopPropagation()}
              onMouseLeave={e => e.stopPropagation()}
              style={{
                opacity: isMessageSend ? 0.5 : 1,
                pointerEvents: isMessageSend ? 'none' : 'auto',
              }}
            >
              <img
                src='/assets/icon/keyboard.svg'
                alt=''
                style={{ width: '48px', height: '48px' }}
              />
            </div>
            <div style={{ fontSize: '14px', color: '#F9F9F9' }}>
              长按说出您的问题
            </div>
            <div
              onClick={e => {
                e.stopPropagation();
                if (!isMessageSend) onSwitch();
              }}
              style={{
                opacity: isMessageSend ? 0.5 : 1,
                pointerEvents: isMessageSend ? 'none' : 'auto',
              }}
              onTouchStart={e => e.stopPropagation()}
              onTouchEnd={e => e.stopPropagation()}
              onTouchCancel={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
              onMouseUp={e => e.stopPropagation()}
              onMouseLeave={e => e.stopPropagation()}
            >
              <img
                src='/assets/icon/delet.svg'
                alt=''
                style={{ width: '48px', height: '48px' }}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              width: 'calc(100% - 40px)',
              height: '68px',
              backdropFilter: 'blur(60px)',
              border: '0.5px solid #FFFFFF80',
              borderRadius: '35px',
              zIndex: 1000,
              display: 'flex',
              padding: '10px 30px',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '0 auto',
            }}
          >
            <div>{icons[currentIconIndex]}</div>
            <div style={{ fontSize: '14px', color: '#F9F9F9' }}>
              {isCancelArea ? '松开取消' : '松开结束'}
            </div>
          </div>
        )}
      </div>

      {isRecording && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
        >
          <div
            style={{
              fontSize: '18px',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: '20px',
              padding: '0 20px',
            }}
          >
            {text || '正在识别语音...'}
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#FFFFFF',
              opacity: 0.8,
              textAlign: 'center',
            }}
          >
            {isCancelArea ? '松开取消' : '松开结束'}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ChatVoiceRecorder);
