import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../../lib/supabase';

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Top Green Background */}
      <View style={styles.bgTop} />
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome</Text>
        <View style={styles.card}>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
              setStatus('');
              const { error } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
              });
              if (error) setStatus(error.message);
              else setStatus('');
              setSubmitting(false);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
              status,
              setFieldTouched,
            }) => (
              <>
                {/* Email Field */}
                <Text style={styles.label}>Username Or Email</Text>
                <View style={styles.inputOuter}>
                  <TextInput
                    placeholder="example@example.com"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={() => setFieldTouched('email')}
                    mode="flat"
                    style={styles.input}
                    theme={{
                      colors: { background: 'transparent', text: '#28322e', placeholder: '#8dbba7',underlineColor: 'transparent' }
                    }}
                    underlineColor="transparent"
                    placeholderTextColor="#8d9fbbff"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                {/* Password Field */}
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputOuter}>
                  <TextInput
                    placeholder="••••••••"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={() => setFieldTouched('password')}
                    mode="flat"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    theme={{
                      colors: { background: 'transparent', text: '#28322e', placeholder: '#8dbba7' }
                    }}
                    placeholderTextColor="#8d9fbbff"
                    underlineColor="transparent"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Feather name="eye" size={22} color="#8d9fbbff" />
                    ) : (
                      <Feather name="eye-off" size={22} color="#8d9fbbff" />
                    )}
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                {status ? <Text style={styles.errorText}>{status}</Text> : null}

                {/* Log In Button */}
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  style={styles.loginBtn}
                  labelStyle={styles.loginLabel}
                  contentStyle={{ height: 50 }}
                  uppercase={false}
                >
                  Log In
                </Button>

                {/* Forgot Password */}
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Sign Up Button */}
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('Register')}
                  style={styles.signUpBtn}
                  labelStyle={styles.signUpLabel}
                  contentStyle={{ height: 50 }}
                  uppercase={false}
                >
                  Sign Up
                </Button>

                {/* Fingerprint Access */}
                {/* <Text style={styles.fingerprint}>
                  Use <Text style={styles.fingerprintHighlight}>Fingerprint</Text> To Access
                </Text> */}

                {/* Social Login */}
                <Text style={styles.orSignUp}>or sign up with</Text>
                <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={require('../../assets/facebook.png')}   
                    style={{ width: 35, height: 35, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>

                 <TouchableOpacity style={styles.socialButton}>
                  <Image
                    source={require('../../assets/google.png')}   
                    style={{ width: 22, height: 22, resizeMode: 'contain' }}
                  />
                </TouchableOpacity>

                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#4981f9ff',
  },
  bgTop: {
    backgroundColor: '#4981f9ff',
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '26%',
    borderBottomLeftRadius: 54,
    borderBottomRightRadius: 54,
    zIndex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    zIndex: 2,
  },
  welcome: {
    fontSize: 31,
    fontWeight: '700',
    color: '#ffffffff',
    textAlign: 'center',
    marginTop: 65,
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#eff6ffff',
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
    paddingVertical: 25,
    paddingHorizontal: 28,
    flex: 1,
    marginTop: 50,
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  label: {
    color: '#3a4936',
    fontWeight: '600',
    fontSize: 15,
    alignSelf: 'flex-start',
    marginBottom: 4,
    marginTop: 10,
    letterSpacing: 0.15,
  },
  inputOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5edffff',
    borderRadius: 22,
    paddingHorizontal: 18,
    height: 52,
    marginBottom: 18,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: '#262d33ff',
    paddingVertical: 0,
    margin: 0,
    borderWidth: 0,
    minHeight: 48,
  },
  eyeButton: {
    paddingLeft: 4,
    paddingVertical: 2,
  },
  errorText: {
    color: '#cf2b2b',
    marginBottom: 6,
    fontSize: 13,
    marginLeft: 2,
    alignSelf: 'flex-start',
  },
  loginBtn: {
    backgroundColor: '#4981f9ff',
    borderRadius: 28,
    marginTop: 6,
    marginBottom: 2,
    width: '87%',
    alignSelf: 'center',
    elevation: 0,
  },
  loginLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: '#fff',
  },
  forgot: {
    color: '#1469f1ff',
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
    textDecorationLine: 'underline',
    opacity: 0.8,
  },
  signUpBtn: {
    backgroundColor: '#d9e7ffff',
    borderRadius: 28,
    width: '87%',
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 16,
    elevation: 0,
  },
  signUpLabel: {
    color: '#086ff6ff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  fingerprint: {
    textAlign: 'center',
    fontSize: 15.5,
    marginBottom: 3,
    fontWeight: '400',
    marginTop: 10,
    color: '#14271e',
  },
  fingerprintHighlight: {
    color: '#118aqu', 
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  orSignUp: {
    textAlign: 'center',
    fontSize: 13.7,
    color: '#6f7e87ff',
    marginBottom: 7,
    marginTop: 6,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
    marginTop: 3,
  },
  socialButton: {
    backgroundColor: '#ffffffff',
    borderRadius: 22,
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  socialIcon: {
    fontSize: 22,
    color: '#2614f0ff',
    fontWeight: 'bold',
  },

});

export default LoginScreen;
