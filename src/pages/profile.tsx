import { IonPage } from '@ionic/react';

const Profile = () => {
  return (
    <IonPage>
      <div
        style={{
          background:
            'linear-gradient(0deg, var(--Demo-BG, #00033E), var(--Demo-BG, #00033E)), linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.075) 50%, rgba(0, 0, 0, 0.8) 100%)',
          minHeight: '100vh',
          padding: '20px',
          color: 'white',
        }}
      >
        <h2>个人中心</h2>
        <p>这是我的个人资料页面</p>
      </div>
    </IonPage>
  );
};

export default Profile;
