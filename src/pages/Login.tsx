import {
  IonButton,
  IonCol,
  IonInput,
  IonRow
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { connect } from '../data/connect';
import { setIsLoggedIn, setUsername } from '../data/user/user.actions';
import { getChatKnowledgeBaseList, loginByPassword } from '../services/api';
import { useUserStore } from '../stores/userStore';
import './Login.scss';

export const hashStr = async (str: string): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// 测试函数：验证密码"123456"的哈希值
export const testHash = async () => {
  const testPassword = 'Team@2024';
  const expectedHash = '53e880894f3cc53d5071c679f1afcd223a3faca09148c6898da13f0afc3535ad';
  const actualHash = await hashStr(testPassword);

  console.log('测试密码:', testPassword);
  console.log('期望哈希:', expectedHash);
  console.log('实际哈希:', actualHash);
  console.log('哈希匹配:', actualHash === expectedHash);

  return actualHash === expectedHash;
};

interface LoginProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
}

const Login: React.FC<LoginProps> = ({
  setIsLoggedIn,
  setUsername: setUsernameAction,
}) => {
  const history = useHistory();
  const [login, setLogin] = useState({ username: '', password: '' });
  const [submitted, setSubmitted] = useState(false);
  const { setDatabaseList } = useUserStore();

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);



    //  '123456',
    //   '53e880894f3cc53d5071c679f1afcd223a3faca09148c6898da13f0afc3535ad'

    if (login.username && login.password) {
      // 将密码转换为SHA-256哈希值

      const actualHash = await hashStr(login.password);

      console.log("login.password======", login.password, actualHash);


      const response = await loginByPassword(
        login.username,
        actualHash
      );
      console.log(response);
      history.push('/chat');
      localStorage.setItem('token', response.data.token);

      getChatKnowledgeBaseListFn()
    }
  };

  const getChatKnowledgeBaseListFn = async () => {
    const response = await getChatKnowledgeBaseList();
    console.log("response=============", response);
    setDatabaseList(response.data);
  };

  // const initLogin = async () => {
  //   try {
  //     const response = await loginByPassword(
  //       '123456',
  //       '53e880894f3cc53d5071c679f1afcd223a3faca09148c6898da13f0afc3535ad'
  //     );
  //     localStorage.setItem('token', response.data.token);

  //     setistoken(true)

  //     // 存储用户ID到zustand store
  //     if (response.data.user && response.data.user._id) {
  //       setUser(response.data.user._id, response.data.token);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const onSignup = () => {
    history.push('/signup');
  };

  return (
    <div style={{
      background:
        'linear-gradient(0deg, var(--Demo-BG, #00033E), var(--Demo-BG, #00033E)), linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.075) 50%, rgba(0, 0, 0, 0.8) 100%)',
      height: '100%',
      padding: '50px 20px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',

      // justifyContent: 'space-between',
    }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <img src='/assets/img/appicon.svg' alt='Ionic logo' style={{ width: "100%", maxWidth: "150px" }} />
      </div>

      <div className='login-form'>
        <form onSubmit={onLogin} noValidate>
          <IonInput
            label='Username'
            labelPlacement='stacked'
            className='inputpadding'
            // fill='solid'
            value={login.username}
            name='username'
            type='text'
            spellCheck={false}
            autocapitalize='off'
            errorText={
              submitted && !login.username ? 'Username is required' : ''
            }
            onIonInput={e =>
              setLogin({ ...login, username: e.detail.value! })
            }
            required
            style={{
              color: "black",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
          />

          <IonInput
            className='inputpadding'
            label='Password'
            labelPlacement='stacked'
            // fill='solid'
            value={login.password}
            name='password'
            type='password'
            errorText={
              submitted && !login.password ? 'Password is required' : ''
            }
            onIonInput={e =>
              setLogin({ ...login, password: e.detail.value! })
            }
            required
            style={{
              color: "black",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "10px",
              "--padding-start": "10px",
              "--padding-end": "10px",
              "--padding-top": "10px",
              "--padding-bottom": "10px"
            }}
          />

          <IonRow>
            <IonCol>
              <IonButton type='submit' expand='block'>
                Login
              </IonButton>
            </IonCol>
            {/* <IonCol>
                <IonButton onClick={onSignup} color='light' expand='block'>
                  Signup
                </IonButton>
              </IonCol> */}
          </IonRow>
        </form>
      </div>

    </div>
    // <IonPage id='login-page'>
    //   <IonHeader>
    //     <IonToolbar>
    //       <IonButtons slot='start'>
    //         <IonMenuButton></IonMenuButton>
    //       </IonButtons>
    //       <IonTitle>Login</IonTitle>
    //     </IonToolbar>
    //   </IonHeader>
    //   <IonContent>

    //   </IonContent>
    // </IonPage>
  );
};

export default connect<{}, {}, LoginProps>({
  mapDispatchToProps: {
    setIsLoggedIn,
    setUsername,
  },
  component: Login,
});
