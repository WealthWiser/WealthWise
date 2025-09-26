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

const BudgetSummary = ({ summary, hasBudgets }) => {
  return (
    <>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.summaryLabel}>Total Allocated</Text>
          <Text style={styles.summaryValue}>
            ₹{summary.totalAllocated.toLocaleString()}
          </Text>
        </View>
        <View style={[styles.summaryCard, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={[styles.summaryValue, { color: Colors.accentCoral }]}>
            ₹{summary.totalSpent.toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { flex: 1.2, marginRight: 8 }]}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text
            style={[
              styles.summaryValue,
              {
                color:
                  summary.totalRemaining < 0
                    ? Colors.accentCoral
                    : Colors.accentTeal,
              },
            ]}
          >
            ₹{summary.totalRemaining.toLocaleString()}
          </Text>
        </View>
        <View style={[styles.summaryCard, { flex: 0.8, marginLeft: 8 }]}>
          <Text style={styles.summaryLabel}>Active</Text>
          <Text style={styles.summaryValue}>{summary.activeCount}</Text>
        </View>
      </View>

      {hasBudgets && (
        <View style={styles.aiInsightCard}>
          <Feather
            name="zap"
            size={24}
            color={Colors.primaryDeep}
            style={styles.aiIcon}
          />
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>Budget Insights</Text>
            <Text style={styles.aiContent}>
              {summary.totalSpent > summary.totalAllocated * 0.8
                ? "You're approaching your budget limits. Consider reviewing your expenses."
                : summary.overdueCount > 0
                ? `You have ${summary.overdueCount} budget(s) that need renewal.`
                : "You're staying within your budget limits. Great job!"}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  summaryRow: { flexDirection: 'row', marginBottom: Spacing.md },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontFamily: Fonts.regular,
  },
  summaryValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    fontFamily: Fonts.bold,
  },
  aiInsightCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderLeftColor: Colors.primaryDeep,
    borderLeftWidth: 5,
  },
  aiIcon: { marginRight: Spacing.md },
  aiTextContainer: { flex: 1 },
  aiTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.primaryDeep,
    marginBottom: Spacing.xs,
    fontFamily: Fonts.bold,
  },
  aiContent: {
    fontSize: FontSizes.sm,
    color: Colors.textDark,
    lineHeight: 20,
    fontFamily: Fonts.regular,
  },
});

export default BudgetSummary;
