import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FAB, Button, ActivityIndicator } from "react-native-paper";
import moment from "moment";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Colors, Spacing, FontSizes, Fonts, FontWeights } from "../../utils/theme";
import { supabase } from "../../lib/supabase";

const generateAISuggestion = (goal) => {
  const { saved_amount, target_amount, deadline } = goal;
  const remainingAmount = target_amount - saved_amount;
  const daysLeft = moment(deadline).diff(moment(), "days");
  if (daysLeft <= 0) return "Deadline passed - try setting a new goal.";

  const weeklyNeeded = remainingAmount / (daysLeft / 7);

  if (saved_amount >= target_amount) {
    return "Congratulations! You've reached your goal.";
  } else if (weeklyNeeded > 5000) {
    return `Consider increasing your weekly savings to ₹${Math.round(
      weeklyNeeded
    )} to meet your deadline.`;
  } else if (weeklyNeeded > 0) {
    return `Maintain a weekly saving of ₹${Math.round(
      weeklyNeeded
    )} to reach your goal in time.`;
  }

  return "Keep up the great work!";
};

const SavingsGoalScreen = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTargetAmount, setNewTargetAmount] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [fundModalVisible, setFundModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [fundAmount, setFundAmount] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Not logged in", "Please log in to view your goals.");
        setLoading(false);
        setIsRefreshing(false);
        return;
      }
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("deadline", { ascending: true });
      if (error) throw error;
      const withSuggestions = (data || []).map((goal) => ({
        ...goal,
        ai_suggestion: generateAISuggestion(goal),
      }));
      setGoals(withSuggestions);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch goals");
      console.error(err);
    }
    setLoading(false);
    setIsRefreshing(false);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchGoals();
  };

  const addNewGoal = async () => {
    if (!newTitle || !newTargetAmount || !newDeadline) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("goals")
        .insert([
          {
            title: newTitle,
            target_amount: Number(newTargetAmount),
            saved_amount: 0,
            deadline: newDeadline,
            user_id: user.id,
            icon: "target",
            color: Colors.primaryDark,
            ai_suggestion:
              "Set aside a small amount daily to build momentum!",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setGoals((prevGoals) => [
        ...prevGoals,
        { ...data, ai_suggestion: generateAISuggestion(data) },
      ]);
      Alert.alert("Success", "Goal added successfully!");
      setAddModalVisible(false);
      setNewTitle("");
      setNewTargetAmount("");
      setNewDeadline("");
    } catch (err) {
      Alert.alert("Error", `Failed to add goal: ${err.message}`);
      console.error("Add goal error:", err);
    }
  };

  const handleAddFundsPress = (goal) => {
    setSelectedGoal(goal);
    setFundModalVisible(true);
  };

  const submitAddFunds = async () => {
    if (!fundAmount || isNaN(fundAmount) || Number(fundAmount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid positive number.");
      return;
    }
    const newSavedAmount =
      Number(selectedGoal.saved_amount) + Number(fundAmount);
    const goalId = selectedGoal.id;

    setGoals(
      goals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              saved_amount: newSavedAmount,
              ai_suggestion: generateAISuggestion({
                ...g,
                saved_amount: newSavedAmount,
              }),
            }
          : g
      )
    );
    setFundModalVisible(false);
    setFundAmount("");
    setSelectedGoal(null);

    try {
      const { error } = await supabase
        .from("goals")
        .update({ saved_amount: newSavedAmount })
        .eq("id", goalId);
      if (error) throw error;
      if (newSavedAmount >= selectedGoal.target_amount) {
        await supabase.from("goals").delete().eq("id", goalId);
      }
      fetchGoals();
    } catch (error) {
      Alert.alert(
        "Sync Error",
        "Could not save your progress. Please refresh."
      );
      fetchGoals();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        <Text style={styles.title}>Savings Goals</Text>
        <Text style={styles.subtitle}>
          Your progress, powered by AI-driven advice.
        </Text>

        {loading ? (
          <ActivityIndicator
            animating={true}
            color={Colors.primary}
            size="large"
            style={{ marginTop: 50 }}
          />
        ) : goals.length > 0 ? (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onAddFundsPress={handleAddFundsPress}
            />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Feather name="flag" size={40} color={Colors.grayMedium} />
            <Text style={styles.emptyStateText}>No savings goals yet.</Text>
            <Text style={styles.emptyStateSubText}>
              Tap the '+' button to add your first goal!
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        color={Colors.white}
        onPress={() => setAddModalVisible(true)}
      />

      {/* Add Goal Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalCenteredView}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Goal Title"
              placeholderTextColor="#939090ff" 
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Target Amount (₹)"
              placeholderTextColor="#939090ff" 
              keyboardType="numeric"
              value={newTargetAmount}
              onChangeText={setNewTargetAmount}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Deadline (DD-MM-YYYY)"
              placeholderTextColor="#939090ff" 
              value={newDeadline}
              onChangeText={setNewDeadline}
            />
            <View style={styles.modalButtonContainer}>
              <Button
                mode="outlined"
                onPress={() => setAddModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button mode="contained" onPress={addNewGoal} style={{ flex: 1 }}>
                Add Goal
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Funds Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={fundModalVisible}
        onRequestClose={() => setFundModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalCenteredView}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              Add Funds to "{selectedGoal?.title}"
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Amount to Add (₹)"
              placeholderTextColor="#939090ff" 
              keyboardType="numeric"
              value={fundAmount}
              onChangeText={setFundAmount}
            />
            <View style={styles.modalButtonContainer}>
              <Button
                mode="outlined"
                onPress={() => setFundModalVisible(false)}
                style={{ flex: 1, marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={submitAddFunds}
                style={{ flex: 1 }}
              >
                Confirm
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const GoalCard = ({ goal, onAddFundsPress }) => {
  const {
    title,
    target_amount,
    saved_amount,
    deadline,
    icon,
    color,
    ai_suggestion,
  } = goal;
  const progress =
    saved_amount >= target_amount ? 1 : saved_amount / target_amount;
  const isCompleted = saved_amount >= target_amount;
  const daysLeft = moment(deadline).diff(moment(), "days");
  const amountRemaining = target_amount - saved_amount;

  return (
    <View style={styles.goalCard}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: isCompleted ? Colors.accentTeal : color },
          ]}
        >
          <Feather
            name={isCompleted ? "check-circle" : icon}
            size={24}
            color={Colors.white}
          />
        </View>

        <Text style={styles.goalTitle}>{title}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.savedAmount}>
          ₹{saved_amount.toLocaleString()}
        </Text>
        <Text style={styles.targetAmount}>
          {" "}
          of ₹{target_amount.toLocaleString()}
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress * 100}%`,
              backgroundColor: isCompleted ? Colors.accentTeal : color,
            },
          ]}
        />
      </View>
      <View style={styles.cardFooter}>
        {isCompleted ? (
          <View style={styles.footerCompleteContainer}>
            <Feather name="award" size={18} color={Colors.accentTeal} />
            <Text style={styles.footerTextComplete}> Goal Achieved!</Text>
          </View>
        ) : (
          <>
            <Text style={styles.footerText}>
              {Math.round(progress * 100)}% complete
            </Text>
            <Text style={styles.footerText}>
              {daysLeft >= 0 ? `${daysLeft} days left` : "Deadline Passed"}
            </Text>
          </>
        )}
      </View>
      {ai_suggestion ? (
        <View style={styles.aiSuggestionBox}>
          <Ionicons
            name="sparkles"
            size={20}
            color={Colors.primary}
            style={styles.aiIcon}
          />
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiSuggestionText}>{ai_suggestion}</Text>
          </View>
        </View>
      ) : null}
      {!isCompleted && (
        <>
          <View style={styles.divider} />
          <View style={styles.actionRow}>
            <Text style={[styles.remainingText, { color : 'lightgreen' }]}>
              ₹{amountRemaining.toLocaleString()} to go
            </Text>
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: color }]}
              onPress={() => onAddFundsPress(goal)}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionButtonText, { color }]}>
                Add Funds
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.backgroundLight },

  container: { padding: Spacing.lg, paddingBottom: 120 },

  title: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.primary,
    color: Colors.grayDark,
    marginBottom: Spacing.xl,
  },

  goalCard: {
    backgroundColor: Colors.primaryDeep,
    borderRadius: 20,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  goalTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.semiBold,
    color: Colors.white,
    letterSpacing: 0.3,
  },

  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing.sm,
  },
  savedAmount: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.bold,
    color: Colors.white,
  },
  targetAmount: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.primary,
    color: Colors.backgroundLight,
    marginLeft: Spacing.xs,
  },

  progressBarContainer: {
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.neutralBackground,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  progressBar: { height: "100%", borderRadius: 6 },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 28,
  },
  footerText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.primary,
    color: Colors.backgroundLight,
  },
  footerCompleteContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  footerTextComplete: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.semiBold,
    color: Colors.accentTeal,
  },

  aiSuggestionBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 14,
    padding: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  aiIcon: { marginRight: Spacing.md },
  aiTextContainer: { flex: 1 },
  aiSuggestionText: {
    fontFamily: Fonts.primary,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
    flexWrap: "wrap",
  },

  divider: {
    height: 1,
    backgroundColor: Colors.neutralBackground,
    marginVertical: Spacing.md,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remainingText: {
    fontSize: FontSizes.md,
    marginBottom: Spacing.xs,
    fontFamily: Fonts.primary,
    color: 'Colors.backgroundLight',
    fontWeight: "500",
  },
  actionButton: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: 24,
    borderWidth: 1.5,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  actionButtonText: {
    fontFamily: Fonts.heading,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.sm,
  },

  fab: {
    position: "absolute",
    margin: Spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

  modalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
 modalView: {
  margin: 20,
  backgroundColor: '#ffffff', // bright white background
  borderRadius: 20,
  padding: 30,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 8,
  width: "90%",
},
modalTitle: {
  fontSize: FontSizes.lg,
  fontFamily: Fonts.heading,
  fontWeight: FontWeights.bold,
  marginBottom: 20,
  textAlign: "center",
  color: '#000000', // black title text
},
modalInput: {
  width: "100%",
  height: 48,
  borderColor: '#bbbbbb', // light gray border
  borderWidth: 1,
  borderRadius: 12,
  paddingHorizontal: 15,
  marginBottom: 18,
  fontFamily: Fonts.primary,
  color: '#000000', // black input text
  backgroundColor: '#f2f2f2', // light gray background for inputs
},

  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
    marginTop: 60,
  },
  emptyStateText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.lg,
    fontFamily: Fonts.heading,
    color: Colors.grayDark,
  },
  emptyStateSubText: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.md,
    fontFamily: Fonts.primary,
    color: Colors.grayMedium,
    textAlign: "center",
    lineHeight: 20,
  },
});
export default SavingsGoalScreen;
