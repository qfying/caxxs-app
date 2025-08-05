import { useState } from 'react';

type TaskBriefingTabProps = {
  item: any;
};

const TaskBriefingTab = ({ item }: TaskBriefingTabProps) => {
  const [isopen, setIsopen] = useState(false);
  const demoData = [
    {
      id: 1,
      content:
        '调节门、进风口及机壳前侧超高抖动，最高处在机壳前侧与进风口法兰处可达85mm/s，且抖动波动剧烈。',
      img: '/assets/icon/set-icon.svg',
    },
    {
      id: 2,
      content: '风机型号：VR72-1250D/S1新设备',
      img: '/assets/icon/set-icon.svg',
    },
    {
      id: 3,
      content:
        '驱动方式：单支撑D式风机，一体式轴承座，工频电机极限转速1480r/min',
      img: '/assets/icon/set-icon.svg',
    },
  ];

  const imgList = [
    {
      id: 1,
      img: '/assets/icon/set-icon.svg',
    },
    {
      id: 2,
      img: '/assets/icon/set-icon.svg',
    },
  ];

  return (
    <div
      style={{
        color: '#fff',
        backgroundColor: 'rgb(0, 3, 62)',
        borderRadius: '20px',
        border: '0.5px solid rgba(255, 255, 255, 0.3)',
        padding: '20px',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>{item.name}</div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
            }}
            onClick={() => {
              console.log('编辑');
            }}
          >
            <img
              src='/assets/icon/edit.svg'
              alt=''
              style={{ width: '12px', height: '12px' }}
            />
            <span style={{ fontSize: '12px' }}>编辑</span>
          </div>
          <img
            src='/assets/icon/top-icon.svg'
            alt=''
            style={{ width: '12px', height: '12px' }}
            onClick={() => {
              console.log('点击');
              setIsopen(!isopen);
            }}
          />
        </div>
      </div>

      {isopen && (
        <div>
          <div>
            {demoData.map(item => {
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    marginTop: '16px',
                  }}
                >
                  <img
                    src={item.img}
                    alt=''
                    style={{ width: '14px', height: '16px' }}
                  />
                  <div
                    style={{ fontSize: '12px', color: '#fff', opacity: '0.6' }}
                  >
                    {item.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {imgList.map(item => {
              return (
                <div key={item.id} style={{ width: '100%', height: '100px' }}>
                  <img
                    src={item.img}
                    alt=''
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBriefingTab;
