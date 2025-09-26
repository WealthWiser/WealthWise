import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Fonts, FontSizes, Spacing } from '../../utils/theme';

const { width } = Dimensions.get('window');

const RiskAnalysisScreen = ({ navigation, route }) => {
  const { profile } = route.params || {};
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [investmentExperience, setInvestmentExperience] = useState(
    profile?.investmentExperience?.toString() || ''
  );
  const [riskTolerance, setRiskTolerance] = useState(profile?.riskProfile || '');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async () => {
    if (!age || !investmentExperience || !riskTolerance) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const data = { age, investmentExperience, riskTolerance };
      const response = await fetch('https://your-backend-api.com/risk-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await response.json();
      Alert.alert('✅ Success', 'Risk analysis submitted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to submit risk analysis');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.card}>
            <Image source={require('../../assets/calendar.png')} style={styles.icon} />
            <Text style={styles.question}>How old are you?</Text>
            <TextInput
              label="Age"
              mode="outlined"
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              activeOutlineColor={Colors.primary}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.card}>
            <Image source={require('../../assets/years.png')} style={styles.icon} />
            <Text style={styles.question}>How many years have you invested?</Text>
            <TextInput
              label="Investment Experience (years)"
              mode="outlined"
              style={styles.input}
              value={investmentExperience}
              onChangeText={setInvestmentExperience}
              keyboardType="numeric"
              activeOutlineColor={Colors.primary}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.card}>
            <Image source={require('../../assets/risk.png')} style={styles.icon} />
            <Text style={styles.question}>What’s your risk tolerance?</Text>
            <View style={styles.segmentContainer}>
              {['Low', 'Medium', 'High'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.segmentButton,
                    riskTolerance === level && styles.segmentSelected,
                  ]}
                  onPress={() => setRiskTolerance(level)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      riskTolerance === level && styles.segmentTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

return (
  <SafeAreaView style={styles.container}>
   
    {/* Header */}
        <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={25} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Risk Analysis</Text>
             </View>


    {/* Scrollable Content */}
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Profile Summary */}
      {profile && (
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {profile.first_name?.[0]}
              {profile.last_name?.[0]}
            </Text>
          </View>
          <View style={styles.profileNameWrapper}>
            <Text style={styles.profileName}>
              {profile.first_name} {profile.last_name}
            </Text>
            {profile.riskProfile && (
              <Text style={styles.profileEmail}>
                Current Profile: {profile.riskProfile}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Step Content */}
      <View style={styles.centerContent}>{renderStep()}</View>

      {/* Step Navigation */}
      <View style={styles.navigation}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.navButtonSecondary}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.navButtonTextSecondary}>Back</Text>
          </TouchableOpacity>
        )}
        {step < 3 ? (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setStep(step + 1)}
            activeOpacity={0.8}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, loading && styles.navButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.navButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  scrollContainer: {
    padding: Spacing.md,
    flexGrow: 1,
    justifyContent: 'center',
  },
    header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    justifyContent: 'flex-start', 
    },
    backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 4,
    },
    headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',               // black color
    },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: 24,
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
    marginHorizontal: Spacing.md,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  profileNameWrapper: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    color: '#222',
  },
  profileEmail: {
    fontSize: FontSizes.sm,
    color: '#777',
    marginTop: 4,
  },

  centerContent: {
    alignItems: 'center',
  },

  card: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  icon: {
    width: 90,
    height: 90,
    marginBottom: 18,
    resizeMode: 'contain',
  },
  question: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    color: '#333',
    textAlign: 'center',
    marginBottom: 14,
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f4ff',
    borderRadius: 16,
  },

  // Segments
  segmentContainer: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    width: '100%',
    justifyContent: 'space-between',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 16,
    marginHorizontal: 6,
    borderRadius: 18,
    backgroundColor: '#e3e8ff',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  segmentSelected: {
    backgroundColor: Colors.primary,
    shadowOpacity: 0.4,
  },
  segmentText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  segmentTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },

  // Navigation
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
  },
  navButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 20,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 10,
  },
  navButtonDisabled: {
    backgroundColor: "#7f9ceeff",
  },
  navButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: 'bold',
  },
  navButtonSecondary: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 20,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  navButtonTextSecondary: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
});

export default RiskAnalysisScreen;
