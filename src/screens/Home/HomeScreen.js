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
      const { data: { user } } = await supabase.auth.getUser();
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

  // ✅ Calculate balance, prepare chart data, and category data
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

    // ✅ Calculate category-wise spending
    const expenseTransactions = dummyTransactions.filter(txn => txn.type === 'Debit');
    const categoryTotals = {};
    
    expenseTransactions.forEach(txn => {
      // Assign categories based on transaction remarks (you can modify this logic)
      let category = 'Others';
      const remark = txn.remark.toLowerCase();
      
      if (remark.includes('food') || remark.includes('restaurant') || remark.includes('grocery')) {
        category = 'Food & Dining';
      } else if (remark.includes('transport') || remark.includes('fuel') || remark.includes('uber') || remark.includes('taxi')) {
        category = 'Transportation';
      } else if (remark.includes('shopping') || remark.includes('clothes') || remark.includes('amazon')) {
        category = 'Shopping';
      } else if (remark.includes('entertainment') || remark.includes('movie') || remark.includes('netflix')) {
        category = 'Entertainment';
      } else if (remark.includes('bill') || remark.includes('electricity') || remark.includes('water') || remark.includes('rent')) {
        category = 'Bills & Utilities';
      } else if (remark.includes('health') || remark.includes('medical') || remark.includes('doctor')) {
        category = 'Healthcare';
      }
      
      categoryTotals[category] = (categoryTotals[category] || 0) + txn.amount;
    });

    // Convert to array format for PieChart and sort by amount
    const categoryArray = Object.entries(categoryTotals)
      .map(([name, population]) => ({ name, population }))
      .sort((a, b) => b.population - a.population);

    // Colors for pie chart
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];
    const categoryDataWithColors = categoryArray.map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
      legendFontColor: '#7F7F7F',
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
      return { text: "Good Morning"};
    } else if (hour >= 12 && hour < 17) {
      return { text: "Good Afternoon" };
    } else {
      return { text: "Good Evening"};
    }
  };

  const greeting = getGreeting();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: Spacing.md, paddingBottom: 100 }}>
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
          {greeting.text}, {profile ? profile.first_name : 'User'}!
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

        {/* ✅ NEW: Category-wise Spending Section */}
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
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
                      <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <View style={styles.categoryAmount}>
                      <Text style={styles.categoryAmountText}>₹{category.population}</Text>
                      <Text style={styles.categoryPercentage}>
                        {((category.population / totalExpenses) * 100).toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No expense data available</Text>
            </View>
          )}
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

      {/* FLOATING ACTION BUTTON (AI Chatbot) */}
      <View style={styles.fabContainer}>
        <BlurView
          style={styles.blurBackground}
          blurType="light"
          blurAmount={15}
          blurRadius={18}  
          reducedTransparencyFallbackColor="white"
        />
        <TouchableOpacity
          style={styles.fab}
          onPress={openChat}
        >
          <Image source={require('../../assets/Ai-Bot.png')} style={styles.brandImage} />
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
                <TouchableOpacity style={styles.closeButton} onPress={closeChat}>
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
    backgroundColor: Colors.neutralBackground 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logo: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: Colors.text,
  },
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
  subtitle: { 
    fontSize: 16, 
    color: 'gray', 
    marginBottom: Spacing.lg 
  },

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
  cardLabel: { 
    fontSize: FontSizes.sm, 
    color: 'gray', 
    marginBottom: 4 
  },
  cardValue: { 
    fontSize: FontSizes.lg, 
    fontWeight: 'bold', 
    color: Colors.text 
  },

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

  // Category-wise Spending Section
  categorySection: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: 12,
  },
  categoryList: {
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
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
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    flex: 1,
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  categoryAmountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  categoryPercentage: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    color: 'gray',
    fontStyle: 'italic',
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
  transactionTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: Colors.text 
  },
  transactionDate: { 
    fontSize: 12, 
    color: 'gray' 
  },
  transactionAmount: { 
    fontSize: 14, 
    fontWeight: 'bold' 
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
    color: '#350c8dff',
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
    color: '#e30707ff',
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