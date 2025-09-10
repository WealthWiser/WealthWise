import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { dummyTransactions } from '../../dummyData';
import { Colors, FontSizes, Spacing } from '../../utils/theme';

const { width } = Dimensions.get('window');

export default function TransactionsScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All'); // All / Credit / Debit

  // Filter transactions
  const filteredTransactions = dummyTransactions.filter(t => {
    const searchMatch = t.remark
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const typeMatch = typeFilter === 'All' || t.type === typeFilter;
    return searchMatch && typeMatch;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={26} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Transactions</Text>
      </View>

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
                      item.type === 'Credit'
                        ? Colors.accentTeal
                        : Colors.accentPink,
                  },
                ]}
              >
                <Text style={styles.transactionIconText}>
                  {item.type === 'Credit' ? '↑' : '↓'}
                </Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>
                  {item.remark || 'No Remark'}
                </Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      item.type === 'Credit'
                        ? Colors.accentTeal
                        : Colors.accentPink,
                  },
                ]}
              >
                {item.type === 'Credit' ? '+' : '-'}₹{item.amount}
              </Text>
              <Text style={styles.transactionType}>{item.type}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{
          paddingRight: Spacing.md,
          paddingLeft: Spacing.sm,
          paddingBottom: 150,
        }}
      />

      {/* Buttons */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('ManualEntry')}
      >
        <Text style={styles.buttonText}>+ Add Transaction</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('UploadTransaction')}
      >
        <Text style={styles.buttonText}>Upload Bank Statement</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginLeft: 12,
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
  transactionDetails: { flex: 1 },
  transactionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textDark,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  transactionRight: { alignItems: 'flex-end' },
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
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButton: {
    backgroundColor: Colors.textPrimary,
    padding: Spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: '600',
  },
});
