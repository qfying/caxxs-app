import { IonButton, IonButtons, IonIcon } from '@ionic/react';
import { personCircle } from 'ionicons/icons';

const Header = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        widows: '100%',
        height: '60px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IonIcon
          icon={personCircle}
          style={{
            width: '36px',
            height: '36px',
            filter: 'brightness(0) invert(1)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '10px',
          }}
        >
          <span style={{ fontSize: '16px', color: '#fff' }}>老王</span>
          <span style={{ fontSize: '12px', color: '#fff', opacity: '0.5' }}>
            资深技术专家
          </span>
        </div>
      </div>
      <IonButtons slot='end'>
        <IonButton>
          <img
            src='/assets/icon/datatime.svg'
            alt=''
            style={{
              width: '20px',
              height: '20px',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </IonButton>
      </IonButtons>
    </div>
  );
};

export default Header;
