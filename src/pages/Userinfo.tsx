import { IonButtons, useIonRouter } from '@ionic/react';
import { useState } from 'react';
import { userinfoCreate } from '../services/api';

const Userinfo = () => {
  const router = useIonRouter();
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    age: '',
    role: '',
    work_experience_years: '',
    experience_level: '',
    primary_domains: '',
    equipment_familiarity: '',
    communication_style: '',
  });

  const commitInfo = async () => {
    console.log(formData);
    try {
      const res = await userinfoCreate({ data: formData });
      console.log('用户信息=========', res);
    } catch (error) {
      console.log(error);
    }
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
              minWidth: '80px',
              opacity: 0.5,
            }}
          >
            用户ID
          </label>
          <input
            type='text'
            value={formData.user_id}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                user_id: e.target.value,
              }))
            }
            placeholder='请输入用户ID'
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
              minWidth: '80px',
              opacity: 0.5,
            }}
          >
            姓名
          </label>
          <input
            type='text'
            value={formData.name}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder='请输入姓名'
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
              minWidth: '80px',
              opacity: 0.5,
            }}
          >
            年龄
          </label>
          <input
            type='number'
            value={formData.age}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                age: e.target.value,
              }))
            }
            placeholder='请输入年龄'
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
              minWidth: '80px',
              opacity: 0.5,
            }}
          >
            角色
          </label>
          <input
            type='text'
            value={formData.role}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                role: e.target.value,
              }))
            }
            placeholder='如：设备运维工程师'
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
              minWidth: '80px',
              opacity: 0.5,
            }}
          >
            工作年限
          </label>
          <input
            type='number'
            value={formData.work_experience_years}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                work_experience_years: e.target.value,
              }))
            }
            placeholder='请输入工作年限'
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
              minWidth: '80px',
              opacity: 0.5,
            }}
          >
            经验水平
          </label>
          <select
            value={formData.experience_level}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                experience_level: e.target.value,
              }))
            }
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
          >
            <option style={{ color: 'black' }} value=''>
              请选择经验水平
            </option>
            <option style={{ color: 'black' }} value='初级'>
              初级
            </option>
            <option style={{ color: 'black' }} value='中级'>
              中级
            </option>
            <option style={{ color: 'black' }} value='高级'>
              高级
            </option>
            <option style={{ color: 'black' }} value='专家'>
              专家
            </option>
          </select>
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
              minWidth: '80px',
              opacity: 0.5,
            }}
          >
            专业领域
          </label>
          <input
            type='text'
            value={formData.primary_domains}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                primary_domains: e.target.value,
              }))
            }
            placeholder='如：机械,电气,自动化'
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
              minWidth: '80px',
              opacity: 0.5,
            }}
          >
            设备熟悉度
          </label>
          <select
            value={formData.equipment_familiarity}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                equipment_familiarity: e.target.value,
              }))
            }
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
          >
            <option style={{ color: 'black' }} value=''>
              请选择熟悉度评分
            </option>
            <option style={{ color: 'black' }} value='1'>
              1分 - 完全不熟悉
            </option>
            <option style={{ color: 'black' }} value='2'>
              2分 - 略有了解
            </option>
            <option style={{ color: 'black' }} value='3'>
              3分 - 一般熟悉
            </option>
            <option style={{ color: 'black' }} value='4'>
              4分 - 比较熟悉
            </option>
            <option style={{ color: 'black' }} value='5'>
              5分 - 非常熟悉
            </option>
          </select>
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
              minWidth: '80px',
              opacity: 0.5,
            }}
          >
            沟通风格
          </label>
          <select
            value={formData.communication_style}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                communication_style: e.target.value,
              }))
            }
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
          >
            <option style={{ color: 'black' }} value=''>
              请选择沟通风格
            </option>
            <option style={{ color: 'black' }} value='直接'>
              直接
            </option>
            <option style={{ color: 'black' }} value='详细'>
              详细
            </option>
            <option style={{ color: 'black' }} value='简洁'>
              简洁
            </option>
            <option style={{ color: 'black' }} value='友好'>
              友好
            </option>
          </select>
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
