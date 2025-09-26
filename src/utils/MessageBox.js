import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSizes, Fonts, Spacing } from './theme';
import Feather from 'react-native-vector-icons/Feather';

const MessageBox = ({ type, message, onDismiss }) => {
  return (
    <View style={[styles.container, type === 'success' ? styles.success : styles.error]}>
      <Text style={styles.messageText}>{message}</Text>
      <TouchableOpacity onPress={onDismiss}>
        <Feather name="x" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: 12,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  success: {
    backgroundColor: '#28a745',  // Green background
  },
  error: {
    backgroundColor: '#dc3545',  // Red background
  },
  messageText: {
    flex: 1,
    color: '#fff',
    fontFamily: Fonts.primary,
    fontSize: FontSizes.md,
  },
});

export default MessageBox;
