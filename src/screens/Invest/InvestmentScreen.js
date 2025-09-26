import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { Colors, Spacing, FontSizes, FontWeights, Fonts } from '../../utils/theme';
import { supabase } from '../../lib/supabase';
import { baseurl } from '../../assets/constants/baseurl';
import { INDIAN_STOCK_API_KEY } from '@env'

// --- API Configuration ---
const API_BASE_URL = baseurl;
const getAuthToken = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Supabase session error:", error.message);
      return null;
    }
    return data?.session?.access_token;
  } catch (err) {
    console.log("An error happend: ", err);
    return null;
  }
};

// --- Reusable Components (with minor adjustments for dynamic data) ---
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

const StockCard = ({ item }) => {
  const isPositive = parseFloat(item.percent_change) >= 0;
  const changeType = isPositive ? 'positive' : 'negative';
  return (
    <View style={styles.stockCard}>
      <View style={[styles.stockIcon, { backgroundColor: changeType === 'positive' ? Colors.accentTeal : Colors.accentCoral }]}>
        <Text style={styles.stockIconText}>{item.company_name.charAt(0)}</Text>
      </View>
      <Text style={styles.stockSymbol} numberOfLines={1}>{item.company_name}</Text>
      <Text style={styles.stockPrice}>₹{item.price}</Text>
      <Text style={{ color: changeType === 'positive' ? Colors.accentTeal : Colors.accentCoral }}>
        {item.percent_change}%
      </Text>
    </View>
  );
};

const RecommendationItem = ({ item }) => {
  const riskLevel = item.risk_level_match || 'Moderate';
  const riskColor = riskLevel.toLowerCase().includes('low') ? Colors.accentTeal : Colors.accentCoral;

  return (
    <View style={styles.recommendationCard}>
      <Text style={styles.recommendationName}>
        {item.instrument_name}
      </Text>
      <Text style={styles.recommendationDescription} >
        {item.reasoning}
      </Text>
      <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
        <Text style={styles.riskBadgeText}>{riskLevel}</Text>
      </View>
    </View>
  );
};



const ErrorDisplay = ({ message, onRetry }) => (
  <View style={styles.centered}>
    <Text style={styles.errorText}>{message}</Text>
    <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
      <Text style={styles.retryButtonText}>Try Again</Text>
    </TouchableOpacity>
  </View>
);

const InvestmentScreen = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [topMovers, setTopMovers] = useState({ top_gainers: [], top_losers: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const staticMarketData = [
    { id: '1', name: 'NIFTY 50', value: '23,516.00', change: '+51.00', changePercent: '+0.22%', changeType: 'positive' },
    { id: '2', name: 'SENSEX', value: '77,337.59', change: '+141.34', changePercent: '+0.18%', changeType: 'positive' },
  ];

  const fetchData = async (isRefresh = false) => {
    if (!refreshing) setLoading(true);
    if (isRefresh) setRefreshing(true);
    setError(null);
    try {
      const authToken = await getAuthToken();
      if (!authToken) throw new Error("Missing auth token");

      const headers = { Authorization: `Bearer ${authToken}` };

      // Personalized Recommendations
      const adviceResponse = await axios.post(`${API_BASE_URL}/finance/generate-advice`, {
        risk_profile: "Moderate",
        investment_goal: "Long-term Wealth Creation",
        investment_horizon: "7+ years"
      }, { headers });

      if (adviceResponse.data && adviceResponse.data.ai_advice) {
        setRecommendations(adviceResponse.data.ai_advice);
      } else {
        throw new Error("Invalid advice response structure");
      }

      // Top Movers
      const trendingResponse = await axios.get('https://stock.indianapi.in/trending', {
        headers: { 'X-Api-Key': INDIAN_STOCK_API_KEY }
      });

      if (trendingResponse.data && trendingResponse.data.trending_stocks) {
        setTopMovers(trendingResponse.data.trending_stocks);
      } else {
        throw new Error("Invalid trending stocks response structure");
      }

    } catch (err) {
      console.error("API Error:", err.response ? err.response.data : err.message);
      setError("Failed to load investment data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- Only fetch if we don't already have data ---
  useEffect(() => {
    if (!recommendations && topMovers.top_gainers.length === 0) {
      fetchData();
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primaryDeep} />
        <Text style={styles.loadingText}>Analyzing Your Financials...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorDisplay message={error} onRetry={fetchData} />
      </SafeAreaView>
    );
  }
  const handleRefresh = () => {
    fetchData(true); // mark as refresh
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Investment Dashboard</Text>
          {/* --- Refresh Button --- */}
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            {refreshing ? (
              <ActivityIndicator size="small" color={Colors.primaryDark} />
            ) : (
              <Feather name="refresh-ccw" size={20} color={Colors.primaryDark} />
            )}
          </TouchableOpacity>
        </View>

        {/* Market Overview */}
        <Text style={styles.sectionTitle}>Market Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: Spacing.md }}>
          {staticMarketData.map(data => <MarketCard key={data.id} item={data} />)}
        </ScrollView>

        {/* AI Insight Feature */}
        <Text style={styles.sectionTitle}>AI Market Opportunity</Text>
        <View style={styles.aiInsightCard}>
          <Feather name="zap" size={24} color={Colors.primaryDeep} style={styles.aiIcon} />
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>Today's Insight</Text>
            <Text style={styles.aiContent}>
              {recommendations?.market_insight || "Analyzing market news..."}
            </Text>
          </View>
        </View>

        {/* Top Movers */}
        <Text style={styles.sectionTitle}>Stocks in Action</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: Spacing.md }}>
          {topMovers.top_gainers.map(stock => <StockCard key={stock.ticker_id} item={stock} />)}
          {topMovers.top_losers.map(stock => <StockCard key={stock.ticker_id} item={stock} />)}
        </ScrollView>

        {/* Recommendations */}
        <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
        {recommendations?.recommendations?.map((rec, index) => (
          <RecommendationItem key={index} item={rec} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};


// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },
  container: { paddingVertical: Spacing.md, paddingBottom: 100 },
  headerContainer: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: Fonts.heading, fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  sectionTitle: { fontFamily: Fonts.heading, fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary, marginVertical: Spacing.lg, paddingHorizontal: Spacing.md },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.lg, backgroundColor: Colors.backgroundLight },
  loadingText: { marginTop: Spacing.md, fontFamily: Fonts.primary, fontSize: FontSizes.md, color: Colors.grayDark },
  errorText: { fontFamily: Fonts.primary, fontSize: FontSizes.md, color: Colors.accentCoral, textAlign: 'center', marginBottom: Spacing.lg },
  retryButton: { backgroundColor: Colors.primaryDeep, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl, borderRadius: 25 },
  retryButtonText: { color: Colors.white, fontFamily: Fonts.heading, fontWeight: FontWeights.bold },
  refreshButton: {
    padding: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    backgroundColor: Colors.background
  },
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
  stockCard: { width: 140, alignItems: 'center', backgroundColor: Colors.background, borderRadius: 16, padding: Spacing.md, marginRight: Spacing.sm, borderWidth: 1, borderColor: Colors.neutralBackground },
  stockIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm },
  stockIconText: { color: Colors.white, fontFamily: Fonts.heading, fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
  stockSymbol: { fontFamily: Fonts.heading, fontSize: FontSizes.sm, fontWeight: FontWeights.bold, color: Colors.textPrimary, textAlign: 'center' },
  stockPrice: { fontFamily: Fonts.primary, fontSize: FontSizes.sm, color: Colors.grayDark, marginVertical: 2 },

  // --- Recommendation Item (STYLES FIXED) ---
  recommendationCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutralBackground,
  },
  recommendationName: {
    fontFamily: Fonts.heading,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  recommendationDescription: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.md,
    color: Colors.grayDark,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  riskBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskBadgeText: {
    color: Colors.white,
    fontFamily: Fonts.heading,
    fontSize: 12,
    fontWeight: FontWeights.bold,
  },

});

export default InvestmentScreen;
