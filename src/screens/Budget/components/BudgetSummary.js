// src/screens/Budget/components/BudgetSummary.js
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
            name="activity"
            size={24}
            color={Colors.primaryDeep}
            style={styles.aiIcon}
          />
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>Budget Insights</Text>
            <Text style={styles.aiContent}>
              {summary.totalSpent > summary.totalAllocated
                ? `You're over budget by ₹${(
                    summary.totalSpent - summary.totalAllocated
                  ).toLocaleString()}. Consider reducing expenses.`
                : summary.totalSpent > summary.totalAllocated * 0.8
                ? `You've used ${(
                    (summary.totalSpent / summary.totalAllocated) *
                    100
                  ).toFixed(0)}% of your budget. Monitor your spending closely.`
                : summary.overdueCount > 0
                ? `You have ${summary.overdueCount} budget(s) that need renewal.`
                : summary.activeCount > 0
                ? `You're managing ${summary.activeCount} active budgets well. Keep it up!`
                : 'Create your first budget to start tracking expenses.'}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
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
    color: Colors.textSecondary || Colors.textPrimary, // Fallback if textSecondary doesn't exist
    marginBottom: Spacing.sm,
    fontFamily: Fonts.regular || Fonts.primary, // Fallback if regular doesn't exist
  },
  summaryValue: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    fontFamily: Fonts.bold || Fonts.heading, // Fallback if bold doesn't exist
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
  aiIcon: {
    marginRight: Spacing.md,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.primaryDeep,
    marginBottom: Spacing.xs,
    fontFamily: Fonts.bold || Fonts.heading,
  },
  aiContent: {
    fontSize: FontSizes.sm,
    color: Colors.textDark,
    lineHeight: 20,
    fontFamily: Fonts.regular || Fonts.primary,
  },
});

export default BudgetSummary;
