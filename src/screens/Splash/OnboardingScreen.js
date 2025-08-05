import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, FontSizes, Fonts, FontWeights } from '../../utils/theme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Track Your Spending',
    description: 'Monitor expenses easily and stay in control of your finances.',
    image: require('../../assets/illustration1.png'),
  },
  {
    title: 'Set Budgets & Goals',
    description: 'Create budgets and set financial goals to reach your dreams.',
    image: require('../../assets/illustration2.png'),
  },
  {
    title: 'Get Smart Investment Advice',
    description: 'Receive personalized recommendations to grow your wealth.',
    image: require('../../assets/illustration3.png'),
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Animated values for dots
  const scales = useRef(onboardingData.map(() => new Animated.Value(1))).current;
  const opacities = useRef(onboardingData.map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    scales.forEach((scale, index) => {
      Animated.spring(scale, {
        toValue: index === currentIndex ? 1.3 : 1,
        useNativeDriver: true,
      }).start();
    });

    opacities.forEach((opacity, index) => {
      Animated.timing(opacity, {
        toValue: index === currentIndex ? 1 : 0.3,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleSkip = () => {
    flatListRef.current.scrollToIndex({ index: onboardingData.length - 1 });
  };

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/wwLogo.png')}
        style={styles.topLogo}
        resizeMode="contain"
      />

      <FlatList
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.description}</Text>
          </View>
        )}
        ref={flatListRef}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Animated Dots Indicator */}
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                transform: [{ scale: scales[index] }],
                opacity: opacities[index],
                backgroundColor: Colors.primary,
                elevation: index === currentIndex ? 6 : 2,
                shadowOpacity: index === currentIndex ? 0.7 : 0.1,
                shadowRadius: index === currentIndex ? 6 : 2,
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.bottomContainer}>
        {currentIndex < onboardingData.length - 1 ? (
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
  topLogo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 10,
  },
  slide: {
    width: width - Spacing.lg * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  image: {
    width: width * 0.75,
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
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 6,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl + 16,
    borderRadius: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  fullButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 32,
    marginHorizontal: Spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.primary,
    fontWeight: FontWeights.bold,
    color: '#fff',
    letterSpacing: 1.2,
  },
  skipButtonText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.primary,
    fontWeight: FontWeights.bold,
    color: Colors.blueDark,
    letterSpacing: 1.2,
  },
});

export default OnboardingScreen;
