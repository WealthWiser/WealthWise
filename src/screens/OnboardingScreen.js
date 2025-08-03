import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, FontSizes, Fonts, FontWeights } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Track Your Spending',
    description: 'Monitor expenses easily and stay in control of your finances.',
    image: require('../assets/illustration1.png'),
  },
  {
    title: 'Set Budgets & Goals',
    description: 'Create budgets and set financial goals to reach your dreams.',
    image: require('../assets/illustration2.png'),
  },
  {
    title: 'Get Smart Investment Advice',
    description: 'Receive personalized recommendations to grow your wealth.',
    image: require('../assets/illustration3.png'),
  },
];

const OnboardingScreen = () => {
  const [step, setStep] = useState(0);
  const navigation = useNavigation();

  const handleNext = () => {
    if (step < onboardingData.length - 1) {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    setStep(onboardingData.length - 1);
  };

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../utils/wwLogo.png')}
          style={styles.topLogo}
          resizeMode="contain"
        />

        <Image
          source={onboardingData[step].image}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>{onboardingData[step].title}</Text>
        <Text style={styles.text}>{onboardingData[step].description}</Text>

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === step ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.bottomContainer}>
        {step < onboardingData.length - 1 ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.fullButton} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutralBackground,
    padding: Spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  topLogo: {
    width: 100,
    height: 100,
    marginBottom: Spacing.lg,
    alignSelf: 'center',
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  text: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.primary,
    fontWeight: FontWeights.regular,
    color: Colors.text,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    width: 14,
    height: 14,
    backgroundColor: Colors.primary,
    opacity: 1,
  },
  inactiveDot: {
    backgroundColor: Colors.primary,
    opacity: 0.3,
  },
  bottomContainer: {
    paddingBottom: Spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  skipButton: {
    backgroundColor: '#b2d8ffff',
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl + 4,
    borderRadius: 30,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: Spacing.xl + 4,
    borderRadius: 30,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 30,
    marginHorizontal: Spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.primary,
    fontWeight: FontWeights.bold,
    color: '#fff',
  },
  skipButtonText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.primary,
    fontWeight: FontWeights.bold,
    color: Colors.blueDark,
  },
});


export default OnboardingScreen;
