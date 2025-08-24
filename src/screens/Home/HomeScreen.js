import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Colors, FontSizes, Spacing } from '../../utils/theme';
import { supabase } from '../../lib/supabase';
import { dummyTransactions } from '../../dummyData';

const HomeScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [profile, setProfile] = useState(null);
  const [latestTransactions, setLatestTransactions] = useState([]);

  // ✅ Fetch logged-in user profile
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error) setProfile(data);
    };

    fetchUser();
  }, []);

  // ✅ Calculate balance and prepare chart data
  useEffect(() => {
    const income = dummyTransactions
      .filter(txn => txn.type === 'Credit')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const expenses = dummyTransactions
      .filter(txn => txn.type === 'Debit')
      .reduce((sum, txn) => sum + txn.amount, 0);

    setTotalIncome(income);
    setTotalExpenses(expenses);
    setBalance(income - expenses);

    // ✅ Get latest 5 transactions
    const sorted = [...dummyTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    setLatestTransactions(sorted.slice(0, 5));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>WealthWise</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {profile
                  ? `${profile.first_name?.[0] || ''}${
                      profile.last_name?.[0] || ''
                    }`
                  : 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <Text style={styles.title}>
          Hi, {profile ? profile.first_name : 'User'}!
        </Text>
        <Text style={styles.subtitle}>Welcome back to WealthWise</Text>

        {/* Summary Cards */}
        <View style={styles.cardGrid}>
          {/* Row 1 */}
          <View style={[styles.cardRow, { marginBottom: 12 }]}>
            <View style={[styles.card, styles.cardBalance]}>
              <Text style={styles.cardLabel}>Current Balance</Text>
              <Text style={styles.cardValue}>₹{balance}</Text>
            </View>
            <View style={[styles.card, styles.cardIncome]}>
              <Text style={styles.cardLabel}>Total Income</Text>
              <Text style={[styles.cardValue, { color: 'green' }]}>
                ₹{totalIncome}
              </Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.cardRow}>
            <View style={[styles.card, styles.cardExpense]}>
              <Text style={styles.cardLabel}>Total Expenses</Text>
              <Text style={[styles.cardValue, { color: 'red' }]}>
                ₹{totalExpenses}
              </Text>
            </View>
            <View style={[styles.card, styles.cardTransactions]}>
              <Text style={styles.cardLabel}>No. of Transactions</Text>
              <Text style={styles.cardValue}>{dummyTransactions.length}</Text>
            </View>
          </View>
        </View>

        {/* ✅ Chart Section */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Expenses Over Time</Text>

          <View style={{ alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              {/* Chart */}
              <LineChart
                data={{
                  labels: dummyTransactions
                    .filter(txn => txn.type === 'Debit')
                    .map(txn => txn.date.slice(5)),
                  datasets: [
                    {
                      data: dummyTransactions
                        .filter(txn => txn.type === 'Debit')
                        .map(txn => txn.amount),
                      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 40} // give full width, less margin
                height={220}
                yAxisLabel="₹"
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#ff1744',
                  },
                }}
                bezier
                style={{ borderRadius: 12 }}
              />

              {/* ✅ Y-Axis Label Overlay */}
              <Text
                style={{
                  position: 'absolute',
                  left: -35,
                  top: 100,
                  transform: [{ rotate: '-90deg' }],
                  fontSize: 12,
                  color: 'gray',
                }}
              >
                Expenses (₹)
              </Text>
            </View>

            {/* X-Axis Label */}
            <Text style={{ fontSize: 12, color: 'gray' }}>
              Date
            </Text>
          </View>
        </View>

        {/* ✅ Latest Transactions Section */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Latest Transactions</Text>
          {latestTransactions.map((txn, index) => (
            <View key={index} style={styles.transactionItem}>
              <View>
                <Text style={styles.transactionTitle}>{txn.remark}</Text>
                <Text style={styles.transactionDate}>{txn.date}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: txn.type === 'Credit' ? 'green' : 'red' },
                ]}
              >
                {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutralBackground },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#a2a2a2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.text,
  },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: Spacing.lg },

  // Grid Styling
  cardGrid: {
    marginBottom: Spacing.lg,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 12,
  },
  cardBalance: { backgroundColor: '#E3F2FD' },
  cardIncome: { backgroundColor: '#E8F5E9' },
  cardExpense: { backgroundColor: '#FFEBEE' },
  cardTransactions: { backgroundColor: '#FFF3E0' },
  cardLabel: { fontSize: FontSizes.sm, color: 'gray', marginBottom: 4 },
  cardValue: { fontSize: FontSizes.lg, fontWeight: 'bold', color: Colors.text },

  // Chart Section
  chartSection: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.text,
  },

  // Transactions Section
  transactionsSection: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  transactionTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  transactionDate: { fontSize: 12, color: 'gray' },
  transactionAmount: { fontSize: 14, fontWeight: 'bold' },
});

export default HomeScreen;
