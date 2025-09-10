import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Feather from 'react-native-vector-icons/Feather';

export default function ManualEntryScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    type: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    console.log("New Transaction:", form); // ✅ will integrate later
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
      </View>

      {/* Form */}
      <TextInput
        placeholder="Type (Income/Expense)"
        style={styles.input}
        value={form.type}
        onChangeText={(v) => handleChange("type", v)}
      />
      <TextInput
        placeholder="Amount"
        style={styles.input}
        keyboardType="numeric"
        value={form.amount}
        onChangeText={(v) => handleChange("amount", v)}
      />
      <TextInput
        placeholder="Category"
        style={styles.input}
        value={form.category}
        onChangeText={(v) => handleChange("category", v)}
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        style={styles.input}
        value={form.date}
        onChangeText={(v) => handleChange("date", v)}
      />
      <TextInput
        placeholder="Description (optional)"
        style={styles.input}
        value={form.description}
        onChangeText={(v) => handleChange("description", v)}
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
