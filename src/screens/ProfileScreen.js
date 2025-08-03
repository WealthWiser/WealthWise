import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/slices/userSlice';
import { setTransactions } from '../redux/slices/transactionSlice';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, FontSizes, FontWeights, Spacing } from '../utils/theme';
const ProfileScreen = () => {
    const [profile, setProfile] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUserDetails = async () => {
            const { data: { user }} = await supabase.auth.getUser();
            if (!user) return;

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
        };

        fetchUserDetails();
    }, []);
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert('Error logging out: ' + error.message);
        } else {
            dispatch(setUserData({ name: '', income: 0, riskProfile: 'medium' }));
            dispatch(setTransactions([]));
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: 24, fontFamily:'Lato-Regular' }}>Account</Text>
            {profile ? (
                <View style={{ padding: 20 }}>
                    <Text style={styles.title}>Welcome, {profile.first_name} {profile.last_name} 👋</Text>
                    <Text style={styles.text}>Email: {profile.email}</Text>
                    <Text style={styles.text}>DOB: {profile.dob}</Text>
                    <Text style={styles.text}>Gender: {profile.gender}</Text>
                    <Text style={styles.text}>Country: {profile.country}</Text>
                </View>
            ) : (
                <ActivityIndicator size="large" color="#000" />
            )}

            <Button title="Logout" onPress={handleLogout} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
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
