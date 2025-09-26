import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Spacing, FontSizes, FontWeights, Fonts } from '../../utils/theme';

// --- Enhanced Demo Data ---
const demoMarketData = [
  { id: '1', name: 'NIFTY 50', value: '18,250.25', change: '+136.20', changePercent: '+0.75%', changeType: 'positive' },
  { id: '2', name: 'SENSEX', value: '61,300.50', change: '-45.10', changePercent: '-0.07%', changeType: 'negative' },
  { id: '3', name: 'BANK NIFTY', value: '43,150.10', change: '+365.80', changePercent: '+0.85%', changeType: 'positive' },
];

const demoPopularStocks = [
  { id: '1', symbol: 'RELIANCE', price: '2,540.50', change: '+1.20%', changeType: 'positive' },
  { id: '2', symbol: 'TCS', price: '3,620.75', change: '+0.85%', changeType: 'positive' },
  { id: '3', symbol: 'INFY', price: '1,460.30', change: '-0.25%', changeType: 'negative' },
  { id: '4', symbol: 'HDFCBANK', price: '1,650.00', change: '+2.10%', changeType: 'positive' },
];

const demoRecommendations = [
  {
    id: '1', type: 'Stock', name: 'HDFC Bank', description: 'Strong fundamentals and consistent dividend payments.', riskLevel: 'Moderate', icon: 'bar-chart-2',
  },
  {
    id: '2', type: 'Mutual Fund', name: 'Axis Bluechip Fund', description: 'Large-cap fund with steady growth potential.', riskLevel: 'Moderate', icon: 'layers',
  },
  {
    id: '3', type: 'Gold', name: 'Sovereign Gold Bond', description: 'Government-backed gold investment with interest.', riskLevel: 'Low', icon: 'dollar-sign',
  },
];

// --- Reusable Components ---
const MarketCard = ({ item }) => (
  <View style={styles.marketCard}>
    <Text style={styles.marketName}>{item.name}</Text>
    <Text style={styles.marketValue}>₹{item.value}</Text>
    <View style={styles.changeContainer}>
      <Feather name={item.changeType === 'positive' ? 'trending-up' : 'trending-down'} size={14} color={item.changeType === 'positive' ? Colors.accentTeal : Colors.accentCoral} />
      <Text style={[styles.marketChange, { color: item.changeType === 'positive' ? Colors.accentTeal : Colors.accentCoral }]}>
        {` ${item.change} (${item.changePercent})`}
      </Text>
    </View>
  </View>
);

const StockCard = ({ item }) => (
  <View style={styles.stockCard}>
    <View style={[styles.stockIcon, { backgroundColor: item.changeType === 'positive' ? Colors.accentTeal : Colors.accentCoral }]}>
      <Text style={styles.stockIconText}>{item.symbol.charAt(0)}</Text>
    </View>
    <Text style={styles.stockSymbol}>{item.symbol}</Text>
    <Text style={styles.stockPrice}>₹{item.price}</Text>
    <Text style={{ color: item.changeType === 'positive' ? Colors.accentTeal : Colors.accentCoral }}>
      {item.change}
    </Text>
  </View>
);

const RecommendationItem = ({ item }) => (
  <TouchableOpacity style={styles.recommendationItem}>
    <View style={[styles.recIconContainer, {backgroundColor: Colors.backgroundAlt}]}>
      <Feather name={item.icon} size={24} color={Colors.primaryDark} />
    </View>
    <View style={styles.recTextContainer}>
      <Text style={styles.recommendationName}>{item.name}</Text>
      <Text style={styles.recommendationDescription}>{item.description}</Text>
    </View>
    <View style={[styles.riskBadge, { backgroundColor: item.riskLevel === 'Low' ? Colors.accentTeal : Colors.accentCoral }]}>
      <Text style={styles.riskBadgeText}>{item.riskLevel}</Text>
    </View>
  </TouchableOpacity>
);

// --- Main Screen ---
const InvestmentScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Investment Dashboard</Text>
          <Text style={styles.subtitle}>Thursday, 11 September 2025</Text>
        </View>

        {/* Portfolio Summary */}
        <View style={styles.portfolioCard}>
          <Text style={styles.portfolioLabel}>Total Investment Value</Text>
          <Text style={styles.portfolioValue}>₹ 12,45,670.50</Text>
          <View style={styles.portfolioChangeContainer}>
            <Text style={styles.portfolioChangeLabel}>Today's Gain:</Text>
            <Text style={styles.changeTextPositive}>+ ₹ 8,120.75 (+0.65%)</Text>
          </View>
        </View>

        {/* Market Live Data */}
        <Text style={styles.sectionTitle}>Market Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: Spacing.md }}>
          {demoMarketData.map(data => <MarketCard key={data.id} item={data} />)}
        </ScrollView>

        {/* AI Insight Feature */}
        <Text style={styles.sectionTitle}>AI Market Opportunity</Text>
        <View style={styles.aiInsightCard}>
            <Feather name="zap" size={24} color={Colors.primaryDeep} style={styles.aiIcon} />
            <View style={styles.aiTextContainer}>
                <Text style={styles.aiTitle}>Sector Momentum Alert</Text>
                <Text style={styles.aiContent}>
                    The IT sector is showing strong momentum. Based on recent analyst upgrades, consider increasing your allocation in TCS or INFY.
                </Text>
            </View>
        </View>

        {/* Popular Stocks */}
        <Text style={styles.sectionTitle}>Top Movers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: Spacing.md }}>
          {demoPopularStocks.map(stock => <StockCard key={stock.id} item={stock} />)}
        </ScrollView>

        {/* Recommendations */}
        <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
        {demoRecommendations.map(rec => <RecommendationItem key={rec.id} item={rec} />)}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  container: { paddingVertical: Spacing.md, paddingBottom: 100 },
  headerContainer: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  title: { fontFamily: Fonts.heading, fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  subtitle: { fontFamily: Fonts.primary, fontSize: FontSizes.md, color: Colors.grayDark },
  sectionTitle: { fontFamily: Fonts.heading, fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginVertical: Spacing.lg, paddingHorizontal: Spacing.md },

  // Portfolio Card
  portfolioCard: { backgroundColor: Colors.primaryDeep, borderRadius: 20, padding: Spacing.lg, marginHorizontal: Spacing.md, shadowColor: Colors.primaryDeep, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  portfolioLabel: { fontFamily: Fonts.primary, fontSize: FontSizes.md, color: Colors.backgroundLight, opacity: 0.8 },
  portfolioValue: { fontFamily: Fonts.heading, fontSize: 36, fontWeight: FontWeights.bold, color: Colors.white, marginVertical: Spacing.sm },
  portfolioChangeContainer: { flexDirection: 'row', alignItems: 'center' },
  portfolioChangeLabel: { fontFamily: Fonts.primary, fontSize: FontSizes.md, color: Colors.backgroundLight, opacity: 0.8, marginRight: Spacing.sm },
  changeTextPositive: { fontFamily: Fonts.heading, fontSize: FontSizes.md, color: Colors.accentTeal, fontWeight: FontWeights.bold },

  // Market Card
  marketCard: { width: 220, backgroundColor: Colors.background, borderRadius: 16, padding: Spacing.md, marginRight: Spacing.md, borderWidth: 1, borderColor: Colors.neutralBackground },
  marketName: { fontFamily: Fonts.heading, fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  marketValue: { fontFamily: Fonts.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.semiBold, color: Colors.textPrimary, marginVertical: Spacing.sm },
  changeContainer: { flexDirection: 'row', alignItems: 'center' },
  marketChange: { fontFamily: Fonts.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },

  // AI Insight Card
  aiInsightCard: { backgroundColor: Colors.backgroundAlt, borderRadius: 16, padding: Spacing.lg, marginHorizontal: Spacing.md, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.primaryLight },
  aiIcon: { marginRight: Spacing.md },
  aiTextContainer: { flex: 1 },
  aiTitle: { fontFamily: Fonts.heading, fontWeight: FontWeights.bold, color: Colors.primaryDeep, fontSize: FontSizes.md, marginBottom: Spacing.xs },
  aiContent: { fontFamily: Fonts.primary, color: Colors.textPrimary, fontSize: FontSizes.sm, lineHeight: 20 },

  // Stock Card
  stockCard: { width: 120, alignItems: 'center', backgroundColor: Colors.background, borderRadius: 16, padding: Spacing.md, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.neutralBackground },
  stockIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  stockIconText: { color: Colors.white, fontFamily: Fonts.heading, fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
  stockSymbol: { fontFamily: Fonts.heading, fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  stockPrice: { fontFamily: Fonts.primary, fontSize: FontSizes.sm, color: Colors.grayDark, marginVertical: 2 },

  // Recommendation Item
  recommendationItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, padding: Spacing.md, borderRadius: 12, marginBottom: Spacing.md, marginHorizontal: Spacing.md },
  recIconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  recTextContainer: { flex: 1 },
  recommendationName: { fontFamily: Fonts.heading, fontSize: FontSizes.md, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  recommendationDescription: { fontFamily: Fonts.primary, fontSize: FontSizes.sm, color: Colors.grayDark, marginTop: 2 },
  riskBadge: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: 10, marginLeft: Spacing.sm },
  riskBadgeText: { color: Colors.white, fontFamily: Fonts.heading, fontSize: 10, fontWeight: FontWeights.bold },
});

export default InvestmentScreen;