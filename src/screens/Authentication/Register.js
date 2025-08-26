import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Checkbox,
  IconButton,
  Divider
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { Dropdown } from 'react-native-paper-dropdown';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import maleIcon from '../../assets/male.png';
import femaleIcon from '../../assets/female.png';
import otherIcon from '../../assets/other.png';

const RegisterScreen = ({ navigation }) => {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required.'),
    email: Yup.string().email('Invalid email').required('Email is required.'),
    password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required.'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
    dob: Yup.date().required('Date of birth is required.'),
    gender: Yup.string().required('Select your gender.'),
    country: Yup.string().required('Select your country.'),
    agree: Yup.boolean().oneOf([true], 'You must agree to the Terms of Service.'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
                   <Image
                     source={require('../../assets/wwLogo.png')}
                     style={styles.logo}
                     resizeMode="contain"
                   />
                 </View>

            <View style={styles.card}>
              <Formik
                initialValues={{
                 fullName: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  dob: '',
                  gender: '',
                  country: '',
                  agree: false,
                }}
                validationSchema={RegisterSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                  try {
                    const { data: signUpData, error } = await supabase.auth.signUp({
                      email: values.email,
                      password: values.password,
                      options: {
                        data: {
                          full_name: values.fullName,
                          dob: formatDate(values.dob),
                          gender: values.gender,
                          country: values.country,
                        },
                      },
                    });

                    if (error) {
                      setErrors({ email: error.message });
                      return;
                    }

                    const userId = signUpData?.user?.id;
                    const userEmail = signUpData?.user?.email;

                    if (userId) {
                      const { error: insertError } = await supabase.from('users').insert([
                        {
                          id: userId,
                          email: userEmail,
                          full_name: values.fullName,
                          dob: formatDate(values.dob),
                          gender: values.gender,
                          country: values.country,
                        },
                      ]);

                      if (insertError) {
                        console.error('Insert error:', insertError.message);
                      }
                    }
                  } catch (e) {
                    console.error('Unexpected signup error:', e.message);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (
                  <>
                    <Text style={styles.heading}>Create Your Account</Text>

                    {/* Full Name */}
                    <TextInput
                      label="Full Name"
                      value={values.fullName}
                      onChangeText={handleChange('fullName')}
                      style={styles.input}
                      mode="outlined"
                      left={<TextInput.Icon icon="account" />}
                      error={touched.fullName && !!errors.fullName}
                    />
                    {touched.fullName && errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

                    {/* DOB */}
                    <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                      <View pointerEvents="none"> 
                          <TextInput
                              label="Date of Birth"
                              value={values.dob ? moment(values.dob).format('DD MMMM, YYYY') : ''}
                              editable={false}
                              style={styles.input}
                              mode="outlined"
                              left={<TextInput.Icon icon="calendar" />}
                              error={touched.dob && !!errors.dob}
                          />
                      </View>
                  </TouchableOpacity>
                    {touched.dob && errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="date"
                      maximumDate={new Date()}
                      date={values.dob || new Date(2000, 0, 1)}
                      onConfirm={(date) => {
                        setFieldValue('dob', date);
                        setDatePickerVisibility(false);
                      }}
                      onCancel={() => setDatePickerVisibility(false)}
                    />

                    {/* Email */}
                    <TextInput
                      label="Email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      mode="outlined"
                      keyboardType="email-address"
                      style={styles.input}
                      left={<TextInput.Icon icon="email" />}
                      error={touched.email && !!errors.email}
                    />
                    {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                    {/* Password */}
                    <View style={styles.passwordRow}>
                      <TextInput
                        label="Password"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        mode="outlined"
                        secureTextEntry={!showPassword}
                        style={[styles.input, { flex: 1 }]}
                        left={<TextInput.Icon icon="lock-outline" />}
                      />
                      <IconButton
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                    </View>
                    {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    {/* Confirm Password */}
                    <View style={styles.passwordRow}>
              <TextInput
                label="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                mode="outlined"
                secureTextEntry={!showConfirmPassword}
                style={[styles.input, { flex: 1 }]}
                left={<TextInput.Icon icon="lock-check-outline" />}
                error={touched.confirmPassword && !!errors.confirmPassword}
              />
              <IconButton
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              />
            </View>
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
                              
                {/* Gender */}
                <View style={styles.genderSection}>
                  <Text style={styles.genderHeading}>Gender :</Text>
                  
                  <View style={styles.genderContainer}>
                    {[
                      { key: 'male', icon: maleIcon },
                      { key: 'female', icon: femaleIcon },
                      { key: 'other', icon: otherIcon },
                    ].map((g) => (
                      <TouchableOpacity
                        key={g.key}
                        onPress={() => setFieldValue('gender', g.key)}
                        style={[
                          styles.genderButton,
                          values.gender === g.key && styles.genderButtonSelected,
                        ]}
                      >
                        <Image
                          source={g.icon}
                          style={[
                            styles.genderIcon,
                            values.gender === g.key && styles.genderIconSelected,
                          ]}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>


                    {/* Country */}
                    <Dropdown
                      label="Country"
                      mode="outlined"
                      visible={showCountryDropdown}
                      showDropDown={() => setShowCountryDropdown(true)}
                      onDismiss={() => setShowCountryDropdown(false)}
                      value={values.country}
                      onSelect={(val) => setFieldValue('country', val)}
                      options={[
                        { label: 'India', value: 'india' },
                        { label: 'United States', value: 'usa' },
                        { label: 'United Kingdom', value: 'uk' },
                        { label: 'Germany', value: 'germany' },
                        { label: 'Other', value: 'other' },
                      ]}
                      inputProps={{ style: styles.input }}
                    />
                    {touched.country && errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

                    {/* Terms */}
                    <View style={styles.checkboxRow}>
                      <Checkbox.Android
                        status={values.agree ? 'checked' : 'unchecked'}
                        onPress={() => setFieldValue('agree', !values.agree)}
                        color={theme.colors.primary}
                      />
                      <Text
                        onPress={() => setFieldValue('agree', !values.agree)}
                        style={styles.termsText}
                      >
                        I agree to the <Text style={styles.link}>Terms & Privacy Policy</Text>
                      </Text>
                    </View>
                    {touched.agree && errors.agree && <Text style={styles.errorText}>{errors.agree}</Text>}

                    {/* Register button */}
                    <Button
                      mode="contained"
                      onPress={handleSubmit}
                      loading={loading}
                      style={styles.button}
                      labelStyle={styles.buttonLabel}
                      disabled={loading || !values.agree}
                    >
                      Register
                    </Button>

                    {/* Divider + Social Login */}
                    <View style={styles.dividerContainer}>
                      <Divider style={styles.divider} />
                      <Text style={styles.dividerText}>or</Text>
                      <Divider style={styles.divider} />
                    </View>

                    <Button
                      mode="outlined"
                      icon="google"
                      style={styles.socialButton}
                      labelStyle={styles.socialLabel}
                      onPress={() => console.log('Google Login Pressed')}
                    >
                      Continue with Google
                    </Button>

                    <Text style={styles.loginText}>
                      Already have an account?{' '}
                      <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
                        Login
                      </Text>
                    </Text>
                  </>
                )}
              </Formik>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

// Theme + styles
const theme = {
  colors: {
    primary: '#00A79D',
    background: '#F9FBFC',
    text: '#1A202C',
    lightGray: '#E2E8F0',
    error: '#E53E3E',
  },
  spacing: {
    xs: 6,
    s: 10,
    m: 16,
    l: 24,
  },
  roundness: 14,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.l,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: theme.spacing.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    backgroundColor: theme.colors.background,
    marginBottom: theme.spacing.s,
    borderRadius: theme.roundness,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    marginBottom: theme.spacing.s,
    marginTop: -2,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.m,
  },
  termsText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 6,
    flexShrink: 1,
  },
  link: {
    color: '#5891ecff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
 button: {
    marginTop: theme.spacing.s,
    borderRadius: 26,
    backgroundColor: '#4981f9ff',
    paddingVertical: 6,
  },
  
  buttonLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.text,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.l,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.lightGray,
  },
  dividerText: {
    marginHorizontal: theme.spacing.m,
    color: theme.colors.text,
    fontSize: 12,
  },
  socialButton: {
    borderRadius: theme.roundness,
    borderColor: theme.colors.lightGray,
    marginBottom: theme.spacing.s,
  },
  socialLabel: {
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  dobButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderColor: theme.colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  dobText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  logo: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center', 
  },

genderSection: {
  alignItems: 'flex-start', // <-- use 'flex-start', not 'left'
  marginVertical: 20,
},

genderHeading: {
  fontSize: 18,
  fontWeight: '800',
  marginBottom: 12,
  color: '#333',
},

genderContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginBottom: 14,
},

genderButton: {
  width: 50,
  height: 50,
  borderRadius: 35,
  borderWidth: 2,
  borderColor: '#f9f9f9ff',
  backgroundColor: '#f8f8f8',
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
},

genderButtonSelected: {
  borderColor: '#1975dfff',
  backgroundColor: '#fff',
  shadowColor: '#1975dfff',
  shadowOpacity: 0.3,
  elevation: 6,
},

genderIcon: {
  width: 32,
  height: 32,
},

genderIconSelected: {

},



});

export default RegisterScreen;
