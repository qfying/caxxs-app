import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonButton, IonInput, useIonToast } from '@ionic/react';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { usePlatform } from '../hooks/usePlatform';
import { uploadFile } from '../services/api';
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
  uploadedImages: any[];
  setUploadedImages: React.Dispatch<React.SetStateAction<any[]>>;
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
  uploadedImages,
  setUploadedImages,
}) => {
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [present] = useIonToast();
  const [isUploading, setIsUploading] = useState(false);
  const { isAndroid } = usePlatform();

  console.log('isAndroid================', isAndroid);

  // 处理粘贴图片事件
  const handlePaste = async (event: ClipboardEvent) => {
    console.log('粘贴事件触发', event);
    console.log('clipboardData:', event.clipboardData);
    console.log('items:', event.clipboardData?.items);
    console.log('files:', event.clipboardData?.files);
    console.log('types:', event.clipboardData?.types);

    // 方法1: 检查 items
    const items = event.clipboardData?.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.log('检查item:', item);
        if (item.type.indexOf('image') !== -1) {
          event.preventDefault();
          console.log('找到图片item:', item);

          const file = item.getAsFile();
          if (file) {
            await handleImageUpload(file);
          }
          return;
        }
      }
    }

    // 方法2: 检查 files
    const files = event.clipboardData?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log('检查file:', file);
        if (file.type.startsWith('image/')) {
          event.preventDefault();
          console.log('找到图片file:', file);
          await handleImageUpload(file);
          return;
        }
      }
    }

    // 方法3: 检查 types 并尝试获取数据
    const types = event.clipboardData?.types;
    console.log('types:', types);
    if (types) {
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        console.log('检查type:', type);
        if (type.startsWith('image/')) {
          event.preventDefault();
          console.log('找到图片type:', type);

          try {
            // 尝试从 clipboardData 获取图片数据
            const blob = event.clipboardData?.getData(type);
            if (blob) {
              const file = new File([blob], 'pasted-image.png', { type });
              await handleImageUpload(file);
            }
          } catch (error) {
            console.error('获取图片数据失败:', error);
          }
          return;
        }
      }
    }

    // 方法4: 尝试从剪贴板API获取图片
    if (navigator.clipboard && navigator.clipboard.read) {
      try {
        const clipboardItems = await navigator.clipboard.read();
        console.log('clipboardItems:', clipboardItems);

        for (const item of clipboardItems) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              event.preventDefault();
              console.log('找到图片type (clipboard API):', type);

              const blob = await item.getType(type);
              const file = new File([blob], 'pasted-image.png', { type });
              await handleImageUpload(file);
              return;
            }
          }
        }
      } catch (error) {
        console.error('clipboard API 读取失败:', error);
      }
    }

    // 如果没有找到图片，输出调试信息
    console.log('未检测到图片数据');
    console.log('items length:', items?.length);
    console.log('files length:', files?.length);
    console.log('types:', types);
  };

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    console.log('开始处理图片上传:', file);

    // 检查文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      present({
        message: '图片文件过大，请选择小于10MB的图片',
        duration: 3000,
        position: 'top',
        color: 'warning',
      });
      return;
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      present({
        message: '请粘贴有效的图片文件',
        duration: 3000,
        position: 'top',
        color: 'warning',
      });
      return;
    }

    try {
      setIsUploading(true);
      // present({
      //   message: '正在上传图片...',
      //   duration: 2000,
      //   position: 'top',
      //   color: 'primary',
      // });

      const response = await uploadFile(file);
      console.log('图片上传成功:', response.data);

      if (response.data && response.data.previewUrl) {
        // 生成唯一ID并添加到已上传图片列表
        const imageId = response.data.fileId;
        const newImage = {
          url: response.data.previewUrl,
          id: imageId,
        };

        console.log('newImage=============', newImage);

        setUploadedImages(prev => [...prev, newImage]);

        // 将图片URL添加到输入框中
        // const imageText = `![图片](${response.data.previewUrl})`;
        // const newValue = inputValue + (inputValue ? '\n' : '') + imageText;

        // 触发输入变化事件 - 使用正确的事件格式
        // const customEvent = new CustomEvent('ionInput', {
        //   detail: { value: newValue },
        //   bubbles: true,
        //   cancelable: true,
        // });

        // console.log('触发输入变化事件:', customEvent);
        // onInputChange(customEvent);

        present({
          message: '图片上传成功！',
          duration: 2000,
          position: 'top',
          color: 'success',
        });
      }
    } catch (error) {
      console.error('图片上传失败:', error);
      present({
        message: '图片上传失败，请重试',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 删除图片函数
  const handleRemoveImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter((img: any) => img.id !== imageId));

    // 从输入框中移除对应的图片markdown
    const imageToRemove = uploadedImages.find(img => img.id === imageId);
    if (imageToRemove) {
      const imageMarkdown = `![图片](${imageToRemove.url})`;
      const newValue = inputValue
        .replace(imageMarkdown, '')
        .replace(/\n\n+/g, '\n')
        .trim();

      const customEvent = new CustomEvent('ionInput', {
        detail: { value: newValue },
        bubbles: true,
        cancelable: true,
      });

      onInputChange(customEvent);
    }
  };

  // Android设备照片选择功能
  const handleAndroidPhotoSelect = async () => {
    if (!isAndroid) {
      console.log('非Android设备，跳过照片选择');
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos, // 从相册选择
      });

      if (image.webPath) {
        // 获取图片文件
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

        // 使用现有的图片上传处理函数
        await handleImageUpload(file);
      }
    } catch (error) {
      console.error('照片选择失败:', error);
      present({
        message: '照片选择失败，请重试',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
    }
  };

  // 发送消息的包装函数
  const handleSendMessage = (text: string) => {
    onSendMessage(text);
    // 发送消息后清空已上传的图片列表
    setUploadedImages([]);
  };

  // 添加粘贴事件监听
  useEffect(() => {
    console.log('设置粘贴事件监听器');

    // 将粘贴事件监听器绑定到文档级别，这样无论焦点在哪里都能捕获粘贴事件
    const handleDocumentPaste = (event: ClipboardEvent) => {
      // 只有在当前组件处于文本输入状态时才处理粘贴事件
      if (showInputType === 1) {
        handlePaste(event);
      }
    };

    // 绑定到文档级别
    document.addEventListener('paste', handleDocumentPaste);

    return () => {
      document.removeEventListener('paste', handleDocumentPaste);
    };
  }, [showInputType]); // 依赖 showInputType，确保只在文本输入状态时处理粘贴

  if (showInputType === 1) {
    return (
      <div>
        {/* 展示图片缩略图 */}
        {false && uploadedImages.length > 0 && (
          <div
            style={{
              width: 'calc(100% - 40px)',
              padding: '10px',
              margin: '0 20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  color: '#666',
                  marginRight: '8px',
                }}
              >
                图片:
              </span>
              {uploadedImages.map(image => (
                <div
                  key={image.id}
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: 'white',
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                    title={`删除 ${image.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='input-area'>
          <div className='input-container'>
            <div className='input-wrapper'>
              <IonInput
                ref={inputRef}
                label={showtag ? '编辑' : ''}
                placeholder={isUploading ? '正在上传图片...' : '请输入问题'}
                className='chat-input'
                value={inputValue}
                onIonInput={onInputChange}
                onKeyDown={onKeyDown}
                autoFocus={true}
                disabled={isAIResponding || isUploading}
              />
            </div>
            <div className='action-buttons'>
              {inputValue ? (
                <IonButton
                  fill='clear'
                  disabled={isAIResponding}
                  onClick={() => handleSendMessage(inputValue)}
                >
                  <img
                    src='/assets/icon/sendicon.svg'
                    alt=''
                    style={{
                      width: '32px',
                      height: '32px',
                      opacity: isAIResponding ? 0.5 : 1,
                    }}
                  />
                </IonButton>
              ) : (
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
                  <IonButton
                    fill='clear'
                    disabled={isAIResponding}
                    onClick={isAndroid ? handleAndroidPhotoSelect : undefined}
                  >
                    <img
                      src='/assets/icon/addtask.svg'
                      alt=''
                      style={{
                        width: '30px',
                        height: '30px',
                        opacity: isAIResponding ? 0.5 : 1,
                      }}
                    />
                  </IonButton>
                </div>
              )}
            </div>
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
            handleSendMessage(text);
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
