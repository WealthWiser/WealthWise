import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  Colors,
  Spacing,
  FontSizes,
  Fonts,
  FontWeights,
} from '../../../utils/theme';
import { CATEGORY_OPTIONS } from '../constants';

const BudgetFormModal = ({ visible, onClose, budget, onSave, loading }) => {
  const [category, setCategory] = useState(budget?.category || '');
  const [amount, setAmount] = useState(budget?.amount?.toString() || '');
  const [startDate, setStartDate] = useState(
    budget ? new Date(budget.start_date) : new Date(),
  );
  const [endDate, setEndDate] = useState(
    budget ? new Date(budget.end_date) : new Date(),
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setAmount(budget.amount.toString());
      setStartDate(new Date(budget.start_date));
      setEndDate(new Date(budget.end_date));
    } else {
      setCategory('');
      setAmount('');
      setStartDate(new Date());
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setEndDate(nextMonth);
    }
  }, [budget, visible]);

  const handleSave = () => {
    if (!category || !amount || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Please fill all fields with valid data');
      return;
    }
    if (endDate <= startDate) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }
    const budgetData = {
      category,
      amount: parseFloat(amount),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    };
    onSave(budgetData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {budget ? 'Edit Budget' : 'Create New Budget'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={Colors.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Category Selection */}
            <Text style={styles.fieldLabel}>Category</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Text
                style={[
                  styles.pickerButtonText,
                  !category && styles.placeholder,
                ]}
              >
                {category || 'Select Category'}
              </Text>
              <Feather name="chevron-down" size={20} color={Colors.grayDark} />
            </TouchableOpacity>

            {/* Amount, Dates, and Save Button */}
            <Text style={styles.fieldLabel}>Budget Amount</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter amount (₹)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor={Colors.grayLight}
            />
            <Text style={styles.fieldLabel}>Budget Period</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={[styles.dateButton, { flex: 1, marginRight: 8 }]}
                onPress={() => setShowStartPicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {startDate.toLocaleDateString()}
                </Text>
                <Feather name="calendar" size={16} color={Colors.grayDark} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateButton, { flex: 1, marginLeft: 8 }]}
                onPress={() => setShowEndPicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {endDate.toLocaleDateString()}
                </Text>
                <Feather name="calendar" size={16} color={Colors.grayDark} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {budget ? 'Update Budget' : 'Create Budget'}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>

          {/* Category Picker Modal */}
          <Modal
            visible={showCategoryPicker}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.pickerOverlay}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>Select Category</Text>
                  <TouchableOpacity
                    onPress={() => setShowCategoryPicker(false)}
                  >
                    <Feather name="x" size={20} color={Colors.textDark} />
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  {CATEGORY_OPTIONS.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.categoryOption,
                        category === option.value &&
                          styles.selectedCategoryOption,
                      ]}
                      onPress={() => {
                        setCategory(option.value);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <View
                        style={[
                          styles.categoryOptionIcon,
                          { backgroundColor: option.color },
                        ]}
                      >
                        <Feather
                          name={option.icon}
                          size={16}
                          color={Colors.white}
                        />
                      </View>
                      <Text
                        style={[
                          styles.categoryOptionText,
                          category === option.value &&
                            styles.selectedCategoryText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* Date Pickers */}
          <DateTimePickerModal
            isVisible={showStartPicker}
            mode="date"
            onConfirm={date => {
              setStartDate(date);
              setShowStartPicker(false);
            }}
            onCancel={() => setShowStartPicker(false)}
          />
          <DateTimePickerModal
            isVisible={showEndPicker}
            mode="date"
            minimumDate={startDate}
            onConfirm={date => {
              setEndDate(date);
              setShowEndPicker(false);
            }}
            onCancel={() => setShowEndPicker(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    fontFamily: Fonts.bold,
  },
  closeButton: { padding: Spacing.xs },
  fieldLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontFamily: Fonts.regular,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  pickerButtonText: {
    fontSize: FontSizes.md,
    color: Colors.textDark,
    fontFamily: Fonts.regular,
  },
  placeholder: { color: Colors.grayLight },
  textInput: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textDark,
    marginBottom: Spacing.md,
    fontFamily: Fonts.regular,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: Spacing.md,
  },
  dateButtonText: {
    fontSize: FontSizes.md,
    color: Colors.textDark,
    fontFamily: Fonts.regular,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: Colors.primaryLight },
  saveButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    padding: Spacing.md,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  pickerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
    fontFamily: Fonts.bold,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  selectedCategoryOption: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
  },
  categoryOptionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryOptionText: {
    fontSize: FontSizes.md,
    color: Colors.textDark,
    fontFamily: Fonts.regular,
  },
  selectedCategoryText: {
    fontWeight: FontWeights.bold,
    color: Colors.primaryDeep,
    fontFamily: Fonts.bold,
  },
});

export default BudgetFormModal;
