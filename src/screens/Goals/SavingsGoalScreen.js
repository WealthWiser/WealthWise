// screens/SavingsGoalScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FAB } from 'react-native-paper';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors, Spacing, FontSizes, Fonts, FontWeights } from '../../utils/theme';

const demoGoals = [
  {
    id: '1',
    title: 'European Vacation',
    targetAmount: 250000,
    savedAmount: 112500,
    deadline: moment().add(8, 'months'),
    icon: 'map-pin',
    color: Colors.primaryDark,
    aiSuggestion: "Contribute an extra ₹2,100 weekly to reach your goal 45 days sooner.",
  },
  {
    id: '2',
    title: 'New MacBook Pro',
    targetAmount: 180000,
    savedAmount: 165000,
    deadline: moment().add(2, 'months'),
    icon: 'laptop',
    color: Colors.accentTeal,
    aiSuggestion: "You're 92% there! Sell your old laptop to fund the remaining amount.",
  },
  {
    id: '3',
    title: 'Home Down Payment',
    targetAmount: 1500000,
    savedAmount: 450000,
    deadline: moment().add(2, 'years'),
    icon: 'home',
    color: Colors.accentPink,
    aiSuggestion: "Explore low-risk index funds to potentially accelerate your progress.",
  },
  {
    id: '4',
    title: 'Emergency Fund',
    targetAmount: 50000,
    savedAmount: 50000,
    deadline: moment().add(3, 'months'),
    icon: 'shield',
    color: Colors.accentCoral,
    aiSuggestion: "Goal complete! Consider starting a new investment goal now.",
  },
];

const GoalCard = ({ goal }) => {
  const { title, targetAmount, savedAmount, deadline, icon, color, aiSuggestion } = goal;

  const progress = savedAmount >= targetAmount ? 1 : savedAmount / targetAmount;
  const isCompleted = savedAmount >= targetAmount;
  const daysLeft = moment(deadline).diff(moment(), 'days');
  const amountRemaining = targetAmount - savedAmount;

  return (
    <View style={styles.goalCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: isCompleted ? Colors.accentTeal : color }]}>
          <Feather name={isCompleted ? 'check-circle' : icon} size={24} color={Colors.white} />
        </View>
        <Text style={styles.goalTitle}>{title}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.savedAmount}>₹{savedAmount.toLocaleString()}</Text>
        <Text style={styles.targetAmount}> of ₹{targetAmount.toLocaleString()}</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: isCompleted ? Colors.accentTeal : color }]} />
      </View>

      <View style={styles.cardFooter}>
         {isCompleted ? (
            // ✅ EMOJI FIX: Replaced '🎉' emoji with a reliable Feather icon
            <View style={styles.footerCompleteContainer}>
              <Feather name="award" size={18} color={Colors.accentTeal} />
              <Text style={styles.footerTextComplete}> Goal Achieved!</Text>
            </View>
         ) : (
           <>
            <Text style={styles.footerText}>{Math.round(progress * 100)}% complete</Text>
            <Text style={styles.footerText}>{daysLeft > 0 ? `${daysLeft} days left` : 'Deadline Passed'}</Text>
           </>
         )}
      </View>

      <View style={styles.aiSuggestionBox}>
        <Ionicons name="sparkles" size={20} color={Colors.primaryDeep} style={styles.aiIcon} />
        <View style={styles.aiTextContainer}>
          <Text style={styles.aiSuggestionText}>{aiSuggestion}</Text>
        </View>
      </View>

      {/* ✅ BUTTON MOVED: The "Add Funds" button is now in its own dedicated action row */}
      {!isCompleted && (
        <>
          <View style={styles.divider} />
          <View style={styles.actionRow}>
              <Text style={styles.remainingText}>
                  {`₹${amountRemaining.toLocaleString()} to go`}
              </Text>
              <TouchableOpacity style={[styles.actionButton, {borderColor: color}]}>
                  <Text style={[styles.actionButtonText, {color: color}]}>Add Funds</Text>
              </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const SavingsGoalScreen = () => {
  const [goals] = useState(demoGoals);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Savings Goals</Text>
        <Text style={styles.subtitle}>Your progress, powered by AI-driven advice.</Text>

        {goals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        color={Colors.white}
        onPress={() => console.log('Open Add Goal Modal')}
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
  goalCard: {
    backgroundColor: Colors.primaryDeep,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: Colors.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  goalTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.semiBold,
    color: Colors.backgroundLight,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.sm,
  },
  savedAmount: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  targetAmount: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.primary,
    color: Colors.backgroundLight,
    marginLeft: Spacing.xs,
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.neutralBackground,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 24, // Ensures layout consistency
  },
  footerText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.primary,
    color: Colors.backgroundLight,
  },
  footerCompleteContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerTextComplete: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.semiBold,
    color: Colors.backgroundLight,
  },
  aiSuggestionBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  aiIcon: {
    marginRight: Spacing.md,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiSuggestionText: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutralBackground,
    marginVertical: Spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.primary,
    color: Colors.backgroundLight,
    fontWeight: FontWeights.medium,
  },
  actionButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  actionButtonText: {
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.sm,
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

export default SavingsGoalScreen;