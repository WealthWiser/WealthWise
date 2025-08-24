import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { ActivityIndicator, View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/slices/userSlice';
import BottomTabNavigator from './BottomTabNavigator'
import LoginScreen from '../screens/Authentication/Login';
import RegisterScreen from '../screens/Authentication/Register';
import OnboardingScreen from '../screens/Splash/OnboardingScreen';
import ViewProfileScreen from '../screens/Profile/ViewProfileScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();


const AppNavigator = () => {
    const [sessionChecked, setSessionChecked] = useState(false);
    const [session, setSession] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const restoreSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (data?.session) {
                setSession(data.session);
                dispatch(setUserData({
                    name: data.session.user.email,
                    income: 0,
                }));
            }
            setSessionChecked(true);
        };

        restoreSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    if (!sessionChecked) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text>Checking session...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none'}}>
                {session ? (
                    <>
                        <Stack.Screen name="HomeTabs" component={BottomTabNavigator} />
                        <Stack.Screen name="Profile" component={ProfileScreen} /> 
                        <Stack.Screen name="ViewProfile" component={ViewProfileScreen} /> 
                        {/* Add other screens that need to be stacked above tabs */}
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
