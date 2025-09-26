import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {
  Colors,
  Spacing,
  FontSizes,
  Fonts,
  FontWeights,
} from '../../../utils/theme';
import { CATEGORY_OPTIONS } from '../constants';

const BudgetItem = ({ item, spent = 0, onEdit, onDelete }) => {
  const progress = item.amount > 0 ? spent / item.amount : 0;
  const remaining = item.amount - spent;
  const isOverspent = progress > 1;
  const isNearLimit = progress > 0.8 && progress <= 1;

  const getCategoryConfig = categoryName => {
    return (
      CATEGORY_OPTIONS.find(cat => cat.value === categoryName) ||
      CATEGORY_OPTIONS[CATEGORY_OPTIONS.length - 1]
    );
  };

  const categoryConfig = getCategoryConfig(item.category);

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity
      style={[styles.budgetItemCard, isOverspent && styles.overspentCard]}
      activeOpacity={0.7}
      onLongPress={() => onEdit(item)}
    >
      <View style={styles.budgetItemHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: categoryConfig.color },
          ]}
        >
          <Feather name={categoryConfig.icon} size={20} color={Colors.white} />
        </View>
        <View style={styles.budgetTextContainer}>
          <Text style={styles.budgetCategory}>{item.category}</Text>
          <Text style={styles.budgetPeriod}>
            {formatDate(item.start_date)} - {formatDate(item.end_date)}
          </Text>
          <Text style={styles.budgetAmount}>
            ₹{spent.toLocaleString()} / ₹{item.amount.toLocaleString()}
          </Text>
        </View>
        <View style={styles.remainingContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="trash-2" size={16} color={Colors.accentCoral} />
          </TouchableOpacity>
          <Text
            style={[styles.remainingText, isOverspent && styles.overspentText]}
          >
            {isOverspent
              ? `₹${Math.abs(remaining).toLocaleString()} Over`
              : `₹${remaining.toLocaleString()} Left`}
          </Text>
          {isNearLimit && !isOverspent && (
            <Feather
              name="alert-triangle"
              size={14}
              color={Colors.gold}
              style={{ marginTop: 2 }}
            />
          )}
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${Math.min(progress, 1) * 100}%`,
              backgroundColor: isOverspent
                ? Colors.accentCoral
                : isNearLimit
                ? Colors.gold
                : categoryConfig.color,
            },
          ]}
        />
      </View>

      {isOverspent && (
        <View style={styles.warningContainer}>
          <Feather name="alert-circle" size={16} color={Colors.accentCoral} />
          <Text style={styles.warningText}>Budget exceeded!</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  budgetItemCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  overspentCard: { borderColor: Colors.accentCoral, borderWidth: 1 },
  budgetItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  budgetTextContainer: { flex: 1 },
  budgetCategory: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    fontFamily: Fonts.bold,
  },
  budgetPeriod: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
  },
  budgetAmount: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  remainingContainer: { alignItems: 'flex-end' },
  deleteButton: { marginBottom: Spacing.xs },
  remainingText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    color: Colors.accentTeal,
    fontFamily: Fonts.bold,
  },
  overspentText: { color: Colors.accentCoral },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: Spacing.sm,
  },
  progressBar: { height: '100%', borderRadius: 4 },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  warningText: {
    marginLeft: Spacing.xs,
    fontSize: FontSizes.sm,
    color: Colors.accentCoral,
    fontFamily: Fonts.regular,
  },
});

export default BudgetItem;
