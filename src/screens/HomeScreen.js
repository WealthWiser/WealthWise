import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../utils/theme';

const HomeScreen = ({ navigation }) => {

    const goToOnboarding = () => {
        navigation.navigate('Onboarding');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ padding: 20, marginTop: 10 }}>
                <Text style={styles.title}>Welcome to WealthWise</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.neutralBackground,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Lato-Bold',
        color: Colors.text,
    },
    text: {
        fontSize: 16,
        marginBottom: 6,
        fontFamily: 'Lato-Regular',
    },
});

export default HomeScreen;
