import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../../redux/slices/transactionSlice';
import { Colors, FontSizes, Spacing } from '../../utils/theme';

const { width } = Dimensions.get('window');

// Helper function to format dates for display
const formatDate = dateString => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function TransactionsScreen({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { userId } = route.params;

  const { data, loading, error } = useSelector(state => state.transactions);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All'); // All / Credit / Debit
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Filter modal states
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [monthFilter, setMonthFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState('');

  // Manual entry form state
  const [remark, setRemark] = useState('');
  const [amount, setAmount] = useState('');
  const [txnType, setTxnType] = useState('Credit');

  useEffect(() => {
    dispatch(fetchTransactions(userId));
  }, [dispatch, userId]);

  // Apply search + type filters + advanced filters
  const { filteredTransactions, monthlyTotal } = useMemo(() => {
    if (!data || data.length === 0) {
      return { filteredTransactions: [], monthlyTotal: 0 };
    }

    let filtered = [...data];

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(t =>
        (t.remark || t.category?.transaction_type || '')
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      );
    }

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(t => {
        if (typeFilter === 'Credit') return t.amount > 0;
        if (typeFilter === 'Debit') return t.amount < 0;
        return true;
      });
    }

    // Month filter logic (case-insensitive)
    if (monthFilter.trim()) {
      filtered = filtered.filter(t => {
        const transactionMonth = new Date(t.txn_date || t.date).toLocaleString(
          'default',
          { month: 'long' },
        );
        return transactionMonth
          .toLowerCase()
          .includes(monthFilter.trim().toLowerCase());
      });
    }

    // Amount filter logic (handles ">" and "<")
    if (amountFilter.trim()) {
      const operator = amountFilter[0];
      const value = parseFloat(amountFilter.substring(1));
      if (!isNaN(value) && (operator === '>' || operator === '<')) {
        filtered = filtered.filter(t => {
          const amount = Math.abs(t.amount);
          return operator === '>' ? amount > value : amount < value;
        });
      }
    }

    // Sort by date, newest first
    const sortedFiltered = filtered.sort((a, b) => {
      const dateA = new Date(a.txn_date || a.date);
      const dateB = new Date(b.txn_date || b.date);
      return dateB - dateA;
    });

    // Calculate monthly total from original data
    const now = new Date();
    const currentMonthTotal = data
      .filter(t => {
        const tDate = new Date(t.txn_date || t.date);
        return (
          tDate.getMonth() === now.getMonth() &&
          tDate.getFullYear() === now.getFullYear() &&
          t.amount < 0
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      filteredTransactions: sortedFiltered,
      monthlyTotal: Math.abs(currentMonthTotal),
    };
  }, [data, search, typeFilter, monthFilter, amountFilter]);

  // Handle manual transaction add (local only for now)
  const handleAddTransaction = () => {
    if (!remark || !amount) return;
    const newTxn = {
      id: Date.now(),
      remark,
      amount: txnType === 'Credit' ? Number(amount) : -Number(amount),
      type: txnType,
      date: new Date().toLocaleDateString(),
      txn_date: new Date().toISOString(),
      category: { transaction_type: remark },
      balance: 0, // Will be calculated properly in real implementation
    };
    // NOTE: In future, insert to Supabase instead of local push
    data.unshift(newTxn);
    setIsModalVisible(false);
    setRemark('');
    setAmount('');
    setTxnType('Credit');
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Feather name="chevron-left" size={24} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Transactions</Text>
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={styles.headerButton}
        >
          <Feather name="filter" size={24} color={Colors.textDark} />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setFilterModalVisible(false)}
        >
          <View
            style={styles.filterModalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>Advanced Filters</Text>
            <TextInput
              placeholder="Month (e.g., September)"
              value={monthFilter}
              onChangeText={setMonthFilter}
              style={styles.input}
            />
            <TextInput
              placeholder="Amount (e.g., >100 or <50)"
              value={amountFilter}
              onChangeText={setAmountFilter}
              style={[styles.input, { marginTop: 10 }]}
              keyboardType="numeric"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setMonthFilter('');
                  setAmountFilter('');
                }}
              >
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by category..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Type Filters */}
      <View style={styles.filterRow}>
        {['All', 'Credit', 'Debit'].map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              typeFilter === f && styles.filterButtonActive,
            ]}
            onPress={() => setTypeFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                typeFilter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
              <View
                style={[
                  styles.transactionIcon,
                  {
                    backgroundColor:
                      item.amount > 0 ? Colors.accentTeal : Colors.accentPink,
                  },
                ]}
              >
                <Text style={styles.transactionIconText}>
                  {item.amount > 0 ? '↑' : '↓'}
                </Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>
                  {item.category?.category &&
                  !/^unknown(\s*\(\d+\))?$/i.test(item.category.category.trim())
                    ? item.category.category
                    : 'Other'}
                </Text>
                <Text style={styles.transactionDate}>
                  {item.date || formatDate(item.txn_date)}
                </Text>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      item.amount > 0 ? Colors.accentTeal : Colors.accentPink,
                  },
                ]}
              >
                {item.amount > 0 ? '+' : '-'}₹{Math.abs(item.amount).toFixed(2)}
              </Text>
              <Text style={styles.transactionType}>
                {item.amount > 0 ? 'Credit' : 'Debit'}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={{
          paddingRight: Spacing.md,
          paddingLeft: Spacing.sm,
          paddingBottom: 150,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            No transactions found for the selected filters.
          </Text>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <Feather name="plus" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Manual Entry Modal */}
      <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsModalVisible(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <TextInput
              style={styles.input}
              placeholder="Remark"
              value={remark}
              onChangeText={setRemark}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <View style={styles.filterRow}>
              {['Credit', 'Debit'].map(f => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterButton,
                    txnType === f && styles.filterButtonActive,
                  ]}
                  onPress={() => setTxnType(f)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      txnType === f && styles.filterTextActive,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAddTransaction}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: Spacing.md,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textDark,
  },

  searchBar: {
    borderWidth: 1,
    borderColor: Colors.textPrimary + '33',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    backgroundColor: Colors.background,
    color: Colors.textDark,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterButtonActive: {
    backgroundColor: Colors.primaryDeep,
    borderColor: Colors.primaryDeep,
  },
  filterText: {
    color: Colors.textDark,
  },
  filterTextActive: {
    color: Colors.textLight,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  transactionIconText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 18,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textDark,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  balanceText: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
  },
  transactionType: {
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  filterModalContent: {
    backgroundColor: '#fff',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.textDark,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.textPrimary + '33',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: Colors.background,
    color: Colors.textDark,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#EAECEE',
  },
  clearButtonText: {
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    color: Colors.textPrimary,
    fontSize: 16,
    marginTop: 50,
  },
});
