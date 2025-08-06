import React, { useState, useRef } from 'react';
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
import ChatBot from '../Chat/Chatbot'; 

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [showChatBot, setShowChatBot] = useState(false); 
    const animation = useRef(new Animated.Value(0)).current; // 0 = hidden, 1 = expanded
    const [chatVisible, setChatVisible] = useState(false);

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
    duration: 400,
    easing: Easing.in(Easing.circle),
    useNativeDriver: false,
  }).start(() => setChatVisible(false));
};

const transactions = [
  { id: 1, name: 'Walmart', category: 'Groceries', amount: -50, icon: '🛒' },
  { id: 2, name: 'Uber', category: 'Transportation', amount: -25, icon: '🚗' },
  { id: 3, name: 'Cinema', category: 'Entertainment', amount: -15, icon: '🎬' },
];


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>WealthWise</Text>
        <View style={styles.avatarCircle}>
          <Image source={require('../../assets/illustration1.png')} style={styles.avatar} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}>
        {/* Balance */}
        <View style={{ marginTop: 24, marginBottom: 16 }}>
          <Text style={styles.greeting}>Good morning, Sarah</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={styles.balance}>$2,345.67</Text>
            <Text style={styles.balanceChange}> ↑ +2.5%</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.incomeBtn}>
            <Text style={styles.incomeBtnText}>Add Income</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.expenseBtn}>
            <Text style={styles.expenseBtnText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.budgetBtn}>
            <Text style={styles.budgetBtnText}>Set Budget</Text>
          </TouchableOpacity>
        </View>

        {/* Spending Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Spending Summary</Text>
          <Text style={styles.sectionSubtitle}>Budget vs. Spent this month</Text>
          <View style={styles.circleWrap}>
            <View style={styles.ringBackground}>
              <View style={[styles.ringForeground, { transform: [{ rotate: '270deg' }] }]} />
            </View>
            <Text style={styles.circleText}>75%</Text>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.map(tran => (
            <View style={styles.transaction} key={tran.id}>
              <View style={styles.tranIcon}>
                <Text style={{ fontSize: 22 }}>{tran.icon}</Text>
              </View>
              <View style={styles.tranTextContainer}>
                <Text style={styles.tranName}>{tran.name}</Text>
                <Text style={styles.tranCat}>{tran.category}</Text>
              </View>
              <Text style={styles.tranAmt}>
                {tran.amount < 0 ? '-' : ''}${Math.abs(tran.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Budget Categories</Text>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryChipActive}>Food</Text>
            <Text style={styles.categoryChip}>Transport</Text>
            <Text style={styles.categoryChip}>Entertainment</Text>
            <Text style={styles.categoryChip}>Utilities</Text>
          </View>
          <View style={styles.progressBarWrap}>
            <View style={styles.progressBarFull} />
            <View style={styles.progressBarPartial} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={styles.sectionSubtitle}>$300 / $400</Text>
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.card}>
          <Text style={styles.insightIcon}>💡</Text>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <Text style={styles.aiDetails}>You've spent 20% less on dining out this month. Keep it up!</Text>
        </View>

        {/* Financial Goals */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Financial Goals</Text>
          <Text style={styles.sectionSubtitle}>Save for a Vacation</Text>
          <View style={styles.goalBar}>
            <View style={styles.goalBarProgress} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={styles.sectionSubtitle}>$500 / $1000</Text>
          </View>
        </View>

        {/* Bill Reminders */}
        <View style={[styles.card, { borderColor: '#f5c4c4', borderWidth: 1.5 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.billIcon}>🏠</Text>
            <Text style={[styles.sectionTitle, { color: '#ed6154', marginLeft: 4 }]}>Bill Reminders</Text>
          </View>
          <Text style={[styles.sectionSubtitle, { color: '#ed6154', marginTop: 7 }]}>Rent</Text>
          <Text style={[styles.aiDetails, { color: '#ed6154' }]}>Due in 5 days</Text>
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON  */}
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
                outputRange: [0, 1],
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
        <TouchableOpacity style={styles.closeButton} onPress={closeChat}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
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
    backgroundColor: '#eaf0f7',
  },
  header: {
    backgroundColor: '#4388e3ff',
    height: 82,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  avatarCircle: {
    backgroundColor: '#f7f8fa',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 32,
    height: 32,
  },
  brand: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    fontFamily: 'Lato-Bold',
    letterSpacing: 1.1,
  },
  greeting: {
    color: '#155bb7ff',
    fontFamily: 'Lato-Bold',
    fontSize: 19,
    marginLeft: 10,
  },
  balance: {
    marginLeft: 10,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#338c94ff',
    letterSpacing: 1,
    fontFamily: 'Lato-Bold',
  },
  balanceChange: {
    color: '#31be81',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 9,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  incomeBtn: {
    backgroundColor: '#b7efd8',
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  incomeBtnText: { color: '#207b55', fontWeight: 'bold', fontSize: 15 },
  expenseBtn: {
    backgroundColor: '#357aed',
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  expenseBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  budgetBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f7ad37',
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  budgetBtnText: { color: '#f7ad37', fontWeight: 'bold', fontSize: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 19,
    marginVertical: 9,
    padding: 15,
    shadowColor: '#1d1e2c',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Lato-Bold',
    fontWeight: 'bold',
    color: '#13325c',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#7b8598',
    fontFamily: 'Lato-Regular',
  },
  circleWrap: {
    alignItems: 'center',
    marginVertical: 6,
  },
  ringBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 7,
    borderColor: '#e1e1e7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringForeground: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 7,
    borderLeftColor: '#357aed',
    borderBottomColor: '#357aed',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
  },
  circleText: {
    position: 'absolute',
    width: 70,
    height: 70,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    color: '#357aed',
    fontSize: 20,
    lineHeight: 70,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
    justifyContent: 'space-between',
  },
  tranIcon: {
    backgroundColor: '#e6edfa',
    borderRadius: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tranTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  tranName: {
    fontFamily: 'Lato-Bold',
    fontSize: 15,
    color: '#103766',
  },
  tranCat: {
    fontFamily: 'Lato-Regular',
    fontSize: 12,
    color: '#8595b3',
  },
  tranAmt: {
    fontFamily: 'Lato-Bold',
    fontSize: 16,
    color: '#253757',
    minWidth: 70,
    textAlign: 'right',
  },
  categoryRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  categoryChip: {
    backgroundColor: '#eafdff',
    color: '#357aed',
    fontFamily: 'Lato-Bold',
    fontSize: 13,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 5,
    marginRight: 7,
  },
  categoryChipActive: {
    backgroundColor: '#357aed',
    color: '#fff',
    fontFamily: 'Lato-Bold',
    fontSize: 13,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 5,
    marginRight: 7,
  },
  progressBarWrap: {
    backgroundColor: '#e5eaff',
    borderRadius: 6,
    height: 10,
    marginTop: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFull: {
    backgroundColor: '#e5eaff',
    height: 10,
    width: '100%',
    position: 'absolute',
    left: 0,
  },
  progressBarPartial: {
    backgroundColor: '#357aed',
    height: 10,
    width: '75%',
    position: 'absolute',
    left: 0,
  },
  insightIcon: {
    fontSize: 22,
    marginBottom: 5,
  },
  aiDetails: {
    fontSize: 13,
    color: '#447ec3',
  },
  goalBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e3f5ea',
    borderRadius: 7,
    marginTop: 8,
    overflow: 'hidden',
  },
  goalBarProgress: {
    backgroundColor: '#7adbaa',
    height: 8,
    width: '50%',
    position: 'absolute',
    left: 0,
  },
  billIcon: {
    fontSize: 21,
    marginRight: 2,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
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
  modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.3)',
},
modalBlur: {
  ...StyleSheet.absoluteFillObject,
},
chatbotContainer: {
  width: '90%',
  height: '80%',
  backgroundColor: '#fff',
  borderRadius: 20,
  overflow: 'hidden',
  padding: 10,
},
closeButton: {
  alignSelf: 'flex-end',
  padding: 10,
},
closeText: {
  fontSize: 22,
  fontWeight: 'bold',
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
