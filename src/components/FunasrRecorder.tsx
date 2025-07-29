import React, { useState, useRef, useEffect, memo, lazy } from 'react';
import { Button, message as AntMessage } from 'antd';
import { SvgIcon } from '@/components/icon';
import '../styles/record.css';
import useWindowWidth from '@/hooks/event/use-window-width';
import Recorder from '@/assets/js/recorder-core';
import { useContextSelector } from 'use-context-selector';
import { WebsocketContext } from '@/hooks/use-websocket';
import Dictaphone from '@/pages/chat/components/Recorder';
import { useTranslation } from 'react-i18next';
import WebSocketManager from '@/hooks/use-websocket/WebsocketManager';
import { useUpdate } from 'ahooks';

const FunasrRecorder = ({
  websocket,
  onStop,
  onSwitch,
  isMessageSend,
  onInterrupt,
  onSTT,
  className,
}) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslate, setIsTranslate] = useState(false);
  const isCanceledRef = useRef(false);
  const [startY, setStartY] = useState(null);
  const recordingRef = useRef(false);
  const [isCancelArea, setIsCancelArea] = useState(false); // 用于标识是否在取消区域
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [recorder, setRecorder] = useState<Recorder>(null);
  const [text, setText] = useState('');
  const [offlineText, setOfflineText] = useState('');
  const sampleBuf = useRef(new Int16Array(0));
  // const ws = useContextSelector(WebsocketContext, (s) => s);
  const { isPc } = useWindowWidth();
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const update = useUpdate();
  const iconNUmber = 20;

  const icons = Array.from({ length: iconNUmber }, (_, index) => (
    <SvgIcon key={index + 1} icon={`ic_rj_${index + 1}`} color="#fff" size={150} />
  ));

  useEffect(() => {
    let timerId: any;

    if (isRecording) {
      timerId = setInterval(() => {
        setCurrentIconIndex(Math.floor(Math.random() * iconNUmber));
      }, 100);
    } else {
      clearInterval(timerId);
    }

    return () => {
      timerId && clearInterval(timerId);
    };
  }, [isRecording]);

  // const record = Recorder();

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop()); // 停止获取的媒体流
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      message.error(t('page.homePage.voiceErr'));
      onSwitch();
      return false;
    }
  };

  const recProcess = (
    buffer,
    powerLevel,
    bufferDuration,
    bufferSampleRate,
    newBufferIdx,
    asyncEnd,
  ) => {
    if (recordingRef.current === true) {
      var data_48k = buffer[buffer.length - 1];
      var array_48k = new Array(data_48k);
      var data_16k = Recorder.SampleData(array_48k, bufferSampleRate, 16000).data;
      sampleBuf.current = Int16Array.from([...sampleBuf.current, ...data_16k]);
      var chunk_size = 960;
      while (sampleBuf.current.length >= chunk_size) {
        const sendBuf = sampleBuf.current.slice(0, chunk_size);
        sampleBuf.current = sampleBuf.current.slice(chunk_size, sampleBuf.current.length);
        websocket?.send(sendBuf);
      }
    }
  };

  useEffect(() => {
    const testMicroPhone = async () => {
      await checkMicrophonePermission();
    };
    testMicroPhone();
    const r = Recorder({
      type: 'pcm',
      sampleRate: 16000,
      bitRate: 16,
      onProcess: recProcess,
    });
    setRecorder(r);
  }, []);

  const sendInitData = async () => {
    var chunk_size = new Array(5, 10, 5);
    var request = {
      chunk_size: chunk_size,
      wav_name: 'h5',
      is_speaking: true,
      chunk_interval: 10,
      itn: false,
      mode: '2pass',
    };
    websocket?.send(JSON.stringify(request));
  };

  const handleWithTimestamp = (tmptext: string, tmptime: string) => {
    console.log('tmptext: ' + tmptext);
    console.log('tmptime: ' + tmptime);
    if (tmptime == null || tmptime == 'undefined' || tmptext.length <= 0) {
      return tmptext;
    }
    tmptext = tmptext.replace(/。|？|，|、|\?|\.|\ /g, ','); // in case there are a lot of "。"
    var words = tmptext.split(','); // split to chinese sentence or english words
    var jsontime = JSON.parse(tmptime); //JSON.parse(tmptime.replace(/\]\]\[\[/g, "],[")); // in case there are a lot segments by VAD
    var char_index = 0; // index for timestamp
    var text_withtime = '';
    for (var i = 0; i < words.length; i++) {
      if (words[i] == 'undefined' || words[i].length <= 0) {
        continue;
      }
      console.log('words===', words[i]);
      console.log('words: ' + words[i] + ',time=' + jsontime[char_index][0] / 1000);
      if (/^[a-zA-Z]+$/.test(words[i])) {
        // if it is english
        text_withtime = text_withtime + jsontime[char_index][0] / 1000 + ':' + words[i] + '\n';
        char_index = char_index + 1; //for english, timestamp unit is about a word
      } else {
        // if it is chinese
        text_withtime = text_withtime + jsontime[char_index][0] / 1000 + ':' + words[i] + '\n';
        char_index = char_index + words[i].length; //for chinese, timestamp unit is about a char
      }
    }
    return text_withtime;
  };

  const handleMsg = (event: MessageEvent) => {
    let message;
    try {
      message = JSON.parse(event.data);
      console.log('text: ', text, '  offlineText:', offlineText, 'message： ', message);
      const recText = message.text;
      const mode = message.mode;
      const timestamp = message.timestamp;
      const isFinal = message.is_final;
      let currentText = '';

      if (mode == '2pass-offline' || mode == 'offline') {
        const handleText = handleWithTimestamp(recText, timestamp); //rectxt; //.replace(/ +/g,"");
        setOfflineText((prevOfflineText) => {
          const newText = prevOfflineText + handleText;
          setText(newText); // 同时更新 setText
          currentText = newText;
          return newText;
        });
      } else {
        setText((prevMessage) => {
          currentText = prevMessage + recText;
          return prevMessage + recText;
        });
      }
      if (isFinal && !isCanceledRef.current) {
        /**
         * 最后返回结果有两种形式
         * 1、is_final为true，但是text为空且不存在mode参数，则需要获取识别出来的文本
         * 2、is_final为true，text不为空，mode为2pass-offline或offline，则text为识别出来的文本
         */
        setTimeout(() => {
          if (!currentText) {
            setText((prevMessage) => {
              currentText = prevMessage;
              return prevMessage;
            });
            if (!currentText) {
              setOfflineText((prevMessage) => {
                currentText = prevMessage;
                return prevMessage;
              });
            }
            if (!currentText) {
              currentText = recText;
            }
          }
          if (currentText) {
            onStop(currentText);
          } else {
            AntMessage.warning('没有检测到语音');
          }

          resetRecord();
        }, 100);
      }
    } catch {
      message = event.data;
    } finally {
      update();
    }
  };

  const resetRecord = () => {
    // console.log('重置录制');
    setText('');
    setOfflineText('');
    sampleBuf.current = new Int16Array(0);
    // recordingRef.current = false;
    isCanceledRef.current = false;
  };

  useEffect(() => {
    console.log(websocket.readyState);

    if (websocket.readyState === websocket.OPEN) {
      sendInitData();
      websocket.onmessage = handleMsg;
    }
  }, [websocket.readyState]);

  const recordStart = async () => {
    resetRecord();
    if (recorder) {
      recorder.open(() => {
        recorder.start();
        // console.log('开始录制');
      });
    }
  };

  const stopRecording = async () => {
    // console.log('停止录制, ', text);
    websocket.send(JSON.stringify({ is_speaking: false }));
    if (recorder) {
      recorder.stop();
    }
  };

  const start = async () => {
    if (isMessageSend) {
      return;
    }

    if (recordingRef.current) return; // 如果已经在录音，则不执行
    isCanceledRef.current = false;
    try {
      navigator.vibrate(300);
    } catch (err) { }
    console.log(websocket.OPEN, websocket?.readyState);

    if (websocket?.readyState == websocket.CLOSED) {
      AntMessage.error(t('page.homePage.wsConnectErr'));
      return;
    }
    setIsRecording(true);
    recordingRef.current = true;
    recordStart();
  };

  const stop = () => {
    if (!recordingRef.current) return; // 如果不在录音，则不执行
    setIsRecording(false);
    recordingRef.current = false;
    stopRecording();
  };

  const cancel = () => {
    if (!recordingRef.current) return; // 如果不在录音，则不执行
    AntMessage.info(t('page.homePage.voiceCancel'));
    isCanceledRef.current = true;
    setIsRecording(false);
    recordingRef.current = false;
    stopRecording();
  };

  const handleTouchStart = (e) => {
    if (isMessageSend) {
      return;
    }
    if (recordingRef.current) return; // 如果已经在录音，则不执行
    isCanceledRef.current = false;
    e.preventDefault(); // 阻止默认行为
    e.stopPropagation();
    setIsCancelArea(false);
    if (e.touches && e.touches.length > 0) {
      setStartY(e.touches[0].clientY);
      start();
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // 阻止默认行为
    e.stopPropagation();
    if (!recordingRef.current) return; // 如果不在录音，则不执行
    if (startY !== null && e.touches && e.touches.length > 0) {
      const currentY = e.touches[0].clientY;
      const distance = startY - currentY;
      console.log(distance);
      if (distance > 100) {
        setIsCancelArea(true); // 进入取消区域
      } else {
        setIsCancelArea(false); // 离开取消区域
      }
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault(); // 阻止默认行为
    e.stopPropagation();
    if (!recordingRef.current) return; // 如果不在录音，则不执行
    if (recordingRef.current) {
      if (isCancelArea) {
        cancel();
      } else {
        stop();
      }
    }
    setStartY(null);
    setIsCancelArea(false); // 重置取消区域状态
  };

  // useEffect(() => {}, [isCancelArea]);

  const handleInterrupt = () => {
    console.log('handleInterrupt');
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled by the user.');
      setCancelTokenSource(null); // 重置 cancelTokenSource
    }
    onInterrupt();
    setIsTranslate(false);
  };

  return (
    <>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            marginBottom: isPc ? '0px' : '20px',
          }}
        >
          <Button
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={start}
            onMouseUp={stop}
            onMouseLeave={cancel}
            // onMouseMove={cancel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={cancel}
            onTouchMove={handleTouchMove}
            className="no-select no-touch h-full w-full select-none"
            style={{
              height: '45px',
              backgroundColor: isCancelArea ? '#E24747' : 'var(--brand-color)',
              color: isRecording ? '#474C5F' : '#fff',
              borderRadius: '16px',
              userSelect: 'none', // 禁用文本选择
              fontSize: '13px',
              fontWeight: 550,
              zIndex: 100,
              touchAction: 'none',
            }}
            icon={isRecording ? icons[currentIconIndex] : undefined}
          >
            {isRecording ? ' ' : t('page.homePage.holdTalk')}
          </Button>
        </div>
        {!isRecording && (
          <Button
            type="text"
            icon={
              isMessageSend ? (
                <SvgIcon icon="ic_stop" color="#fff" size={25} />
              ) : (
                <SvgIcon icon="ic_rj_keyboard" color="#fff" size={25} />
              )
            }
            onClick={isMessageSend ? handleInterrupt : onSwitch}
            style={{
              borderRadius: '16px',
              width: isPc ? '60px' : '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: '5px',
              background: 'rgba(255, 255, 255, 0.2)',
              zIndex: 200,
              marginBottom: isPc ? '0px' : '20px',
            }}
          />
        )}

        {isRecording && isPc && (
          <>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '200% 200% 0 0 / 100% 100% 0 0',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '240px',
                background: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '200% 200% 0 0 / 100% 100% 0 0',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                // color: '#A39BC4',
                // fontSize: '16px',
                // fontWeight: 550,
                zIndex: 100,
              }}
              className="h-full w-full"
            >
              <div className="flex h-full w-full flex-col items-center justify-end">
                <div className="mb-4 w-1/2 text-center" style={{ fontSize: '16px', color: '#000' }}>
                  {text}
                </div>
                <div className="mt-auto text-base font-bold text-[#A39BC4]">
                  {isCancelArea
                    ? t('page.homePage.releaseCancel')
                    : t('page.homePage.releaseCancelv2')}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {isRecording && !isPc && (
        <>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '200% 200% 0 0 / 100% 100% 0 0',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '240px',
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '200% 200% 0 0 / 100% 100% 0 0',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: isPc ? '15%' : '80px',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              // color: '#A39BC4',
              // fontSize: '16px',
              // fontWeight: 550,
              zIndex: 1,
            }}
          >
            <div className="mb-4" style={{ fontSize: '16px', color: '#000' }}>
              {text}
            </div>
            <div className="text-base font-bold text-[#A39BC4]">
              {isCancelArea ? t('page.homePage.releaseCancel') : t('page.homePage.releaseCancelv2')}
            </div>
          </div>
        </>
      )}
    </>
  );
};

// const Dictaphone = lazy(() => import('@/pages/chat/components/Recorder'));

const RecorderChoose = ({ onStop, onSwitch, isMessageSend, onInterrupt, onSTT, className }) => {
  // const ws = useContextSelector(WebsocketContext, (s) => s);
  const ws = React.useRef<WebSocket>();
  const [retryCount, setRetryCount] = React.useState(0);
  const update = useUpdate();

  const scheduleReconnect = () => {
    const delay = Math.min(1000 * 2 ** retryCount, 30000); // Exponential backoff with a max delay of 30 seconds
    setTimeout(() => {
      connectWebSocket();
    }, delay);
  };

  const connectWebSocket = () => {
    try {
      ws.current = WebSocketManager.getInstance('/ws');
      ws.current.onopen = () => {
        console.log('WebSocket opened');
        update();
      };
      ws.current.onclose = () => {
        update();
      };
      ws.current.onerror = () => {
        update();
      };
      update();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      scheduleReconnect();
    }
  };

  const handleVisibilityChange = () => {
    update();
    if (
      document.visibilityState === 'visible' &&
      (!ws.current || ws.current.readyState !== WebSocket.OPEN)
    ) {
      setRetryCount(0);
      connectWebSocket();
    }
  };

  useEffect(() => {
    connectWebSocket();
    if (!window) {
      return;
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      WebSocketManager.closeInstance();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (ws.current && ws.current.readyState === ws.current.OPEN) {
    return (
      <FunasrRecorder
        websocket={ws.current}
        isMessageSend={isMessageSend}
        onInterrupt={onInterrupt}
        onStop={onStop}
        onSTT={onSTT}
        onSwitch={onSwitch}
        className="flex h-full w-full items-center justify-center"
      />
    );
  }
  return (
    <Dictaphone
      isMessageSend={isMessageSend}
      onInterrupt={onInterrupt}
      onStop={onStop}
      onSTT={onSTT}
      onSwitch={onSwitch}
      className="flex h-full w-full items-center justify-center"
    />
  );
};

export default memo(RecorderChoose);
