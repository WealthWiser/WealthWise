import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../utils/theme';

const BudgetScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Budget Screen</Text>
      <Text style={styles.subtitle}>
        Track and manage your budget here.
      </Text>
    </View>
  );
};

export default BudgetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutralBackground,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.blueDark,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.grayDark,
    marginTop: 8,
    textAlign: 'center',
  },
});
