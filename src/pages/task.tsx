import { IonModal, IonPage, IonTextarea, useIonRouter } from "@ionic/react";
import { useRef, useState } from "react";
import TaskCard from "../components/taskCard";
import { taskCreate } from '../services/api';


const Task = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const router = useIonRouter();
  const [nextIndex, setNextIndex] = useState(0)
  const [taskCreateValue, setTaskCreateValue] = useState("")




  const taskCreateFn = async () => {
    const data = {
      // content: "订单号是 2025-07-18，客户为山东蓝海环保设备有限公司，地址在山东省济南市高新区工业南路 88 号。产品名称是高温耐腐风机，描述部分写着：风机型号为 D1200，叶轮出现轻微异响，已更换轴承并调整对中，测试运转正常，客户现场确认通过验收。",
      executeId: "6870ef9d56c8d927b668ad95",
      content: taskCreateValue
    }
    try {
      const res = await taskCreate(data)
      setNextIndex(1)
      console.log("res=============", res);
    } catch (err) {
      console.log(err);
    }

  }

  const cardFn = (item: any) => {
    console.log("item=========", item);
    // setNextIndex(3)
    router.push('/question', 'root');
  }





  const [demoList, setDemoList] = useState([
    {
      name: "输送机/传送带系统安装",
      time: "1h",
      state: "1",
      company: "万福恒升(上海)有限公司",
      lacate: "上海市浦东新区张江高科技园区",
      id: 1
    },
    {
      name: "PVC/PPR 塑料管道安装",
      time: "2h",
      state: "2",
      company: "万福恒升(上海)有限公司",
      lacate: "上海市浦东新区张江高科技园区",
      id: 2
    },
    {
      name: "不锈钢管道系统安装",
      time: "2-3h",
      state: "3",
      company: "万福恒升(上海)有限公司",
      lacate: "上海市浦东新区张江高科技园区",
      id: 3
    },
    {
      name: "不锈钢管道系统安装",
      time: "2-3h",
      state: "3",
      company: "万福恒升(上海)有限公司",
      lacate: "上海市浦东新区张江高科技园区",
      id: 4
    },
    {
      name: "不锈钢管道系统安装",
      time: "2-3h",
      state: "3",
      company: "万福恒升(上海)有限公司",
      lacate: "上海市浦东新区张江高科技园区",
      id: 5
    },
    {
      name: "不锈钢管道系统安装",
      time: "2-3h",
      state: "3",
      company: "万福恒升(上海)有限公司",
      lacate: "上海市浦东新区张江高科技园区",
      id: 6
    }
  ]);

  const handleDelete = (id: number) => {
    setDemoList(prevList => prevList.filter(item => item.id !== id));
  };

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <IonPage>
      <div style={{
        background: 'linear-gradient(0deg, var(--Demo-BG, #00033E), var(--Demo-BG, #00033E)), linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.075) 50%, rgba(0, 0, 0, 0.8) 100%)',
        height: "100%",
        padding: '20px',
        color: 'white'
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: "bold" }}>任务中心</div>
          <div
            id="open-modal"
            style={{
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "background-color 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => {
              setNextIndex(0)
            }}
          >
            新建任务
            <img src="/assets/icon/addtask.svg" alt="" style={{ width: '12px', marginLeft: "4px", height: '12px', filter: 'brightness(0) invert(1)' }} />
          </div>
          <IonModal
            ref={modal}
            trigger="open-modal"
            initialBreakpoint={1}
            breakpoints={[0, 1]}
            style={{
              '--height': 'auto'
            } as React.CSSProperties}
          >
            <div className="block" style={{
              padding: "20px",
              background: "linear-gradient(0deg, var(--Demo-BG, #00033E), var(--Demo-BG, #00033E)), linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.075) 50%, rgba(0, 0, 0, 0.8) 100%)",
              color: "white",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "18px" }}>新建任务</div>
                <div onClick={() => dismiss()} >
                  <img src="/assets/icon/delet.svg" alt="" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
                </div>
              </div>

              {nextIndex == 0 && (
                <div>
                  <div style={{ display: "flex", marginTop: "10px", gap: "8px" }}>
                    <div style={{ borderRadius: "18px", height: "70px", width: "50%", border: "1px solid #FFFFFF80", backgroundColor: "#FFFFFF26", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <img src="/assets/icon/saomiao.svg" alt="" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
                      <div style={{ marginLeft: "10px", fontSize: "16px" }}>扫描</div>
                    </div>
                    <div style={{ borderRadius: "18px", height: "70px", width: "50%", border: "1px solid #FFFFFF80", backgroundColor: "#FFFFFF26", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <img src="/assets/icon/upload.svg" alt="" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }} />
                      <div style={{ marginLeft: "10px", fontSize: "16px" }}>上传</div>
                    </div>
                  </div>

                  <div style={{
                    width: "100%",
                    border: "1px solid #FFFFFF80",
                    padding: "6px 10px",
                    borderRadius: "18px",
                    marginTop: "10px"
                  }}>
                    <IonTextarea
                      placeholder="输入文字 ，快速识别"
                      clearOnEdit={true}
                      value={taskCreateValue}
                      rows={4}
                      onIonChange={(e) => {
                        console.log("e=====", e);
                        setTaskCreateValue(e.detail.value || "")
                      }}
                    ></IonTextarea>
                  </div>

                  <div onClick={() => {
                    taskCreateFn()
                    setNextIndex(1)
                  }} style={{ borderRadius: "18px", marginTop: "10px", height: "60px", width: "100%", border: "1px solid #FFFFFF80", backgroundColor: "#FFFFFF26", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div>发送</div>
                  </div>
                </div>

              )}


              {nextIndex == 1 &&
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "14px", color: "white", minWidth: "60px", opacity: 0.5 }}>客户</label>
                    <input
                      type="text"
                      defaultValue="河南方圆工业炉设计制造有限公司"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontSize: "14px",
                        marginLeft: "15px"
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "14px", color: "white", minWidth: "60px", opacity: 0.5 }}>地址</label>
                    <input
                      type="text"
                      defaultValue="浙江省温州市滨海园区六道397号"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontSize: "14px",
                        marginLeft: "15px"
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "14px", color: "white", minWidth: "60px", opacity: 0.5 }}>订单号</label>
                    <input
                      type="text"
                      defaultValue="2024-50-12"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontSize: "14px",
                        marginLeft: "15px"
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label style={{ fontSize: "14px", color: "white", minWidth: "60px", opacity: 0.5 }}>产品</label>
                    <input
                      type="text"
                      defaultValue="小风机"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontSize: "14px",
                        marginLeft: "15px"
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <label style={{ fontSize: "14px", color: "white", minWidth: "60px", marginTop: "12px", opacity: 0.5 }}>描述</label>
                    <textarea
                      defaultValue="1120 风机调节门执行器换方向,叶轮蹭壳,已调整,电机对中业主验收通过"
                      rows={3}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        fontSize: "14px",
                        marginLeft: "15px",
                        lineHeight: "1.5",
                        resize: "none"
                      }}
                    />
                  </div>

                  {/* 底部按钮 */}
                  <div style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "10px"
                  }}>

                    <button
                      style={{
                        flex: 1,
                        padding: "12px 24px",
                        borderRadius: "18px",
                        background: "background: var(--base-white-15, #FFFFFF26)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        height: "62px"
                      }}
                      onClick={() => setNextIndex(0)}
                    >
                      返回
                    </button>

                    <button
                      style={{
                        flex: 1,
                        padding: "12px 24px",
                        borderRadius: "18px",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        height: "62px"
                      }}
                      onClick={() => setNextIndex(2)}
                    >
                      确认
                    </button>
                  </div>
                </div>
              }

              {
                nextIndex == 2 &&
                <div style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                  <div style={{ marginTop: "20px" }}><img src="/assets/icon/scicon.svg" alt="" style={{ width: "50px", height: "42px" }} /></div>
                  <div style={{ fontWeight: "600", fontSize: "16px", marginTop: "20PX" }}>任务添加成功</div>
                  <button
                    style={{
                      padding: "0",
                      borderRadius: "18px",
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      height: "62px",
                      width: "100%",
                      marginTop: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onClick={() => {
                      modal.current?.dismiss();
                      router.push('/task-briefing', 'root');
                    }}
                  >
                    完成
                  </button>
                </div>
              }

              {
                nextIndex == 3 &&
                <div style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                  <div style={{ marginTop: "20px" }}><img src="/assets/icon/scicon.svg" alt="" style={{ width: "50px", height: "42px" }} /></div>
                  <div style={{ fontWeight: "600", fontSize: "16px", marginTop: "20PX" }}>任务添加成功</div>
                  <button
                    style={{
                      padding: "0",
                      borderRadius: "18px",
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      fontSize: "16px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      height: "62px",
                      width: "100%",
                      marginTop: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onClick={() => {
                      modal.current?.dismiss();
                      router.push('/task-briefing', 'root');
                    }}
                  >
                    完成
                  </button>
                </div>
              }
            </div>
          </IonModal>
        </div >

        <div style={{
          marginTop: "30px",
          width: "100%",
          height: "125px",
          padding: "21px",
          border: "1px solid #FFFFFF80",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(30px)",
          borderRadius: "20px",
          position: "relative"
        }}>
          <div style={{ display: "flex", height: "100%", gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>3</div>
              <div style={{ fontSize: "14px", color: "#FFFFFF" }}>进行中</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>3</div>
              <div style={{ fontSize: "14px", color: "#FFFFFF" }}>即将开始</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>3</div>
              <div style={{ fontSize: "14px", color: "#FFFFFF" }}>已完成</div>
            </div>

            <div style={{ width: "122px", height: "122px", position: "absolute", top: "-20px", right: "10px", zIndex: "10" }}>
              <img src="/assets/icon/robort.svg" alt="" style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>最近任务</div>
          <div style={{ fontSize: "12px", display: "flex", alignItems: "center" }}>
            <img src="/assets/icon/search.svg" alt="" style={{ width: '18px', marginLeft: "4px", height: '18px', filter: 'brightness(0) invert(1)' }} />
          </div>
        </div>

        <div style={{ marginTop: "15px", height: "calc(100% - 310px)", overflowY: "auto", scrollbarWidth: "none" }}>
          {demoList.map(item => (
            <TaskCard key={item.id} carditem={item} onDelete={handleDelete} cardFn={cardFn} />
          ))}
        </div>
      </div>
    </IonPage>
  );
};

export default Task;