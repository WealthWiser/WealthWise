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
    IconButton
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment'; // Optional: for clean date formatting
import { Dropdown } from 'react-native-paper-dropdown';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import {FontSizes, Colors, FontWeights, Spacing, Fonts } from '../../utils/theme';

const RegisterScreen = ({ navigation }) => {
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const formatDate = (date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    const RegisterSchema = Yup.object().shape({
        firstName: Yup.string().required('First name is required.'),
        lastName: Yup.string().required('Last name is required.'),
        email: Yup.string().email('Invalid email').required('Email is required.'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required(),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm your password'),
        dob: Yup.date().required('Date of birth is required.'),
        gender: Yup.string().required('Select your gender.'),
        country: Yup.string().required('Select your country.'),
        agree: Yup.boolean().oneOf([true], 'You must agree to the Terms of Service.'),
    });
    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
                    <ScrollView
                        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        >

                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
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
                                    // 1. Sign up user
                                    const { data: signUpData, error } = await supabase.auth.signUp({
                                    email: values.email,
                                    password: values.password,
                                    options: {
                                        data: {
                                        first_name: values.firstName,
                                        last_name: values.lastName,
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

                                    console.log('User ID:', userId);
                                    console.log('User Email:', userEmail);

                                    // 2. Insert into custom users table
                                    if (userId) {
                                    const { error: insertError } = await supabase.from('users').insert([
                                        {
                                        id: userId,
                                        email: userEmail,
                                        first_name: values.firstName,
                                        last_name: values.lastName,
                                        dob: formatDate(values.dob),
                                        gender: values.gender,
                                        country: values.country,
                                        },
                                    ]);

                                    if (insertError) {
                                        console.error('Insert error:', insertError.message);
                                    } else {
                                        console.log('User profile inserted!');
                                    }
                                    }

                                    // alert('Verification email sent.');
                                    // navigation.navigate('Login');
                                } catch (e) {
                                    console.error('Unexpected signup error:', e.message);
                                } finally {
                                    setSubmitting(false);
                                }
                                }}
                            >
                            {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (

                            <>

                                <Text variant='titleLarge' style={styles.title}>Create an Account</Text>

                                <View style={styles.row}>
                                    <TextInput
                                        label="First Name"
                                        value={values.firstName}
                                        onChangeText={handleChange('firstName')}
                                        style={[styles.input, { flex: 1, marginRight: 8 }]}
                                        mode="outlined"
                                    />


                                    <TextInput
                                        label="Last Name"
                                        value={values.lastName}
                                        onChangeText={handleChange('lastName')}
                                        style={[styles.input, { flex: 1 }]}
                                        mode="outlined"
                                        />

                                </View>
                                {touched.firstName && errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                                {touched.lastName && errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                                <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.dobButton}>
                                    <Text style={styles.dobText}>
                                        {values.dob ? `DOB: ${moment(values.dob).format('DD-MM-YYYY')}` : '📅 Select Date of Birth'}
                                    </Text>
                                </TouchableOpacity>

                                {touched.dob && errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    maximumDate={new Date()}
                                    date={values.dob || new Date(2000, 0, 1)}
                                    onConfirm={(date) => {
                                        setFieldValue('dob',date);
                                        setDatePickerVisibility(false);
                                    }}
                                    onCancel={() => setDatePickerVisibility(false)}
                                    />
                                <TextInput
                                    label="Email"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    mode="outlined"
                                    keyboardType="email-address"
                                    style={styles.input}
                                />

                                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                                <View style={styles.passwordRow}>
                                    <TextInput
                                        label="Password"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        mode="outlined"
                                        secureTextEntry={!showPassword}
                                        style={[styles.input, { flex: 1 }]}
                                    />
                                    <IconButton
                                        icon={showPassword ? 'eye-off' : 'eye'}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                </View>

                                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                                <TextInput
                                    label="Confirm Password"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                    mode="outlined"
                                    secureTextEntry
                                    style={styles.input}
                                />

                                {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                                <Dropdown
                                    label="Gender"
                                    placeholder='Select Gender'
                                    mode="outlined"
                                    visible={showGenderDropdown}
                                    showDropDown={() => setShowGenderDropdown(true)}
                                    onDismiss={() => setShowGenderDropdown(false)}
                                    value={values.gender}
                                    onSelect={(val) => setFieldValue('gender', val)}
                                    options={[
                                        { label: 'Male', value: 'male' },
                                        { label: 'Female', value: 'female' },
                                        { label: 'Other', value: 'other' },
                                    ]}
                                    inputProps={{ style: styles.input }}
                                    />

                                {touched.gender && errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

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

                                {/* 📷 Profile picture upload (placeholder) */}
                                <TouchableOpacity style={styles.uploadButton}>
                                    <Text style={styles.uploadText}>📷 Upload Profile Picture (Coming Soon)</Text>
                                </TouchableOpacity>

                                {/* ✅ Terms checkbox */}
                                <View style={styles.checkboxRow}>
                                    <Checkbox
                                        status={values.agree ? 'checked' : 'unchecked'}
                                        onPress={() => setFieldValue('agree',!values.agree)}
                                    />
                                    <Text onPress={() => setFieldValue('agree',!values.agree)} style={styles.termsText}>
                                        I agree to the Terms of Service
                                    </Text>
                                </View>

                                {touched.agree && errors.agree && <Text style={styles.errorText}>{errors.agree}</Text>}

                                <Button
                                    mode="contained"
                                    onPress={handleSubmit}
                                    loading={values.isSubmitting}
                                    style={styles.button}
                                    disabled={loading || !values.agree}
                                    labelStyle={{ color: Colors.gold }}
                                >
                                    Register
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
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.lg,
        backgroundColor: Colors.neutralBackground,
        justifyContent: 'center',
    },
    title: {
        fontSize: FontSizes.xl,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        fontFamily: Fonts.heading,
        fontWeight: FontWeights.bold,
        color: Colors.grayDark,
    },
    input: {
        marginBottom: Spacing.md,
    },
    row: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    uploadButton: {
        paddingVertical: 10,
        marginTop: 4,
        marginBottom: 12,
        alignItems: 'center',
    },
    uploadText: {
        fontSize: FontSizes.sm,
        color: Colors.grayDark,
        fontFamily: Fonts.primary,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    termsText: {
        fontSize: FontSizes.md,
        color: Colors.grayDark,
        fontWeight: FontWeights.semiBold,
        fontFamily: Fonts.primary,
        marginLeft: Spacing.sm,
    },
    errorText: {
        color: 'red',
        fontSize: FontSizes.sm,
        marginTop: -1,
        marginBottom: 10,
        fontFamily: Fonts.primary,
        fontWeight: FontWeights.regular,
    },
    button: {
        marginTop: 8,
        backgroundColor: Colors.blueMid,
        color: Colors.grayLight,
        fontFamily: Fonts.primary,
        fontWeight: FontWeights.bold,
        fontSize: FontSizes.md,
    },
    loginText: {
        marginTop: 24,
        textAlign: 'center',
        fontSize: FontSizes.md,
        color: Colors.grayDark,
        fontFamily: Fonts.primary,
        fontWeight: FontWeights.medium,
    },
    link: {
        color: Colors.blueMid,
        fontWeight: 'bold',
    },
    dobButton: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 16,
        alignItems: 'center',
    },
    dobText: {
        fontSize: FontSizes.md,
        color: Colors.grayDark,
        fontFamily: Fonts.primary,
        fontWeight: FontWeights.regular,
    },
});

export default RegisterScreen;
