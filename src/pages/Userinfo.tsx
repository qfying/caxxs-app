import { IonButtons, useIonRouter } from '@ionic/react';
import { useState } from 'react';

const Userinfo = () => {
  const router = useIonRouter();
  const [formData, setFormData] = useState({
    customer: '',
    address: '',
    order_id: '',
    product: '',
    description: '',
    create: '',
    end: '',
    executeId: '',
    id: '',
    start: '',
    status: '',
    deleted: false,
  });

  const commitInfo = () => {
    console.log(formData);
  };

  const goBack = () => {
    router.goBack();
  };

  return (
    <div
      style={{
        background:
          'linear-gradient(0deg, var(--Demo-BG, #00033E), var(--Demo-BG, #00033E)), linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.075) 50%, rgba(0, 0, 0, 0.8) 100%)',
        height: '100%',
        padding: '20px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'space-between',
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
          个人信息
        </div>
        <div style={{ width: '38px' }}></div> {/* 占位符，保持标题居中 */}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <label
            style={{
              fontSize: '14px',
              color: 'white',
              minWidth: '60px',
              opacity: 0.5,
            }}
          >
            客户
          </label>
          <input
            type='text'
            value={formData.customer}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                customer: e.target.value,
              }))
            }
            placeholder='请输入客户名称'
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              marginLeft: '15px',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <label
            style={{
              fontSize: '14px',
              color: 'white',
              minWidth: '60px',
              opacity: 0.5,
            }}
          >
            地址
          </label>
          <input
            type='text'
            value={formData.address}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                address: e.target.value,
              }))
            }
            placeholder='请输入地址'
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              marginLeft: '15px',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <label
            style={{
              fontSize: '14px',
              color: 'white',
              minWidth: '60px',
              opacity: 0.5,
            }}
          >
            订单号
          </label>
          <input
            type='text'
            value={formData.order_id}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                order_id: e.target.value,
              }))
            }
            placeholder='请输入订单号'
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              marginLeft: '15px',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <label
            style={{
              fontSize: '14px',
              color: 'white',
              minWidth: '60px',
              opacity: 0.5,
            }}
          >
            产品
          </label>
          <input
            type='text'
            value={formData.product}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                product: e.target.value,
              }))
            }
            placeholder='请输入产品名称'
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              marginLeft: '15px',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <label
            style={{
              fontSize: '14px',
              color: 'white',
              minWidth: '60px',
              marginTop: '12px',
              opacity: 0.5,
            }}
          >
            描述
          </label>
          <textarea
            value={formData.description}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder='请输入任务描述'
            rows={3}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              marginLeft: '15px',
              lineHeight: '1.5',
              resize: 'none',
            }}
          />
        </div>

        {/* 底部按钮 */}
        <div
          style={{
            display: 'flex',
            gap: '15px',
            marginTop: '10px',
          }}
        >
          <button
            style={{
              flex: 1,
              padding: '12px 24px',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              height: '62px',
            }}
            onClick={() => {
              commitInfo();
            }}
          >
            提交
          </button>
        </div>
      </div>
    </div>
  );
};

export default Userinfo;
