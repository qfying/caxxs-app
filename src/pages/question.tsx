import { IonButtons, useIonRouter } from '@ionic/react';
import { useState } from 'react';
import BottomDrawer from '../components/BottomDrawer';
import { useUserStore } from '../stores/userStore';

const Question = () => {
  const router = useIonRouter();
  const { selectCardItem, setSelectCardItem } = useUserStore();

  const [currentSection, setCurrentSection] = useState(0);
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);
  const [selectItem, setSelectItem] = useState({} as any);

  // 示例：使用从其他页面传递过来的选中卡片项
  console.log('选中的卡片项:', selectCardItem);

  // 测试函数：手动设置 selectCardItem
  const testSetSelectCardItem = () => {
    const testItem = {
      id: 1,
      customer: '测试客户',
      address: '测试地址',
      start: '2024-01-01',
      status: '1',
      name: '测试任务',
      time: '1h',
      company: '测试公司',
      lacate: '测试位置',
    };
    console.log('手动设置测试数据:', testItem);
    setSelectCardItem(testItem);
  };

  const sections = [
    {
      id: 1,
      title: '安装指导',
      title1: '安装指导',

      subtitle:
        (selectCardItem && selectCardItem.address) ||
        'Installation Instructions',
      description: '首先，为保证安装顺利\n我给你准备了三个重点',
      description2: '开始学习它吧 ✊🏻',
      items: [
        {
          id: 1,
          title: '完整安装方案预习',
          content: '不锈钢管道系统安装详细步骤和流程说明',
          status: '已完成',
        },
        {
          id: 2,
          title: '安装要点确认',
          content: '关键操作步骤和技术要求',
          status: '已完成',
        },
        {
          id: 3,
          title: '关键注意事项',
          content: '安全提醒和常见问题预防',
          status: '进行中',
        },
      ],
    },

    {
      id: 3,
      title: '现场安装',
      title1: '',

      subtitle: (selectCardItem && selectCardItem.address) || 'On-Site Repair',

      description: '准备就绪，抵达现场',
      description2: '让我们开始维修',

      items: [
        {
          id: 9,
          title: '现场环境评估',
          content: '评估安装环境的安全性和适用性',
          status: '待开始',
        },
        {
          id: 10,
          title: '设备安装执行',
          content: '按照标准流程进行设备安装',
          status: '待开始',
        },
        {
          id: 11,
          title: '安装质量检查',
          content: '检查安装质量和功能测试',
          status: '待开始',
        },
      ],
    },

    {
      id: 2,
      title: '总结',
      title1: '你成功完成了',

      subtitle:
        (selectCardItem && selectCardItem.address) || 'Equipment Checklist',

      description: '你的表现非常出色！ \n 不锈钢焊接，技艺进阶',
      description2: '来看看总结吧',
      items: [
        {
          id: 4,
          title: '不锈钢管道材质识别',
          content: '检查基础施工、预埋件等',
          status: '待开始',
        },
        {
          id: 5,
          title: '正确选择焊接材料（ER304焊丝）',
          content: '确保状态良好，配件齐全',
          status: '待开始',
        },
        {
          id: 6,
          title: '专业焊接操作',
          content: '确保状态良好，配件齐全',
          status: '待开始',
        },
        {
          id: 7,
          title: '系统连接调试',
          content: '反馈多次弯折管道，必备',
          status: '待开始',
          warning: '注意',
        },
        {
          id: 8,
          title: '质量验收确认 ',
          content: '安全帽，防护眼镜，手套等',
          status: '待开始',
        },
      ],
    },
  ];

  const goBack = () => {
    // router.goBack();
    // router.push('/task-briefing');
    router.push('/chat');
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        padding: '0 20px',

        background:
          'linear-gradient(0deg, var(--Demo-BG, #00033E), var(--Demo-BG, #00033E)), linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.075) 50%, rgba(0, 0, 0, 0.8) 100%)',
        top: 0,
        left: 0,
        zIndex: 1000,
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
          常见问题
        </div>
        <div style={{ width: '38px' }}>{/* 测试按钮 */}</div>
      </div>

      <div style={{ width: '100%', height: 'calc(100% - 70px)' }}>
        {/* 内容 */}
        <div
          style={{
            height: 'calc(100% - 80px)',
            borderRadius: '0 0 20px 20px',
          }}
        >
          <div
            style={{
              overflowY: 'auto',
              scrollbarWidth: 'none',
              borderRadius: '20px',
            }}
          >
            <div
              style={{
                color: 'white',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: '20px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  opacity: '0.5',
                }}
              >
                {sections[currentSection].subtitle}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#FFFFFF',
                  opacity: '0.5',
                  margin: '15px 0px',
                }}
              >
                {sections[currentSection].description
                  .split('\n')
                  .map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#FFFFFF',
                  // margin: '15px 0px',
                  fontWeight: 'bold',
                }}
              >
                {sections[currentSection].description2
                  .split('\n')
                  .map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
              </div>
            </div>

            {/* 当前部分内容 */}
            <div style={{ color: '#fff' }}>
              {/* 部分标题栏 */}
              {currentSection != 1 && (
                <div
                  style={{
                    // background: 'rgba(255, 255, 255, 0.1)',
                    // borderRadius: '15px',
                    padding: '15px 0',
                    // marginBottom: '20px',
                    // border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        margin: 0,
                        color: 'white',
                      }}
                    >
                      {sections[currentSection].title1}
                    </h3>
                    {/* 小三角指示器 */}
                    {/* <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderBottom: '6px solid #007AFF',
                  }}
                ></div> */}
                  </div>
                  <div
                    style={{
                      background: '#fff',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      color: 'black',
                      fontWeight: 'bold',
                    }}
                  >
                    {sections[currentSection].items.length}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '30px' }}>
                {/* 部分内容 */}
                {currentSection == 2 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '15px',
                      padding: '5px 15px',
                    }}
                  >
                    {sections[currentSection].items.map((item, index) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '15px 0',
                          borderBottom:
                            index < sections[currentSection].items.length - 1
                              ? '0.5px solid rgba(255, 255, 255, 0.2)'
                              : 'none',
                          color: 'white',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginRight: '15px',
                            minWidth: '20px',
                          }}
                        >
                          {index + 1}.
                        </div>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            flex: 1,
                          }}
                        >
                          {item.title}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(currentSection == 0 || currentSection == 1) && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {sections[currentSection].items.map(item => (
                      <div
                        key={item.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '15px',
                          padding: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          position: 'relative',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        onClick={() => {
                          console.log('点击项目:', item.title);

                          setShowBottomDrawer(true);
                          setSelectItem(item);
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: 'white',
                              marginBottom: '5px',
                            }}
                          >
                            {item.title}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                              lineHeight: '1.3',
                            }}
                          >
                            {item.content}
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          {item.warning && (
                            <span
                              style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '8px',
                                background: 'rgba(255, 152, 0, 0.3)',
                                color: '#FF9800',
                                border: '1px solid rgba(255, 152, 0, 0.5)',
                              }}
                            >
                              {item.warning}
                            </span>
                          )}
                          {/* <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          background:
                            item.status === '已完成'
                              ? 'rgba(76, 175, 80, 0.3)'
                              : item.status === '进行中'
                              ? 'rgba(33, 150, 243, 0.3)'
                              : 'rgba(158, 158, 158, 0.3)',
                          color:
                            item.status === '已完成'
                              ? '#4CAF50'
                              : item.status === '进行中'
                              ? '#2196F3'
                              : '#9E9E9E',
                          border:
                            item.status === '已完成'
                              ? '1px solid rgba(76, 175, 80, 0.5)'
                              : item.status === '进行中'
                              ? '1px solid rgba(33, 150, 243, 0.5)'
                              : '1px solid rgba(158, 158, 158, 0.5)',
                        }}
                      >
                        {item.status}
                      </span> */}
                          <img
                            src='/assets/icon/Back.svg'
                            alt=''
                            style={{
                              width: '16px',
                              height: '16px',
                              filter: 'brightness(0) invert(1)',
                              transform: 'rotate(180deg)',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 底部按钮 */}
            <div
              style={{
                padding: '20px 0',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {currentSection != 2 && (
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
                    marginRight: '6px',
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
                    // 方法1：URL 参数传递（简单数据）
                    const urlParams = new URLSearchParams({
                      name: selectCardItem?.address || '',
                      id: selectCardItem?.id?.toString() || '',
                      taskType: '1',
                    });
                    router.push(`/chat?${urlParams.toString()}`);
                  }}
                >
                  <img
                    src='/assets/icon/question.svg'
                    alt=''
                    style={{ width: '16px', height: '16px' }}
                  />

                  {'向天工提问'}
                </button>
              )}

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
                  // router.push("/tabs/ai")
                  if (currentSection == 0) {
                    setCurrentSection(1);
                  }
                  if (currentSection == 1) {
                    setCurrentSection(2);
                  }

                  if (currentSection == 2) {
                    console.log('任务评价');

                    // window.location.href = '/task-briefing';
                    router.push('/evalution');
                  }
                }}
              >
                <img
                  src='/assets/icon/dagou.svg'
                  alt=''
                  style={{ width: '16px', height: '16px' }}
                />
                {currentSection === 0
                  ? '我明白啦'
                  : currentSection === 1
                  ? '确认齐全'
                  : '完成'}
              </button>
            </div>
          </div>
        </div>

        {/* 底部导航栏 */}
        <div
          style={{
            height: '80px',
            background: 'rgba(0, 3, 62, 0.9)',
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          {sections.map((section, index) => (
            <div
              key={section.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                opacity: index === currentSection ? 1 : 0.6,
                transition: 'opacity 0.3s ease',
                position: 'relative',
              }}
              onClick={() => {
                setCurrentSection(index);
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background:
                    index === currentSection
                      ? '#007AFF'
                      : 'rgba(255, 255, 255, 0.3)',
                }}
              ></div>
              <span
                style={{
                  fontSize: '12px',
                  color: 'white',
                  fontWeight: index === currentSection ? 'bold' : 'normal',
                }}
              >
                {section.title}
              </span>
              {/* 小三角指示器 */}
            </div>
          ))}
        </div>
      </div>

      {/* 底部抽屉 */}
      <BottomDrawer
        isOpen={showBottomDrawer}
        selectItem={selectItem}
        onClose={() => setShowBottomDrawer(false)}
      />
    </div>
  );
};

export default Question;
