import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import PublicNavigator from './PublicNavigator';
import PrivateNavigator from './PrivateNavigator';
import SplashScreen from './SplashScreen';

const AppNavigator = () => {
  const authStatus = useSelector(state => state.auth.status);
  console.log('[NAV] auth status:', authStatus);

  if (authStatus === 'loading') {
    return <SplashScreen />;
  }
  return (
    <NavigationContainer>
      {authStatus === 'authenticated' ? (
        <PrivateNavigator />
      ) : (
        <PublicNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;