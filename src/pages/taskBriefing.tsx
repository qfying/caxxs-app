import { IonButtons, IonCheckbox, useIonRouter } from '@ionic/react';
import Carddemo from "../components/Carddemo";

const TaskBriefing = () => {
  const router = useIonRouter();

  const carddata = {
    name: "输送机/传送带系统安装",
    time: "1h",
    state: "1",
    company: "万福恒升(上海)有限公司",
    lacate: "上海市浦东新区张江高科技园区",
    id: 1
  }



  const toQuestion = () => {
    router.push('/question', 'root');
  }

  return (
    <>
      <div style={{
        width: "100%", height: "100vh", padding: " 0px 20px",
        background: 'linear-gradient(0deg, var(--Demo-BG, #00033E), var(--Demo-BG, #00033E)), linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.075) 50%, rgba(0, 0, 0, 0.8) 100%)',
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "70px" }}>
          <IonButtons slot="start" >
            {/* <IonBackButton defaultHref="/tabs/task" style={{ color: 'white' }} /> */}
            <img
              src="/assets/icon/Back.svg"
              alt=""
              style={{ width: '38px', height: '38px', filter: 'brightness(0) invert(1)', cursor: 'pointer' }}
              onClick={() => window.location.href = '/tabs/task'}
            />
          </IonButtons>

          <div style={{ color: 'white' }}>任务简报</div>


          <div slot="end" style={{
            background: '#DE6603',
            padding: '4px 8px',
            borderRadius: '7px',
            fontSize: '12px',
            color: 'white',

          }}>
            <img src="/assets/icon/Level.svg" alt="" style={{ marginRight: "4px" }} />
            中级
          </div>
        </div>



        {/* 任务简报卡片 */}
        <div style={{ color: "#fff" }}>
          <Carddemo carddata={carddata} />
        </div>

        {/* 任务流程 */}
        <div style={{ marginBottom: '30px', color: "#fff", marginTop: "30px" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>任务流程</h3>
            <div style={{
              background: "#fff",
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              color: "black",
              fontWeight: "bold"
            }}>
              3
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{
              padding: "15px",
              background: "#FFFFFF1A",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: '16px', color: 'white' }}>安装指导</span>
              <IonCheckbox style={{ '--checkmark-color': 'white' }} />
            </div>
            <div style={{
              padding: "15px",
              background: "#FFFFFF1A",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: '16px', color: 'white' }}>出发检查</span>
              <IonCheckbox style={{ '--checkmark-color': 'white' }} />
            </div>
            <div style={{
              padding: "15px",
              background: "#FFFFFF1A",
              borderRadius: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: '16px', color: 'white' }}>现场安装</span>
              <IonCheckbox style={{ '--checkmark-color': 'white' }} />
            </div>
          </div>
        </div>

        {/* 任务小结 */}
        <div style={{ background: "rgba(66,68,100)", marginBottom: '30px', color: "#fff", display: "flex", flexDirection: "column", padding: "20px", borderRadius: "15px" }}>
          <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "14px", fontWeight: "bold", borderBottom: "1px solid #FFFFFF26", paddingBottom: "10px" }}>
            任务小结
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '5px', marginTop: "10px" }}>
            <div style={{

              borderRadius: '12px',
              padding: '5px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>2个</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>完成流程</div>
            </div>

            <div style={{

              borderRadius: '12px',
              padding: '5px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>1个</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>解锁成就</div>
            </div>

            <div style={{

              borderRadius: '12px',
              padding: '5px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>47次</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>AI 聊天</div>
            </div>

            <div style={{

              borderRadius: '12px',
              padding: '5px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px' }}>2个</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>技能知识</div>
            </div>
          </div>
        </div>



        {/* AI帮助提示 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '15px',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          color: "#fff"

        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            AI
          </div>
          <span style={{ fontSize: '14px' }}>有任何疑问欢迎随时问我哦</span>
        </div>

        {/* 底部按钮 */}
        <div style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
          <button
            onClick={() => {
              toQuestion()
            }}
            style={{
              flex: 1,
              padding: '15px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
            <img src="/assets/icon/question.svg" alt="" />
            我有问题
          </button>

          <button style={{
            flex: 1,
            padding: '15px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: "linear-gradient(0deg, var(--base-white-15, rgba(255, 255, 255, 0.15)), var(--base-white-15, rgba(255, 255, 255, 0.15))),linear-gradient(158.13deg, #30247C -14.18%, #00033E 88.47%)",
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <img src="/assets/icon/dagou.svg" alt="" />
            继续完成
          </button>
        </div>

      </div>

    </>
  );
};

export default TaskBriefing; 