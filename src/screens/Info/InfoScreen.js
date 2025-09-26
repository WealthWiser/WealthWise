import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { Colors, Fonts, FontSizes, Spacing } from '../../utils/theme';

const InfoScreen = ({ route }) => {
  const { title, content, details } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        
        {/* Animated Title */}
        <Animatable.Text 
          animation="fadeInDown" 
          duration={800} 
          style={styles.heading}
        >
          {title}
        </Animatable.Text>

        {/* Animated Main Body */}
        {content && (
          <Animatable.Text 
            animation="fadeIn" 
            delay={300} 
            style={styles.bodyText}
          >
            {content}
          </Animatable.Text>
        )}

        {/* Animated Detailed Sections */}
        {details && details.map((section, index) => (
          <Animatable.View 
            key={index} 
            animation="fadeInUp" 
            delay={400 + index * 200} 
            style={styles.sectionCard}
          >
            {section.heading && <Text style={styles.sectionHeading}>{section.heading}</Text>}
            {section.body && <Text style={styles.sectionBody}>{section.body}</Text>}
            {section.list && section.list.map((item, idx) => (
              <Text key={idx} style={styles.listItem}>• {item}</Text>
            ))}
          </Animatable.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  scrollViewContent: {
    padding: Spacing.lg,
  },
  heading: {
    fontSize: FontSizes.xl + 4,
    marginBottom: Spacing.md,
    color: '#1f2937',
    textAlign: 'center',
    fontWeight: '800',
  },
  bodyText: {
    fontSize: FontSizes.md + 1,
    lineHeight: 26,
    color: '#374151',
    textAlign: 'justify',
    marginBottom: Spacing.lg,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionHeading: {
    fontSize: FontSizes.lg + 1,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111827',
  },
  sectionBody: {
    fontSize: FontSizes.md,
    lineHeight: 22,
    color: '#4b5563',
    marginBottom: 6,
  },
  listItem: {
    fontSize: FontSizes.md,
    color: '#4b5563',
    marginLeft: 12,
    marginBottom: 2,
  },
});

export default InfoScreen;
