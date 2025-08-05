import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
  useIonToast,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';

import Menu from './components/Menu';
// import Chat from './pages/chat';
import Menudemo from './pages/menudemo';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// import '@ionic/react/css/palettes/dark.always.css';
// import '@ionic/react/css/palettes/dark.system.css';
import '@ionic/react/css/palettes/dark.class.css';

/* Theme variables */
import './theme/variables.css';

/* Leaflet CSS */
import 'leaflet/dist/leaflet.css';

/* Global styles */
import './App.scss';
import HomeOrTutorial from './components/HomeOrTutorial';
import RedirectToLogin from './components/RedirectToLogin';
import { AppContextProvider } from './data/AppContext';
import { connect } from './data/connect';
import { loadConfData } from './data/sessions/sessions.actions';
import {
  loadUserData,
  setIsLoggedIn,
  setUsername,
} from './data/user/user.actions';
import { Schedule } from './models/Schedule';
import Account from './pages/Account';
import Login from './pages/Login';
import MainTabs from './pages/MainTabs';
import Signup from './pages/Signup';
import Support from './pages/Support';
import Tutorial from './pages/Tutorial';
import Chat from './pages/chat';
import Evalution from './pages/evalution';
import Question from './pages/question';
import Task from './pages/task';
import TaskBriefing from './pages/taskBriefing';
import TaskListPage from './pages/taskListPage';
import { getHealth, loginByPassword } from './services/api';
import { useUserStore } from './stores/userStore';

setupIonicReact();

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonicAppConnected />
    </AppContextProvider>
  );
};

interface StateProps {
  darkMode: boolean;
  schedule: Schedule;
}

interface DispatchProps {
  loadConfData: typeof loadConfData;
  loadUserData: typeof loadUserData;
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
}

interface IonicAppProps extends StateProps, DispatchProps {}

const IonicApp: React.FC<IonicAppProps> = ({
  darkMode,
  schedule,
  setIsLoggedIn,
  setUsername,
  loadConfData,
  loadUserData,
}) => {
  const { setUser } = useUserStore();
  const [presentToast] = useIonToast();

  useEffect(() => {
    checkHealth();
    initLogin();
    loadUserData();
    loadConfData();
    // eslint-disable-next-line
  }, []);

  const checkHealth = async () => {
    try {
      const response = await getHealth();
      console.log('checkHealth============', response);
      presentToast({
        message: '健康检查成功',
        duration: 3500,
        position: 'top',
      });
    } catch (error) {
      console.log(error);
      presentToast({
        message: error as string,
        duration: 3500,
        position: 'top',
      });
    }
  };

  const initLogin = async () => {
    try {
      const response = await loginByPassword(
        'root',
        '53e880894f3cc53d5071c679f1afcd223a3faca09148c6898da13f0afc3535ad'
      );
      localStorage.setItem('token', response.data.token);

      // 存储用户ID到zustand store
      if (response.data.user && response.data.user._id) {
        setUser(response.data.user._id, response.data.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return schedule.groups.length === 0 ? (
    <div></div>
  ) : (
    <IonApp className={`${darkMode ? 'ion-palette-dark' : ''}`}>
      <IonReactRouter>
        <IonSplitPane contentId='main'>
          <Menu />
          <IonRouterOutlet id='main'>
            {/*
                We use IonRoute here to keep the tabs state intact,
                which makes transitions between tabs and non tab pages smooth
                */}
            <Route path='/tabs' render={() => <MainTabs />} />
            <Route path='/account' component={Account} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/support' component={Support} />
            <Route path='/tutorial' component={Tutorial} />
            <Route path='/task-briefing' component={TaskBriefing} />
            <Route path='/question' component={Question} />

            <Route path='/task' component={Task} />
            <Route path='/taskListPage' component={TaskListPage} />
            <Route path='/evalution' component={Evalution} />
            <Route path='/chat' component={Chat} />
            <Route path='/menudemo' component={Menudemo} />
            <Route
              path='/logout'
              render={() => {
                return (
                  <RedirectToLogin
                    setIsLoggedIn={setIsLoggedIn}
                    setUsername={setUsername}
                  />
                );
              }}
            />
            <Route path='/' component={HomeOrTutorial} exact />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

const IonicAppConnected = connect<{}, StateProps, DispatchProps>({
  mapStateToProps: state => ({
    darkMode: state.user.darkMode,
    schedule: state.data.schedule,
  }),
  mapDispatchToProps: {
    loadConfData,
    loadUserData,
    setIsLoggedIn,
    setUsername,
  },
  component: IonicApp,
});
