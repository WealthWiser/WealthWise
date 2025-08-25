import React, { useState, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import { LineChart, PieChart } from 'react-native-chart-kit';
import ChatBot from '../Chat/Chatbot';
import { supabase } from '../../lib/supabase';
import { Colors, FontSizes, Spacing } from '../../utils/theme';
import { dummyTransactions } from '../../dummyData';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const animation = useRef(new Animated.Value(0)).current; // 0 = hidden, 1 = expanded
  const [chatVisible, setChatVisible] = useState(false);

  // User profile state
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Financial data state
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.log('Fetch profile error:', error.message);
      } else {
        setProfile(data);
      }
      setLoadingProfile(false);
    };

    fetchUserDetails();
  }, []);

  // Calculate balance, prepare chart data, and category data
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

    // Get latest 5 transactions
    const sorted = [...dummyTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    setLatestTransactions(sorted.slice(0, 5));

    // Calculate category-wise spending
    const expenseTransactions = dummyTransactions.filter(
      txn => txn.type === 'Debit',
    );
    const categoryTotals = {};

    expenseTransactions.forEach(txn => {
      // Assign categories based on transaction remarks (you can modify this logic)
      let category = 'Others';
      const remark = txn.remark.toLowerCase();

      if (
        remark.includes('food') ||
        remark.includes('restaurant') ||
        remark.includes('grocery')
      ) {
        category = 'Food & Dining';
      } else if (
        remark.includes('transport') ||
        remark.includes('fuel') ||
        remark.includes('uber') ||
        remark.includes('taxi')
      ) {
        category = 'Transportation';
      } else if (
        remark.includes('shopping') ||
        remark.includes('clothes') ||
        remark.includes('amazon')
      ) {
        category = 'Shopping';
      } else if (
        remark.includes('entertainment') ||
        remark.includes('movie') ||
        remark.includes('netflix')
      ) {
        category = 'Entertainment';
      } else if (
        remark.includes('bill') ||
        remark.includes('electricity') ||
        remark.includes('water') ||
        remark.includes('rent')
      ) {
        category = 'Bills & Utilities';
      } else if (
        remark.includes('health') ||
        remark.includes('medical') ||
        remark.includes('doctor')
      ) {
        category = 'Healthcare';
      }

      categoryTotals[category] = (categoryTotals[category] || 0) + txn.amount;
    });

    // Convert to array format for PieChart and sort by amount
    const categoryArray = Object.entries(categoryTotals)
      .map(([name, population]) => ({ name, population }))
      .sort((a, b) => b.population - a.population);

    // Colors for pie chart using primary shades and background colors
    const colors = [
      Colors.primary,
      Colors.primaryLight,
      Colors.primaryDark,
      Colors.backgroundAlt,
      Colors.accentCoral,
      Colors.accentTeal,
      Colors.accentPink,
    ];
    const categoryDataWithColors = categoryArray.map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
      legendFontColor: Colors.textPrimary,
      legendFontSize: 12,
    }));

    setCategoryData(categoryDataWithColors);
  }, []);

  const openChat = () => {
    setChatVisible(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  };

  const closeChat = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      easing: Easing.in(Easing.circle),
      useNativeDriver: false,
    }).start(() => setChatVisible(false));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { text: 'Good Morning' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon' };
    } else {
      return { text: 'Good Evening' };
    }
  };

  const greeting = getGreeting();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.md, paddingBottom: 100 }}
      >
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
          {greeting.text},{' '}
          <Text style={styles.userName}>
            {profile ? profile.first_name : 'User'}
          </Text>
          !
        </Text>
        <Text style={styles.subtitle}>Welcome back to WealthWise</Text>

        {/* Summary Cards - Uneven Grid */}
        <View style={styles.cardGrid}>
          {/* Featured Balance Card - Full Width */}
          <View style={[styles.card, styles.cardBalance]}>
            <Text style={styles.cardBalanceLabel}>Current Balance</Text>
            <Text style={styles.cardBalanceValue}>
              ₹{balance.toLocaleString()}
            </Text>
          </View>

          {/* Row with Income and Transactions */}
          <View style={[styles.cardRow, { marginTop: 16 }]}>
            <View style={[styles.card, styles.cardIncome, { flex: 1.5 }]}>
              <Text style={styles.cardLabel}>Total Income</Text>
              <Text style={styles.cardIncomeValue}>
                ₹{totalIncome.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.card, styles.cardTransactions, { flex: 1 }]}>
              <Text style={styles.cardLabel}>Transactions</Text>
              <Text style={styles.cardValue}>{dummyTransactions.length}</Text>
            </View>
          </View>

          {/* Expense Card - Centered */}
          <View
            style={[
              styles.cardRow,
              { marginTop: 16, justifyContent: 'center' },
            ]}
          >
            <View style={[styles.card, styles.cardExpense, { width: '70%' }]}>
              <Text style={styles.cardLabel}>Total Expenses</Text>
              <Text style={styles.cardExpenseValue}>
                ₹{totalExpenses.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Expenses Over Time</Text>

          <View style={{ alignItems: 'center' }}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
                paddingHorizontal:
                  dummyTransactions.filter(txn => txn.type === 'Debit').length >
                  6
                    ? 20
                    : 0,
              }}
              style={{
                maxWidth: Dimensions.get('window').width - 40,
              }}
            >
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
                        color: (opacity = 1) =>
                          `rgba(254, 113, 105, ${opacity})`, // accentCoral
                        strokeWidth: 3,
                      },
                    ],
                  }}
                  width={Math.max(
                    Dimensions.get('window').width - 40,
                    dummyTransactions.filter(txn => txn.type === 'Debit')
                      .length * 60,
                  )}
                  height={220}
                  yAxisLabel="₹"
                  yAxisInterval={1}
                  chartConfig={{
                    backgroundColor: Colors.backgroundLight,
                    backgroundGradientFrom: Colors.backgroundLight,
                    backgroundGradientTo: Colors.background,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(220, 87, 79, ${opacity})`, // Darker accent coral
                    labelColor: (opacity = 1) => Colors.textPrimary,
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: Colors.accentCoral,
                      fill: Colors.background,
                    },
                    propsForBackgroundLines: {
                      strokeWidth: 0,
                      stroke: 'transparent',
                    },
                    propsForVerticalLabels: {
                      fontSize: 12,
                      fill: Colors.textPrimary,
                    },
                    propsForHorizontalLabels: {
                      fontSize: 12,
                      fill: Colors.textPrimary,
                    },
                  }}
                  bezier
                  withHorizontalLines={false}
                  withVerticalLines={false}
                  withInnerLines={false}
                  withOuterLines={false}
                  style={{
                    borderRadius: 12,
                    backgroundColor: 'transparent',
                  }}
                />

                {/* Y-Axis Label Overlay */}
                <Text
                  style={{
                    position: 'absolute',
                    left: -35,
                    top: 100,
                    transform: [{ rotate: '-90deg' }],
                    fontSize: 12,
                    color: Colors.textPrimary,
                  }}
                >
                  Expenses (₹)
                </Text>
              </View>
            </ScrollView>

            {/* X-Axis Label */}
            <Text
              style={{ fontSize: 12, color: Colors.textPrimary, marginTop: 10 }}
            >
              Date
            </Text>
          </View>
        </View>

        {/* Category-wise Spending Section */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Category-wise Spending</Text>

          {categoryData.length > 0 ? (
            <>
              {/* Pie Chart */}
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <PieChart
                  data={categoryData}
                  width={Dimensions.get('window').width - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: Colors.backgroundLight,
                    backgroundGradientFrom: Colors.backgroundLight,
                    backgroundGradientTo: Colors.background,
                    color: (opacity = 1) => Colors.textPrimary,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>

              {/* Category List */}
              <View style={styles.categoryList}>
                {categoryData.map((category, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <View style={styles.categoryInfo}>
                      <View
                        style={[
                          styles.categoryColor,
                          { backgroundColor: category.color },
                        ]}
                      />
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <View style={styles.categoryAmount}>
                      <Text style={styles.categoryAmountText}>
                        ₹{category.population.toLocaleString()}
                      </Text>
                      <Text style={styles.categoryPercentage}>
                        {((category.population / totalExpenses) * 100).toFixed(
                          1,
                        )}
                        %
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No expense data available
              </Text>
            </View>
          )}
        </View>

        {/* Latest Transactions Section */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Latest Transactions</Text>
          {latestTransactions.map((txn, index) => (
            <View key={index} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        txn.type === 'Credit'
                          ? Colors.accentTeal
                          : Colors.accentPink,
                    },
                  ]}
                >
                  <Text style={styles.transactionIconText}>
                    {txn.type === 'Credit' ? '↑' : '↓'}
                  </Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{txn.remark}</Text>
                  <Text style={styles.transactionDate}>{txn.date}</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text
                  style={[
                    styles.transactionAmount,
                    {
                      color:
                        txn.type === 'Credit'
                          ? Colors.accentTeal
                          : Colors.accentPink,
                    },
                  ]}
                >
                  {txn.type === 'Credit' ? '+' : '-'}₹
                  {txn.amount.toLocaleString()}
                </Text>
                <Text style={styles.transactionType}>
                  {txn.type === 'Credit' ? 'Credit' : 'Debit'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON (AI Chatbot) */}
      <View style={styles.fabContainer}>
        <BlurView
          style={styles.blurBackground}
          blurType="light"
          blurAmount={15}
          blurRadius={18}
          reducedTransparencyFallbackColor="white"
        />
        <TouchableOpacity style={styles.fab} onPress={openChat}>
          <Image
            source={require('../../assets/Ai-Bot.png')}
            style={styles.brandImage}
          />
        </TouchableOpacity>
      </View>

      {/* CHATBOT MODAL */}
      {chatVisible && (
        <>
          {/* Fullscreen blur overlay behind the chat */}
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={15}
            reducedTransparencyFallbackColor="white"
          />
          {/* Touchable to close chat by tapping outside */}
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { zIndex: 9998 }]}
            activeOpacity={1}
            onPress={closeChat}
          />
          {/* The animated chat modal container */}
          <Animated.View
            style={[
              styles.animatedChat,
              {
                opacity: animation,
                transform: [
                  {
                    scale: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                zIndex: 9999,
              },
            ]}
          >
            {/* blur inside chat modal*/}
            <BlurView
              style={styles.animatedChatBlur}
              blurType="light"
              blurAmount={15}
              reducedTransparencyFallbackColor="white"
            />
            <View style={styles.chatContent}>
              {/* Chat header row */}
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>WealthWise AI</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeChat}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* ChatBot UI */}
              <ChatBot />
            </View>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textLight,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.textDark,
  },
  userName: {
    color: Colors.primaryDeep,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },

  // Updated Grid Styling - Uneven Cards
  cardGrid: {
    marginBottom: Spacing.lg,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  // Featured Balance Card
  cardBalance: {
    backgroundColor: Colors.primaryDark,
    padding: Spacing.lg,
  },
  cardBalanceLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    marginBottom: 8,
    opacity: 0.9,
  },
  cardBalanceValue: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.textLight,
  },

  // Other Cards
  cardIncome: {
    backgroundColor: Colors.background,
  },
  cardExpense: {
    backgroundColor: Colors.background,
  },
  cardTransactions: {
    backgroundColor: Colors.background,
  },

  cardLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  cardIncomeValue: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.accentTeal,
  },
  cardExpenseValue: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.accentCoral,
  },

  // Chart Section
  chartSection: {
    marginTop: 20,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.textDark,
  },

  // Category-wise Spending Section
  categorySection: {
    marginTop: 20,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryList: {
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    marginVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryName: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.textDark,
    flex: 1,
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  categoryAmountText: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  categoryPercentage: {
    fontSize: 12,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontStyle: 'italic',
  },

  // Enhanced Transactions Section
  transactionsSection: {
    marginTop: 20,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: FontSizes.sm,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 11,
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    fontWeight: '500',
  },

  // Chatbot FAB and Modal Styles
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 35,
  },
  fab: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  // Chatbot containers Heading and close button
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Lato-Bold',
    color: Colors.primaryDeep,
    letterSpacing: 0.5,
    backgroundColor: 'rgba(223, 251, 255, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -11 }],
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.accentCoral,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  animatedChat: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    alignSelf: 'center',
    zIndex: 9999,
  },
  animatedChatBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  chatContent: {
    flex: 1,
  },
});
