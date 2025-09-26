import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {
  Colors,
  Spacing,
  FontSizes,
  Fonts,
  FontWeights,
} from '../../../utils/theme';

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Feather name="pie-chart" size={48} color={Colors.grayLight} />
    <Text style={styles.emptyStateTitle}>No budgets yet</Text>
    <Text style={styles.emptyStateText}>
      Create your first budget to start tracking your expenses
    </Text>
  </View>
);

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: Spacing.md,
  },
  emptyStateTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginTop: Spacing.md,
    fontFamily: Fonts.bold,
  },
  emptyStateText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    fontFamily: Fonts.regular,
  },
});

export default EmptyState;
