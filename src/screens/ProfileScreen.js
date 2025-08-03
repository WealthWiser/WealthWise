import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/slices/userSlice';
import { setTransactions } from '../redux/slices/transactionSlice';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, FontSizes, FontWeights, Spacing } from '../utils/theme';
const ProfileScreen = () => {

    return (
        <View style={styles.container}>
            <Text>Profile Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.lg,
        backgroundColor: Colors.neutralBackground,
    },
    title: {
        fontSize: FontSizes.xl,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: Fonts.heading,
    },
    text: {
        fontSize: FontSizes.md,
        marginBottom: 10,
        fontFamily: Fonts.stencil,
    },
});

export default ProfileScreen;
