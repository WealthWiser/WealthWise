import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator from './BottomTabNavigator';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ViewProfileScreen from '../screens/Profile/ViewProfileScreen';
import TransactionsScreen from '../screens/Transaction/TransactionsScreen';
import RiskAnalysisScreen from '../screens/Invest/InvestmentScreen';

const Stack = createNativeStackNavigator();

const PrivateNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false}}
    >
      <Stack.Screen name="HomeTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="RiskAnalysis" component={RiskAnalysisScreen} />
    </Stack.Navigator>
  );
};

export default PrivateNavigator;
