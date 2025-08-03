import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Text} from 'react-native-paper';
import { supabase } from '../lib/supabase';
import { Formik } from 'formik';
import * as Yup from 'yup';
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
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    })
    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    const { error } = await supabase.auth.signInWithPassword({email: values.email, password: values.password });
                    if (error) {
                        setErrors({ email: error.message });
                    }
                    setSubmitting(false);
                }}
            >
                {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (
                    <>
                        <Text variant='titleLarge' style={styles.title}>Welcome to WealthWise 💰</Text>

                        <TextInput
                            label="Email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            mode="outlined"
                            keyboardType="email-address"
                            style={styles.input}
                            />
                        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        <TextInput
                            label="Password"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            mode="outlined"
                            secureTextEntry
                            style={styles.input}
                            />
                        {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        {/* {errorMessage && (
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        )} */}
                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            loading={values.isSubmiting}
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
                    </>
                )}

            </Formik>
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
    errorText: {
        color: 'red',
        fontSize: 13,
        marginTop: -1,
        marginBottom: 10,
    },
});

export default LoginScreen;