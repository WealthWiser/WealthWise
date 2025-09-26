import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FAB } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Spacing, FontSizes, Fonts, FontWeights } from '../../utils/theme';

const demoBudgets = [
  {
    id: '1',
    category: 'Groceries',
    allocated: 10000,
    spent: 6200,
    icon: 'shopping-cart',
    color: Colors.accentTeal,
  },
  {
    id: '2',
    category: 'Entertainment',
    allocated: 5000,
    spent: 3300, // Increased spending for AI insight
    icon: 'film',
    color: Colors.accentPink,
  },
  {
    id: '3',
    category: 'Transport',
    allocated: 3000,
    spent: 3100,
    icon: 'truck',
    color: Colors.accentCoral,
  },
  {
    id: '4',
    category: 'Utilities',
    allocated: 4000,
    spent: 1500,
    icon: 'home',
    color: Colors.primaryDark,
  }
];

const BudgetListItem = ({ item }) => {
  const { category, allocated, spent, icon, color } = item;
  const progress = spent / allocated;
  const remaining = allocated - spent;
  const isOverspent = progress > 1;

  return (
    <TouchableOpacity style={styles.budgetItemCard} activeOpacity={0.8}>
      <View style={styles.budgetItemHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Feather name={icon} size={22} color={Colors.white} />
        </View>
        <View style={styles.budgetTextContainer}>
          <Text style={styles.budgetCategory}>{category}</Text>
          <Text style={styles.budgetAmount}>
            ₹{spent.toLocaleString()} / ₹{allocated.toLocaleString()}
          </Text>
        </View>
        <View style={styles.remainingContainer}>
           <Text style={[styles.remainingText, isOverspent && styles.overspentText]}>
            {isOverspent ? `₹${Math.abs(remaining).toLocaleString()} Over` : `₹${remaining.toLocaleString()} Left`}
          </Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${Math.min(progress, 1) * 100}%`, backgroundColor: isOverspent ? Colors.accentCoral : color }]} />
      </View>
    </TouchableOpacity>
  );
};

const BudgetScreen = () => {
  const [budgets] = useState(demoBudgets);

  const summary = useMemo(() => {
    const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalAllocated - totalSpent;
    return { totalAllocated, totalSpent, totalRemaining };
  }, [budgets]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Monthly Budgets</Text>
        <Text style={styles.subtitle}>Here is your financial overview for the month.</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Allocated</Text>
            <Text style={styles.summaryValue}>₹{summary.totalAllocated.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Spent</Text>
            <Text style={styles.summaryValue}>₹{summary.totalSpent.toLocaleString()}</Text>
          </View>
           <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.summaryValue, {color: summary.totalRemaining < 0 ? Colors.accentCoral : Colors.accentTeal}]}>
              ₹{summary.totalRemaining.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* --- [AI FEATURE] AI Insight Card --- */}
        <View style={styles.aiInsightCard}>
            <Feather name="zap" size={24} color={Colors.primaryDeep} style={styles.aiIcon} />
            <View style={styles.aiTextContainer}>
                <Text style={styles.aiTitle}>AI Financial Insight</Text>
                <Text style={styles.aiContent}>
                    Your spending on 'Entertainment' is 25% higher than last month. Consider reallocating funds to stay on track with your savings goals.
                </Text>
            </View>
        </View>
        {/* --- End AI Feature --- */}


        <Text style={styles.listHeader}>Category Breakdown</Text>
        {budgets.map(budget => (
          <BudgetListItem key={budget.id} item={budget} />
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        color={Colors.white}
        onPress={() => console.log('Add new budget')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  container: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  title: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.primary,
    color: Colors.grayDark,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    backgroundColor: Colors.primaryDeep,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.sm,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontFamily: Fonts.heading,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semiBold,
    color: Colors.white,
  },
  summaryDivider: {
      width: 1,
      height: '60%',
      backgroundColor: Colors.neutralBackground,
  },
  // --- AI Insight Card Styles ---
  aiInsightCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  aiIcon: {
      marginRight: Spacing.md,
  },
  aiTextContainer: {
      flex: 1,
  },
  aiTitle: {
      fontFamily: Fonts.heading,
      fontWeight: FontWeights.bold,
      color: Colors.primaryDeep,
      fontSize: FontSizes.md,
      marginBottom: Spacing.xs,
  },
  aiContent: {
      fontFamily: Fonts.primary,
      color: Colors.textPrimary,
      fontSize: FontSizes.sm,
      lineHeight: 20,
  },
  // ---
  listHeader: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  budgetItemCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  budgetItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  budgetTextContainer: {
    flex: 1,
  },
  budgetCategory: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.semiBold,
    color: Colors.textPrimary,
  },
  budgetAmount: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.primary,
    color: Colors.grayDark,
    marginTop: 2,
  },
  remainingContainer: {
    alignItems: 'flex-end',
  },
  remainingText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.medium,
    color: Colors.grayDark,
  },
  overspentText: {
    color: Colors.accentCoral,
    fontWeight: FontWeights.bold,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutralBackground,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  fab: {
    position: 'absolute',
    margin: Spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: 28,
  },
});

export default BudgetScreen;