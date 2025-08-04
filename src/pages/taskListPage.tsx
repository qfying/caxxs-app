import { IonButton, IonButtons, useIonRouter } from '@ionic/react';
import { useEffect, useState } from 'react';
import TaskCard from '../components/taskCard';
import { getTaskList } from '../services/api';
import { useUserStore } from '../stores/userStore';

const TaskListPage = () => {
  const router = useIonRouter();
  const { userId, setSelectCardItem } = useUserStore();
  const [taskList, setTaskList] = useState<any[]>([]);

  useEffect(() => {
    console.log('TaskListPage 组件已加载');
    getTaskListFn();
  }, []);

  const getTaskListFn = async () => {
    try {
      // 使用zustand store中的用户ID
      const executeId = userId || '6887301624c99b8092c67e5e';
      const res = await getTaskList({ executeId });
      console.log('res=============', res);
      setTaskList(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const goBack = () => {
    // router.goBack();
    // router.push('/task');
    router.push('/chat');
  };

  function handleDelete(id: number): void {
    console.log('删除任务:', id);
    // TODO: 实现删除逻辑
  }

  function cardFn(item: any): void {
    console.log('点击任务卡片:', item);
    // 使用 Zustand store 存储选中的卡片项
    setSelectCardItem(item);
    // TODO: 实现任务卡片点击逻辑
    // window.location.href = '/question';
    router.push('/question');
  }

  console.log('TaskListPage 渲染中，taskList:', taskList);

  return (
    <div
      style={{
        background:
          'linear-gradient(0deg, var(--Demo-BG, #00033E), var(--Demo-BG, #00033E)), linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.075) 50%, rgba(0, 0, 0, 0.8) 100%)',
        height: '100%',
        padding: '0 20px',
        color: 'white',
      }}
    >
      <div>
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
            任务列表
          </div>
          <IonButtons slot='end'>
            <IonButton>
              <img
                src='/assets/icon/saixuan.svg'
                alt=''
                style={{
                  width: '20px',
                  height: '20px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </IonButton>
            <IonButton>
              <img
                src='/assets/icon/addtask.svg'
                alt=''
                style={{
                  width: '20px',
                  height: '20px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            </IonButton>
          </IonButtons>{' '}
          {/* 占位符，保持标题居中 */}
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: 'calc(100% - 70px)',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          // border: '1px solid red',
        }}
      >
        {taskList.slice(0, 3).map((item: any, index: number) => (
          <div key={item.id}>
            <TaskCard
              carditem={item}
              onDelete={handleDelete}
              isborder={true}
              cardFn={cardFn}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskListPage;
