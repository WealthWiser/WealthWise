import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { supabase } from '../lib/supabase';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleLogin = async () => {
        setLoading(true);
        setErrorMessage(null); 
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setErrorMessage(error.message);  // Show error message
        }
        setLoading(false);

    };
    const LoginSchema = Yup.object().shape({
        email: Yup.email("Invalid email format").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    })
    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Text variant='titleLarge' style={styles.title}>Welcome to WealthWise 💰</Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
            />
            {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
            )}
            <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                style={styles.button}
            >
                Login
            </Button>

            <Text style={styles.registerText}>
                Don’t have an account?{' '}
                <Text onPress={() => navigation.navigate('Register')} style={styles.link}>
                    Register
                </Text>
            </Text>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 32,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
    registerText: {
        marginTop: 24,
        textAlign: 'center',
    },
    link: {
        color: '#6200ee',
        fontWeight: 'bold',
    },
});

export default LoginScreen;