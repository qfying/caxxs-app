import React from 'react';
import { Redirect } from 'react-router';
import { connect } from '../data/connect';

interface StateProps {
  hasSeenTutorial: boolean;
}

const HomeOrTutorial: React.FC<StateProps> = ({ hasSeenTutorial }) => {
  return hasSeenTutorial ? (
    <Redirect to='/login' />
  ) : (
    <Redirect to='/login' />
    // <Redirect to='/tutorial' />
  );
};

export default connect<{}, StateProps, {}>({
  mapStateToProps: state => ({
    hasSeenTutorial: state.user.hasSeenTutorial,
  }),
  component: HomeOrTutorial,
});
