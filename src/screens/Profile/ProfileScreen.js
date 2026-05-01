import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/slices/userSlice';
import { logout } from '../../redux/slices/authSlice';
import { setTransactions } from '../../redux/slices/transactionSlice';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, FontSizes, Spacing } from '../../utils/theme';
import {
  changeSStatusBarTextStyle,
  changeStatusBarColorBot,
} from '../../redux/slices/statusbarColor';
import { useFocusEffect } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { ActivityIndicator } from 'react-native-paper';
import { handleUpload, SelectFile } from './TransactionPdf'; // Import SelectFile
import MessageBox from '../../utils/MessageBox';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [memberSince, setMemberSince] = useState(null);
  const [messageData, setMessageData] = useState({ type: '', message: '', visible: false });
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [pdfPassword, setPdfPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(changeStatusBarColorBot('#F2F2F2'));
      dispatch(changeSStatusBarTextStyle('light-content'));
      return () => {
        dispatch(changeSStatusBarTextStyle('dark-content'));
        dispatch(changeStatusBarColorBot(Colors.neutralBackground));
      };
    }, [dispatch]),
  );

  useEffect(() => {
    // const fetchUserDetails = async () => {
    //   const { data: { user } } = await supabase.auth.getUser();
    //   if (!user) return;

    //   if (user?.created_at) {
    //     const date = new Date(user.created_at);
    //     const formatted = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    //     setMemberSince(formatted);
    //   }

    //   const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single();
    //   if (!error) setProfile(data);
    // };

    // fetchUserDetails();
  }, []);

  const handleFileSelection = async () => {
    const file = await SelectFile();
    if (file && file.uri) {
      setSelectedFile(file);
      setPasswordModalVisible(true);
    } else {
      setMessageData({ type: 'info', message: 'File selection cancelled.', visible: true });
    }
  };

  const executeUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const result = await handleUpload(selectedFile, pdfPassword);
    setIsUploading(false);

    setPasswordModalVisible(false);
    setPdfPassword('');
    setSelectedFile(null);

    setMessageData({
      type: result.success ? 'success' : 'error',
      message: result.message,
      visible: true,
    });
  };

  const handleLogout = async () => {
    dispatch(logout());
    Alert.alert("Succesfully logged out")
    // const { error } = await supabase.auth.signOut();
    // if (!error) {
    //   dispatch(setUserData({ name: '', income: 0, riskProfile: 'medium' }));
    //   dispatch(setTransactions([]));
    // }
  };

  // if (!profile) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', paddingVertical: 40 }}>
  //       <ActivityIndicator size="large" color={'#10266F'} />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      {/* Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => {
          setPasswordModalVisible(false);
          setPdfPassword('');
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalCenteredView}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>PDF Password</Text>
            <Text style={styles.modalText}>
              If your PDF statement is password-protected, please enter the password below.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Optional Password"
              placeholderTextColor={Colors.grayLight}
              secureTextEntry
              value={pdfPassword}
              onChangeText={setPdfPassword}
            />
            {isUploading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
            ) : (
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setPasswordModalVisible(false);
                    setPdfPassword('');
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.uploadButton]}
                  onPress={executeUpload}
                >
                  <Text style={styles.modalButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#F2F2F2' }} stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
        {/* Back Arrow */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('HomeTabs', { screen: 'Home' })}>
            <Feather name="arrow-left" size={26} color="#F2F2F2" />
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        {/* {profile && (
          <View style={styles.profileHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={styles.name}>{profile.first_name} {profile.last_name}</Text>
                <Text style={styles.email}>{profile.email}</Text>
                {memberSince && <Text style={styles.memberSince}>Member since {memberSince}</Text>}
              </View>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{profile.first_name?.[0]}{profile.last_name?.[0]}</Text>
              </View>
            </View>
            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewProfileBtn} onPress={() => navigation.navigate('ViewProfile')}>
                <Text style={styles.editProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )} */}

        {/* Risk Analysis + Upload Transactions */}
        {/* <View style={styles.section}>
          <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('RiskAnalysis')}>
            <View style={styles.optionRow}>
              <Feather name="bar-chart-2" size={22} color={Colors.grayDark} />
              <Text style={styles.optionText}>Take Risk Analysis Test</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard} onPress={handleFileSelection}>
            <View style={styles.optionRow}>
              <Feather name="file-text" size={22} color={Colors.grayDark} />
              <Text style={styles.optionText}>Upload Transactions (PDF)</Text>
            </View>
          </TouchableOpacity>
          {messageData.visible && (
            <MessageBox
              type={messageData.type}
              message={messageData.message}
              onDismiss={() => setMessageData({ ...messageData, visible: false })}
            />
          )}
        </View> */}

        {/* Support & Legal */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <Feather name="help-circle" size={22} color={Colors.grayDark} />
              <Text style={styles.optionText}>Help & Support</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <Feather name="info" size={22} color={Colors.grayDark} />
              <Text style={styles.optionText}>About WealthWise</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <Feather name="shield" size={22} color={Colors.grayDark} />
              <Text style={styles.optionText}>Terms & Privacy</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <Feather name="star" size={22} color={Colors.grayDark} />
              <Text style={styles.optionText}>Rate App</Text>
            </View>
          </TouchableOpacity>
        </View> */}

        {/* Sign Out */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <MaterialDesignIcons name={'logout'} size={22} color={'red'} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  // ... (previous styles remain the same)
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDeep,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.primaryDeep,
  },
  profileHeader: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primaryDeep,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2C1124',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    fontFamily: Fonts.heading,
    color: '#F2F2F2',
  },
  email: {
    fontSize: FontSizes.md,
    marginBottom: 4,
    fontFamily: Fonts.primary,
    color: '#F2F2F2',
  },
  memberSince: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.primary,
    marginBottom: 12,
    color: '#F2F2F2',
  },
  profileActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editProfileBtn: {
    backgroundColor: '#963D5A',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  viewProfileBtn: {
    backgroundColor: '#087E8B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    marginHorizontal: Spacing.md,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    marginBottom: 12,
    paddingBottom: 5,
    color: Colors.grayDark,
  },
  optionCard: {
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.primary,
    color: Colors.grayDark,
    marginLeft: 12,
  },
  footer: {
    marginHorizontal: Spacing.lg,
    marginBottom: 40,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 15,
    borderRadius: 14,
    borderBottomWidth: 1,
    borderColor: '#e63946',
  },
  logoutText: {
    color: '#e63946',
    fontSize: FontSizes.md,
    fontFamily: Fonts.heading,
    marginLeft: 12,
  },
  // Modal styles
  modalCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: Fonts.primary,
    color: Colors.grayDark,
  },
  modalInput: {
    width: '100%',
    height: 45,
    borderColor: Colors.grayLight,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontFamily: Fonts.primary,
    color: Colors.grayDark,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  uploadButton: {
    backgroundColor: Colors.primary,
  },
  modalButtonText: {
    color: 'white',
    fontFamily: Fonts.primary,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;