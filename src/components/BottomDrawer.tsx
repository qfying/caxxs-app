import { IonButton, IonIcon, IonModal } from '@ionic/react';
import { close, create, warning } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { getBriefing } from '../services/api';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectItem: any;
  taskid: string;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  isOpen,
  onClose,
  selectItem,
  taskid
}) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [briefing, setBriefing] = useState<any>([]);

  const getBriefingFn = async () => {
    const res = await getBriefing({ task_id: taskid, fields: 'Plan_and_Precautions' });
    console.log("res===============", res);
    setBriefing(res.data);
  }

  useEffect(() => {
    getBriefingFn();
  }, [selectItem]);


  console.log("选中4444===============", selectItem);

  const [list, setList] = useState<any[]>([{
    name: "第一步",
    describe: "这是第一步",
    image: "/assets/img/empty.png"
  },
  {
    name: "第2步",
    describe: "这是第2步",
    image: "/assets/img/empty.png"

  },
  {
    name: "第3步",
    describe: "这是第3步",
    image: "/assets/img/empty.png"

  },
  {
    name: "第4步",
    describe: "这是第4步",
    image: "/assets/img/empty.png"
  }
  ]);


  const dismiss = () => {
    modal.current?.dismiss();
    onClose();
  };

  return (
    <IonModal
      ref={modal}
      isOpen={isOpen}
      onDidDismiss={onClose}
      initialBreakpoint={1}
      breakpoints={[0, 1]}
      style={
        {
          '--height': 'auto',
          '--border-radius': '20px 20px 0 0',
          '--background': 'transparent',
        } as React.CSSProperties
      }
    >
      <div
        style={{
          background:
            'linear-gradient(158.13deg, #30247C -14.18%, #00033E 88.47%)',
          color: 'white',
          padding: '20px',
          borderRadius: '20px 20px 0 0',
          // minHeight: '80vh',
          maxHeight: '90vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 处理圆角背景 */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            right: '-20px',
            height: '40px',
            background:
              'linear-gradient(158.13deg, #30247C -14.18%, #00033E 88.47%)',
            borderRadius: '20px 20px 0 0',
            zIndex: -1,
          }}
        />
        {/* 标题栏 - 固定高度 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // marginBottom: '20px',
            position: 'relative',
            zIndex: 1,
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              margin: 0,
              color: 'white',
            }}
          >
            {selectItem.title}
          </h2>
          <IonButton
            fill='clear'
            onClick={dismiss}
            style={
              {
                '--color': 'white',
                '--padding-start': '0',
                '--padding-end': '0',
              } as React.CSSProperties
            }
          >
            <IonIcon icon={close} />
          </IonButton>
        </div>

        {selectItem.id == 3 && (
          <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
            {briefing.map((item: any, index: number) => (
              <div
                style={{ flexShrink: "0", width: "300px", background: "rgba(255, 255, 255, 0.10)", borderRadius: "10px", padding: "10px" }}
                key={item.name}>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "16px", height: "16px", background: "white", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: "black", textAlign: "center", fontFamily: "SF Pro", fontSize: "12px", fontStyle: "normal", fontWeight: "700" }}>{index + 1}</div>
                  <div style={{ color: "#FFF", textAlign: "center", fontFamily: "SF Pro", fontSize: "12px", fontStyle: "normal", fontWeight: "700", lineHeight: "normal" }}>{item.title}</div>
                </div>

                <div style={{
                  fontSize: "12px",
                  margin: "10px 0px",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: "1.4",
                  maxHeight: "calc(1.4em * 3)"
                }}>
                  {item.content}
                </div>
                {
                  item.image_url && item.image_url.length > 0 ? <img src={item.image_url ? item.image_url : "http://172.30.232.95:3003/api/system/img/68901f595665993caf0e1b20.png"} alt="" style={{ width: "100%", height: "200px" }} /> :
                    <div style={{ width: "100%", height: "100%", maxHeight: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>{"暂无"}</div>
                }

              </div>
            ))}
          </div>
        )}

        {selectItem.id == 4 && (
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              position: 'relative',
              zIndex: 1,
              paddingRight: '5px',
            }}
          >
            {/* 安全注意事项 */}
            <div style={{ marginBottom: '25px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: 'white',
                  }}
                >
                  安全注意事项
                </h3>
                <IonIcon
                  icon={warning}
                  style={{
                    marginLeft: '8px',
                    color: '#FF9800',
                    fontSize: '18px',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {['佩戴防护眼镜和手套', '确保通风良好', '检查焊接设备接地'].map(
                  (item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* 质量要点 */}
            <div style={{ marginBottom: '25px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: 'white',
                  }}
                >
                  质量要点
                </h3>
                <IonIcon
                  icon={create}
                  style={{
                    marginLeft: '8px',
                    color: 'white',
                    fontSize: '16px',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {[
                  '焊缝不得有裂纹、气孔',
                  '管道连接处密封良好',
                  '系统压力测试合格',
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontSize: '14px',
                      color: 'white',
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 内容区域 - 可滚动 */}

        {/* 底部按钮 - 固定位置 */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
            marginTop: '20px',
            position: 'relative',
            zIndex: 1,
            flexShrink: 0,
          }}
        >
          <button
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => {
              // 处理Video按钮点击
              onClose()
              console.log('Video clicked');
            }}
          >
            收起
          </button>
          {/* <button
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => {
              // 处理Manual按钮点击
              console.log('Manual clicked');
            }}
          >
            Manual
          </button> */}
        </div>
      </div>
    </IonModal>
  );
};

export default BottomDrawer;
