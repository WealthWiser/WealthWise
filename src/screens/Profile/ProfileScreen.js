import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/slices/userSlice';
import { setTransactions } from '../../redux/slices/transactionSlice';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, FontSizes, Spacing } from '../../utils/theme';

import Feather from 'react-native-vector-icons/Feather';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [memberSince, setMemberSince] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // save created_at for "member since"
      if (user?.created_at) {
        const date = new Date(user.created_at);
        const formatted = date.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        setMemberSince(formatted);
      }

      // fetch user profile details
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error) setProfile(data);
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      dispatch(setUserData({ name: '', income: 0, riskProfile: 'medium' }));
      dispatch(setTransactions([]));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Back Arrow */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Feather name="arrow-left" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Header */}
        {profile ? (
          <View style={styles.profileHeader}>
            {/* Circle Avatar with Initials */}
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {profile.first_name?.[0]}
                {profile.last_name?.[0]}
              </Text>
            </View>

            <Text style={styles.name}>
              {profile.first_name} {profile.last_name}
            </Text>
            <Text style={styles.email}>{profile.email}</Text>

            {memberSince && (
              <Text style={styles.memberSince}>Member since {memberSince}</Text>
            )}

            {/* Row for Edit + View buttons */}
            <View style={styles.profileActions}>
              <TouchableOpacity
                style={styles.editProfileBtn}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewProfileBtn}
                onPress={() => navigation.navigate('ViewProfile')}
              >
                <Text style={styles.editProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color={Colors.primary} />
        )}

        {/* Risk Analysis + Upload Transactions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('RiskAnalysis')}
          >
            <View style={styles.optionRow}>
              <Feather name="bar-chart-2" size={20} color="#333" />
              <Text style={styles.optionText}>Take Risk Analysis Test</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('UploadTransactions')}
          >
            <View style={styles.optionRow}>
              <Feather name="file-text" size={20} color="#333" />
              <Text style={styles.optionText}>Upload Transactions (CSV)</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>

          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <Feather name="help-circle" size={20} color="#333" />
              <Text style={styles.optionText}>Help & Support</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <Feather name="info" size={20} color="#333" />
              <Text style={styles.optionText}>About WealthWise</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <Feather name="shield" size={20} color="#333" />
              <Text style={styles.optionText}>Terms & Privacy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionRow}>
              <Feather name="star" size={20} color="#333" />
              <Text style={styles.optionText}>Rate App</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutralBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 20,
    zIndex: 10,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 16,
    marginHorizontal: Spacing.lg,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#a2a2a2ff', 
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
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    fontFamily: Fonts.heading,
  },
  email: {
    fontSize: FontSizes.md,
    color: 'gray',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: FontSizes.sm,
    color: 'gray',
    marginBottom: 12,
  },
  profileActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editProfileBtn: {
    backgroundColor: '#ff9244ff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  viewProfileBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.body,
    color: '#333',
    marginLeft: 12,
  },

  footer: {
    marginHorizontal: Spacing.lg,
    marginBottom: 40,
  },
  logoutBtn: {
    backgroundColor: '#e63946',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: FontSizes.md,
  },
});

export default ProfileScreen;
