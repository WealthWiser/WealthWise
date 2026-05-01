import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 12 }}>Starting WealthWise…</Text>
    </View>
  );
};

export default SplashScreen;
