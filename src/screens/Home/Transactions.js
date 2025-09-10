import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal, // Import Modal
  Pressable, // Import Pressable for modal background
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTransactions } from '../../redux/slices/transactionSlice';
import {SafeAreaView} from 'react-native-safe-area-context'
import Feather from "react-native-vector-icons/Feather"
import { Colors } from '../../utils/theme';
// Helper function to format dates for display
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Main Screen Component
const TransactionsScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.transactions);

  // State for filter modal and inputs
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [monthFilter, setMonthFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions(userId));
  }, [dispatch, userId]);

  // useMemo now depends on filter states and applies them
  const { sections, monthlyTotal } = useMemo(() => {
    if (!data || data.length === 0) {
      return { sections: [], monthlyTotal: 0 };
    }

    // 1. Apply Filters
    let filteredData = [...data];

    // Month filter logic (case-insensitive)
    if (monthFilter.trim()) {
      filteredData = filteredData.filter(t => {
        const transactionMonth = new Date(t.txn_date).toLocaleString('default', { month: 'long' });
        return transactionMonth.toLowerCase().includes(monthFilter.trim().toLowerCase());
      });
    }

    // Amount filter logic (handles ">" and "<")
    if (amountFilter.trim()) {
      const operator = amountFilter[0];
      const value = parseFloat(amountFilter.substring(1));
      if (!isNaN(value) && (operator === '>' || operator === '<')) {
        filteredData = filteredData.filter(t => {
          const amount = Math.abs(t.amount); // Compare absolute amount
          return operator === '>' ? amount > value : amount < value;
        });
      }
    }

    // 2. Sort transactions by date, newest first
    const sortedData = filteredData.sort((a, b) => new Date(b.txn_date) - new Date(a.txn_date));

    // Calculate total spend for the current month (unaffected by filters)
    const now = new Date();
    const currentMonthTotal = data // Calculate from original data
      .filter(t => {
        const tDate = new Date(t.txn_date);
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear() && t.amount < 0;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    // 3. Group sorted transactions by date
    const groupedData = sortedData.reduce((acc, transaction) => {
      const date = transaction.txn_date.split('T')[0];
      const section = acc.find((s) => s.title === date);
      if (section) {
        section.data.push(transaction);
      } else {
        acc.push({ title: date, data: [transaction] });
      }
      return acc;
    }, []);

    return { sections: groupedData, monthlyTotal: Math.abs(currentMonthTotal) };
  }, [data, monthFilter, amountFilter]); // Rerun when data or filters change

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Feather name={'chevron-left'} color={Colors.blueDark} size={24} />
          {/* <Text style={styles.headerButtonText}>{'<'}</Text> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.headerButton}>
          {/* <Text style={styles.headerButtonText}>{'Filter'}</Text> */}
          <Feather name={'filter'} color={Colors.blueDark} size={24} />
        </TouchableOpacity>
      </View>

      {/* ===== FILTER MODAL ===== */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.sectionTitle}>Filters</Text>
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
              <TouchableOpacity style={styles.clearButton} onPress={() => { setMonthFilter(''); setAmountFilter(''); }}>
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.applyButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* ===== TOTAL SPEND CARD ===== */}
      <View style={styles.totalSpendCard}>
        <Text style={styles.totalSpendTitle}>This Month's Spend</Text>
        <Text style={styles.totalSpendAmount}>${monthlyTotal.toFixed(2)}</Text>
      </View>

      {/* ===== TRANSACTIONS LIST (UNCHANGED UI) ===== */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDescription}>{item.category.transaction_type}</Text>
              <Text style={styles.balanceText}>Balance: ₹{item.balance.toFixed(2)}</Text>
            </View>
            <Text style={item.amount > 0 ? styles.amountCredit : styles.amountDebit}>
              {item.amount > 0 ? `+₹${item.amount.toFixed(2)}` : `-₹${Math.abs(item.amount).toFixed(2)}`}
            </Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{formatDate(title)}</Text>
        )}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyListText}>No transactions found for the selected filters.</Text>}
      />
    </SafeAreaView>
  );
}
export default TransactionsScreen;

// ===== STYLES =====
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    marginTop: 10,
  },
  // Filters
  filtersContainer: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  filterInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#DDE1E6',
    width: '48%',
  },
  // Total Spend Card
  totalSpendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalSpendTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  totalSpendAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 4,
  },
  // SectionList Styles
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#F4F6F8', // Same as container background
    paddingVertical: 10,
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8ECF1',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
  },
  balanceText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 4,
  },
  amountCredit: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60', // Green for income
  },
  amountDebit: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E', // Dark blue/black for expense
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: '#E0E0E0',
    // backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerButton: {
    padding: 5, // For easier tapping
  },
  headerButtonText: {
    fontSize: 18,
    color: Colors.blueDark, // iOS blue
    fontWeight: '600',
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Position modal at the bottom
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    backgroundColor: '#F4F6F8',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDE1E6',
    width: '100%',
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
    backgroundColor: '#007AFF',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});