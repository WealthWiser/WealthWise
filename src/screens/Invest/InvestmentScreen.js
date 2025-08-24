import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../utils/theme';

const InvestmentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investment Screen</Text>
      <Text style={styles.subtitle}>
        Explore investment opportunities tailored for you.
      </Text>
    </View>
  );
};

export default InvestmentScreen;

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
