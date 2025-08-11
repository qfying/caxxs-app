import { IonButtons, useIonRouter } from '@ionic/react';
import { useState } from 'react';
import Carddemo from '../components/Carddemo';
import TaskBriefingTab from '../components/TaskBriefingTab';

const TaskBriefing = () => {
  const router = useIonRouter();
  const [currentTab, setCurrentTab] = useState(1);
  const carddata = {
    name: '输送机/传送带系统安装',
    time: '1h',
    state: '1',
    company: '万福恒升(上海)有限公司',
    lacate: '上海市浦东新区张江高科技园区',
    id: 1,
  };

  const tabs = [
    { name: '问题现象', id: 1 },
    { name: '原因及分析', id: 2 },
    { name: '处理方案', id: 3 },
    { name: '案例处理结果', id: 4 },
    { name: '预防措施', id: 5 },
  ];

  const toQuestion = () => {
    router.push('/question', 'root');
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100vh',
          padding: ' 0px 20px',
          background:
            'linear-gradient(0deg, var(--Demo-BG, #00033E), var(--Demo-BG, #00033E)), linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.075) 50%, rgba(0, 0, 0, 0.8) 100%)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px',
          }}
        >
          <IonButtons slot='start'>
            {/* <IonBackButton defaultHref="/tabs/task" style={{ color: 'white' }} /> */}
            <img
              src='/assets/icon/Back.svg'
              alt=''
              style={{
                width: '38px',
                height: '38px',
                filter: 'brightness(0) invert(1)',
                cursor: 'pointer',
              }}
              onClick={() => (window.location.href = '/tabs/task')}
            />
          </IonButtons>

          <div style={{ color: 'white', fontWeight: 'bold' }}>问题处理经验</div>

          <div
            slot='end'
            style={{
              background: '#DE6603',
              padding: '4px 8px',
              borderRadius: '7px',
              fontSize: '12px',
              color: 'white',
            }}
          >
            <img
              src='/assets/icon/Level.svg'
              alt=''
              style={{ marginRight: '4px' }}
            />
            中级
          </div>
        </div>

        {/* 任务简报卡片 */}
        <div style={{ color: '#fff' }}>
          <Carddemo carddata={carddata} />
        </div>

        {/* tabs */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            width: '100%',
            overflowX: 'auto',
            marginTop: '20px',
            marginBottom: '20px',
            scrollbarWidth: 'none',
          }}
        >
          {tabs.map(item => {
            return (
              <div
                style={{
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  flexShrink: '0',
                  opacity: currentTab == item.id ? 1 : 0.5,
                }}
                key={item.id}
                onClick={() => {
                  console.log(item.id);
                  setCurrentTab(item.id);
                }}
              >
                {item.name}
              </div>
            );
          })}
        </div>

        {/* 内容区域 */}
        <TaskBriefingTab item={tabs[0]} />
        <TaskBriefingTab item={tabs[1]} />
        <TaskBriefingTab item={tabs[2]} />
        <TaskBriefingTab item={tabs[3]} />
        <TaskBriefingTab item={tabs[4]} />
      </div>
    </>
  );
};

export default TaskBriefing;
