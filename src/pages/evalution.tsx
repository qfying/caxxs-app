import { IonButtons, useIonRouter } from '@ionic/react';
import React, { useState } from 'react';

const Evalution: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<string>('');
  const [customFeedback, setCustomFeedback] = useState('');
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const router = useIonRouter();

  const feedbackOptions = [
    { id: 'inaccurate', label: '结果不准确' },
    { id: 'slow', label: '响应速度慢' },
    { id: 'incomplete', label: '功能不全面' },
    { id: 'other', label: '其他建议' },
  ];

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setShowFeedbackOptions(true);
    setSelectedFeedback('');
    setShowCustomInput(false);
  };

  const handleFeedbackSelect = (feedbackId: string) => {
    setSelectedFeedback(feedbackId);
    if (feedbackId === 'other') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
    }
  };

  const handleSubmit = () => {
    console.log('提交反馈:', {
      rating,
      selectedFeedback,
      customFeedback,
    });
    // 这里可以调用API提交反馈
    alert('反馈提交成功！');
  };

  const handleComplete = () => {
    console.log('完成任务反馈');
    // 这里可以导航到其他页面
    alert('任务反馈完成！');
  };

  const getFeedbackMessage = () => {
    if (rating >= 4) {
      return '感谢您的满意评价！';
    } else if (rating >= 3) {
      return '感谢您的评价，我们会继续改进！';
    } else {
      return '很抱歉没有给您最佳体验,欢迎留言反馈';
    }
  };

  const goBack = () => {
    // router.goBack();
    router.push('/question');
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        padding: '0 20px 20px 20px',
        background:
          'linear-gradient(0deg, var(--Demo-BG, #00033E), var(--Demo-BG, #00033E)), linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.075) 50%, rgba(0, 0, 0, 0.8) 100%)',
      }}
    >
      {/* 头部 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px',
        }}
      >
        <IonButtons
          slot='start'
          onClick={goBack}
          style={{ cursor: 'pointer', color: 'white' }}
        >
          <img
            src='/assets/icon/Back.svg'
            alt=''
            style={{
              width: '38px',
              height: '38px',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </IonButtons>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          任务反馈
        </div>
        <div style={{ width: '38px' }}></div> {/* 占位符，保持标题居中 */}
      </div>

      <div
        style={{
          width: '100%',
          height: 'calc(100% - 70px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src='/assets/icon/bg-1.svg'
            alt=''
            style={{ width: '120px', height: '130px' }}
          />
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#fff',
              opacity: '0.5',
              marginTop: '30px',
            }}
          >
            Rating
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#fff',
              marginTop: '10px',
            }}
          >
            期待下次与你合作
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#fff',
              opacity: '0.5',
              marginTop: '10px',
            }}
          >
            有任何技术问题欢迎随时找我
          </div>
        </div>

        <div
          style={{
            width: '100%',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              background: '#0000001A',
              borderRadius: '20px',
              border: '0.5px solid rgba(255, 255, 255, 0.3)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#fff',
                opacity: '0.5',
                marginBottom: '15px',
              }}
            >
              您对本次任务体验是否满意?
            </div>

            {/* 星级评分 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <div
                  key={star}
                  onClick={() => handleRatingChange(star)}
                  style={{ cursor: 'pointer' }}
                >
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill={star <= rating ? '#FFFFFF' : 'none'}
                    stroke={star <= rating ? '#FFFFFF' : '#666666'}
                    strokeWidth='2'
                  >
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                  </svg>
                </div>
              ))}
            </div>

            {/* 反馈消息 */}
            <div
              style={{
                fontSize: '12px',
                color: '#fff',
                opacity: '0.7',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              {getFeedbackMessage()}
            </div>

            {/* 反馈选项 */}
            {showFeedbackOptions && (
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px',
                  }}
                >
                  {feedbackOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleFeedbackSelect(option.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background:
                          selectedFeedback === option.id
                            ? 'rgba(255, 255, 255, 0.2)'
                            : 'transparent',
                        color: '#fff',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                      }}
                    >
                      {selectedFeedback === option.id && (
                        <svg
                          width='12'
                          height='12'
                          viewBox='0 0 24 24'
                          fill='#fff'
                        >
                          <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' />
                        </svg>
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* 自定义输入框 */}
                {showCustomInput && (
                  <div style={{ marginBottom: '20px', width: '100%' }}>
                    <input
                      type='text'
                      value={customFeedback}
                      onChange={e => setCustomFeedback(e.target.value)}
                      placeholder='装备检查缺少我想要的结果,比如..'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '12px',
                        outline: 'none',
                      }}
                    />
                  </div>
                )}

                {/* 提交按钮 */}
                <button
                  onClick={handleSubmit}
                  style={{
                    width: '100px',
                    padding: '12px',
                    borderRadius: '19px',
                    background: '#fff',
                    color: '#000',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.2)',
                    margin: '0 auto',
                  }}
                >
                  提交
                  <svg width='12' height='12' viewBox='0 0 24 24' fill='#000'>
                    <path d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z' />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div style={{ width: '100%', marginTop: '20px' }}>
            <button
              style={{
                width: '100%',
                padding: '15px 30px',
                borderRadius: '12px',
                background:
                  'linear-gradient(0deg, var(--base-white-15, rgba(255, 255, 255, 0.15)), var(--base-white-15, rgba(255, 255, 255, 0.15))),linear-gradient(158.13deg, #30247C -14.18%, #00033E 88.47%)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                gap: '8px',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background =
                  'linear-gradient(0deg, var(--base-white-15, rgba(255, 255, 255, 0.15)), var(--base-white-15, rgba(255, 255, 255, 0.15))),linear-gradient(158.13deg, #30247C -14.18%, #00033E 88.47%)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background =
                  'linear-gradient(0deg, var(--base-white-15, rgba(255, 255, 255, 0.15)), var(--base-white-15, rgba(255, 255, 255, 0.15))),linear-gradient(158.13deg, #30247C -14.18%, #00033E 88.47%)';
              }}
              onClick={() => {
                router.push('/task');
              }}
            >
              <img
                src='/assets/icon/dagou.svg'
                alt=''
                style={{ width: '16px', height: '16px' }}
              />
              提交
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evalution;
