import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to WealthWise 🚀</Text>
      <Text style={styles.text}>Smart personal finance, budgeting, and investment recommendations — all in one place.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, textAlign: 'center', color: '#444' },
});

export default OnboardingScreen;
