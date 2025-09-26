import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FAB, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';

import {
  fetchBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  calculateBudgetSpending,
} from '../../redux/slices/budgetSlice';

import BudgetItem from './components/BudgetItem';
import BudgetFormModal from './components/BudgetFormModal';
import BudgetSummary from './components/BudgetSummary';
import EmptyState from './components/EmptyState';
import {
  Colors,
  Spacing,
  FontSizes,
  Fonts,
  FontWeights,
} from '../../utils/theme';

const BudgetScreen = () => {
  const dispatch = useDispatch();
  const {
    data: budgets,
    spentAmounts,
    loading,
    creating,
    updating,
  } = useSelector(state => state.budgets);
  const { data: transactions } = useSelector(state => state.transactions);

  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchUserAndBudgets = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        dispatch(fetchBudgets(user.id));
      }
    };
    fetchUserAndBudgets();
  }, [dispatch]);

  useEffect(() => {
    if (userId && budgets.length > 0) {
      dispatch(calculateBudgetSpending({ userId, budgets }));
    }
  }, [dispatch, userId, budgets, transactions]);

  const summary = useMemo(() => {
    const totalAllocated = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = Object.values(spentAmounts).reduce(
      (sum, spent) => sum + spent,
      0,
    );
    const totalRemaining = totalAllocated - totalSpent;
    const activeCount = budgets.length;
    const overdueCount = budgets.filter(
      b => new Date(b.end_date) < new Date(),
    ).length;
    return {
      totalAllocated,
      totalSpent,
      totalRemaining,
      activeCount,
      overdueCount,
    };
  }, [budgets, spentAmounts]);

  const handleRefresh = async () => {
    if (userId) {
      setRefreshing(true);
      await dispatch(fetchBudgets(userId));
      setRefreshing(false);
    }
  };

  const handleSaveBudget = async budgetData => {
    try {
      if (editingBudget) {
        await dispatch(
          updateBudget({ budgetId: editingBudget.id, budgetData }),
        ).unwrap();
        setSnackbarMessage('Budget updated successfully!');
      } else {
        await dispatch(createBudget({ userId, budgetData })).unwrap();
        setSnackbarMessage('Budget created successfully!');
      }
      setShowModal(false);
      setEditingBudget(null);
      setSnackbarVisible(true);
    } catch (error) {
      Alert.alert('Error', error || 'Failed to save budget');
    }
  };

  const handleDeleteBudget = budgetId => {
    Alert.alert('Delete Budget', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteBudget(budgetId)).unwrap();
            setSnackbarMessage('Budget deleted successfully!');
            setSnackbarVisible(true);
          } catch (error) {
            Alert.alert('Error', error || 'Failed to delete budget');
          }
        },
      },
    ]);
  };

  const openEditModal = budget => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingBudget(null);
    setShowModal(true);
  };

  if (loading && budgets.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading budgets...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.title}>Budget Management</Text>
        <Text style={styles.subtitle}>
          Track and manage your spending limits
        </Text>

        <BudgetSummary summary={summary} hasBudgets={budgets.length > 0} />

        <Text style={styles.listHeader}>Your Budgets</Text>
        {budgets.length === 0 ? (
          <EmptyState />
        ) : (
          budgets.map(budget => (
            <BudgetItem
              key={budget.id}
              item={budget}
              spent={spentAmounts[budget.id] || 0}
              onEdit={openEditModal}
              onDelete={handleDeleteBudget}
            />
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        color={Colors.white}
        onPress={openCreateModal}
        loading={creating}
      />

      <BudgetFormModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBudget(null);
        }}
        budget={editingBudget}
        onSave={handleSaveBudget}
        loading={creating || updating}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: Colors.accentTeal }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  container: { padding: Spacing.md, paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: Spacing.sm,
    fontFamily: Fonts.bold,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    fontFamily: Fonts.regular,
  },
  listHeader: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    marginBottom: Spacing.md,
    fontFamily: Fonts.bold,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
});

export default BudgetScreen;
