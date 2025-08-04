import { IonButton, IonInput } from '@ionic/react';
import React, { KeyboardEvent } from 'react';
import './ChatInputArea.css';
import ChatVoiceRecorder from './ChatVoiceRecorder';

interface ChatInputAreaProps {
  showInputType: number;
  inputValue: string;
  isAIResponding: boolean;
  onInputChange: (e: CustomEvent) => void;
  onKeyDown: (e: KeyboardEvent<HTMLIonInputElement>) => void;
  onSendMessage: (text: string) => void;
  onSetShowInputType: (type: number) => void;
  showtag?: boolean;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  showInputType,
  inputValue,
  isAIResponding,
  onInputChange,
  onKeyDown,
  onSendMessage,
  onSetShowInputType,
  showtag,
}) => {
  if (showInputType === 1) {
    return (
      <div className='input-area'>
        <div className='input-container'>
          <div className='input-wrapper'>
            <IonInput
              label={showtag ? '编辑' : ''}
              placeholder='请输入问题'
              className='chat-input'
              value={inputValue}
              onIonInput={onInputChange}
              onKeyDown={onKeyDown}
              autoFocus={true}
              disabled={isAIResponding}
            />
          </div>
          <div className='action-buttons'>
            <IonButton
              fill='clear'
              disabled={isAIResponding}
              onClick={() => onSetShowInputType(2)}
            >
              <img
                src='/assets/icon/voice.svg'
                alt=''
                style={{
                  width: '32px',
                  height: '32px',
                  opacity: isAIResponding ? 0.5 : 1,
                }}
              />
            </IonButton>
            <IonButton fill='clear' disabled={isAIResponding}>
              <img
                src='/assets/icon/cam.svg'
                alt=''
                style={{
                  width: '32px',
                  height: '32px',
                  opacity: isAIResponding ? 0.5 : 1,
                }}
              />
            </IonButton>
          </div>
        </div>
      </div>
    );
  }

  if (showInputType === 2) {
    return (
      <ChatVoiceRecorder
        onStop={text => {
          if (text && text.trim()) {
            onSendMessage(text);
          }
          onSetShowInputType(0);
        }}
        onSwitch={() => onSetShowInputType(1)}
        isMessageSend={isAIResponding}
        onInterrupt={() => {
          // 处理中断逻辑
          onSetShowInputType(0);
        }}
        onSTT={text => {
          // 处理语音转文字结果
          console.log('语音识别结果:', text);
        }}
      />
    );
  }

  return (
    <div className='footer-buttons'>
      <div
        style={{
          opacity: isAIResponding ? 0.5 : 1,
          pointerEvents: isAIResponding ? 'none' : 'auto',
        }}
      >
        <img
          src='/assets/icon/cam.svg'
          alt=''
          style={{ width: '48px', height: '48px' }}
        />
      </div>
      <div
        onClick={() => {
          if (!isAIResponding) onSetShowInputType(1);
        }}
        style={{
          opacity: isAIResponding ? 0.5 : 1,
          pointerEvents: isAIResponding ? 'none' : 'auto',
        }}
      >
        <img
          src='/assets/icon/keyboard.svg'
          alt=''
          style={{ width: '48px', height: '48px' }}
        />
      </div>
      <div
        onClick={() => {
          if (!isAIResponding) onSetShowInputType(2);
        }}
        style={{
          opacity: isAIResponding ? 0.5 : 1,
          pointerEvents: isAIResponding ? 'none' : 'auto',
        }}
      >
        <img
          src='/assets/icon/voice.svg'
          alt=''
          style={{ width: '48px', height: '48px' }}
        />
      </div>
      <div
        id='top-center'
        onClick={() => {
          console.log('点击任务图标');

          if (!isAIResponding) onSetShowInputType(4);
        }}
        style={{
          opacity: isAIResponding ? 0.5 : 1,
          pointerEvents: isAIResponding ? 'none' : 'auto',
        }}
      >
        <img
          src='/assets/icon/flag.svg'
          alt=''
          style={{ width: '48px', height: '48px' }}
        />
      </div>
    </div>
  );
};

export default ChatInputArea;
