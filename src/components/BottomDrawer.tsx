import { IonButton, IonIcon, IonModal } from '@ionic/react';
import { close } from 'ionicons/icons';
import { useRef } from 'react';

interface BottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectItem: any;
  taskid: string;
  briefing: any;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({
  isOpen,
  onClose,
  selectItem,
  taskid,
  briefing
}) => {
  const modal = useRef<HTMLIonModalElement>(null);


  // const getBriefingFn = async () => {
  //   const res = await getBriefing({ task_id: taskid, fields: 'Plan_and_Precautions' });
  //   console.log("res===============", res);
  //   setBriefing(res.data);
  // }

  // useEffect(() => {
  //   getBriefingFn();
  // }, [selectItem]);


  console.log("选中4444===============", selectItem, briefing);



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
                  maxHeight: "calc(1.4em * 3)",
                  minHeight: "calc(1.4em * 3)"
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
                  maxHeight: "calc(1.4em * 3)",
                  minHeight: "calc(1.4em * 3)"
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
