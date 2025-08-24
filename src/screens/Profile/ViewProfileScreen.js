import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Fonts, FontSizes, Spacing } from '../../utils/theme';

const ViewProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error) setProfile(data);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>View Profile</Text>
        </View>

        {/* Profile Card with Initials Circle */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {profile.first_name?.[0]}
              {profile.last_name?.[0]}
            </Text>
          </View>
          <View style={styles.profileNameWrapper}>
            <Text style={styles.profileName}>
              {profile.first_name} {profile.last_name}
            </Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
        </View>

        {/* Profile Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Date of Birth</Text>
            <Text style={styles.value}>{profile.dob || 'Not provided'}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Gender</Text>
            <Text style={styles.value}>{profile.gender || 'Not provided'}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Country</Text>
            <Text style={styles.value}>
              {profile.country || 'Not provided'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.value}>
              {new Date(profile.created_at).toLocaleDateString('default', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { padding: Spacing.md },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },

  // Profile Card Styles
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }, 
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#a2a2a2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  profileNameWrapper: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bold,
    color: '#000',
  },
  profileEmail: {
    fontSize: FontSizes.sm,
    color: 'gray',
  },

  // Info Card Styles
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: FontSizes.sm,
    color: 'gray',
    fontWeight: 'bold',
  },
  value: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    color: '#000',
    flexShrink: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 0,
    marginBottom: 6,
  },
});


export default ViewProfileScreen;