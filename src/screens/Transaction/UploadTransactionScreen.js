import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

export default function UploadTransactionScreen() {
  const navigation = useNavigation();

  const handleUpload = () => {
    console.log('PDF Upload simulated ✅');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Bank Statement</Text>
      </View>

      <Text style={styles.infoText}>
        Select and upload your bank statement PDF to add transactions.
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={handleUpload}>
        <Text style={styles.buttonText}>Choose File</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
  infoText: { fontSize: 16, marginVertical: 20 },
  primaryButton: {
    backgroundColor: '#6C63FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
