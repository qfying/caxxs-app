import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { calendar, person, settings } from 'ionicons/icons';
import React from 'react';
import { Redirect, Route } from 'react-router';
import About from './About';
import './MainTabs.scss';
import MapView from './MapView';
import SchedulePage from './SchedulePage';
import SessionDetail from './SessionDetail';
import SpeakerDetail from './SpeakerDetail';
import SpeakerList from './SpeakerList';
import Chat from './chat';

import Profile from './profile';
import Task from './task';


interface MainTabsProps { }

const MainTabs: React.FC<MainTabsProps> = () => {
  return (
    <IonTabs className="main-tabs">
      <IonRouterOutlet>
        <Redirect exact path="/tabs" to="/tabs/task" />
        {/*
          Using the render method prop cuts down the number of renders your components will have due to route changes.
          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}

        <Route
          path="/tabs/task"
          render={() => <Task />}
          exact={true}
        />
        {/* <Route
          path="/tabs/task-briefing"
          render={() => <TaskBriefing />}
          exact={true}
        /> */}
        <Route
          path="/tabs/ai"
          render={() => <Chat />}
          exact={true}
        />
        <Route
          path="/tabs/profile"
          render={() => <Profile />}
          exact={true}
        />
        <Route
          path="/tabs/schedule"
          render={() => <SchedulePage />}
          exact={true}
        />
        <Route
          path="/tabs/speakers"
          render={() => <SpeakerList />}
          exact={true}
        />
        <Route
          path="/tabs/speakers/:id"
          component={SpeakerDetail}
          exact={true}
        />
        <Route path="/tabs/schedule/:id" component={SessionDetail} />
        <Route path="/tabs/speakers/sessions/:id" component={SessionDetail} />
        <Route path="/tabs/map" render={() => <MapView />} exact={true} />
        <Route path="/tabs/about" render={() => <About />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="task" href="/tabs/task">
          <IonIcon icon={calendar} />
          <IonLabel>任务</IonLabel>
        </IonTabButton>
        <IonTabButton tab="ai" href="/tabs/ai">
          <IonIcon icon={person} />
          <IonLabel>AI</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/tabs/profile">
          <IonIcon icon={settings} />
          <IonLabel>我的</IonLabel>
        </IonTabButton>

        {/* <IonTabButton tab="schedule" href="/tabs/schedule">
          <IonIcon icon={calendar} />
          <IonLabel>Schedule</IonLabel>
        </IonTabButton>
        <IonTabButton tab="speakers" href="/tabs/speakers">
          <IonIcon icon={people} />
          <IonLabel>Speakers</IonLabel>
        </IonTabButton> */}
        {/* <IonTabButton tab="map" href="/tabs/map">
          <IonIcon icon={location} />
          <IonLabel>Map</IonLabel>
        </IonTabButton> */}
        {/* <IonTabButton tab="about" href="/tabs/about">
          <IonIcon icon={informationCircle} />
          <IonLabel>About</IonLabel>
        </IonTabButton> */}
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
